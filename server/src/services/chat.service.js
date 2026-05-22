const Message = require('../models/Message');
const conversationService = require('./conversation.service');
const { generateResponse } = require('./inference.service');
const cancelRegistry = require('./cancelRegistry.service');
const ApiError = require('../utils/ApiError');
const { getEnv } = require('../config/env');

async function getContextMessages(conversationId) {
  const { contextMessageLimit } = getEnv();
  const messages = await Message.find({ conversationId })
    .sort({ timestamp: -1 })
    .limit(contextMessageLimit)
    .lean();

  return messages.reverse().map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

async function sendMessage({ conversationId, content, sessionId, providerName }) {
  await conversationService.getConversationById(conversationId);

  const userMessage = await Message.create({
    conversationId,
    role: 'user',
    content,
    timestamp: new Date(),
  });

  await conversationService.updateTitleFromFirstMessage(conversationId, content);

  const contextMessages = await getContextMessages(conversationId);
  const abortController = new AbortController();
  cancelRegistry.register(conversationId, abortController);

  let assistantContent = '';
  let metadata = null;

  try {
    const { response, metadata: inferenceMeta } = await generateResponse({
      messages: contextMessages,
      sessionId,
      conversationId: String(conversationId),
      providerName,
      signal: abortController.signal,
    });

    assistantContent = response;
    metadata = inferenceMeta;

    const assistantMessage = await Message.create({
      conversationId,
      role: 'assistant',
      content: assistantContent,
      timestamp: new Date(),
    });

    return {
      userMessage,
      assistantMessage,
      metadata,
    };
  } catch (error) {
    if (abortController.signal.aborted) {
      throw ApiError.badRequest('Generation cancelled');
    }
    throw error;
  } finally {
    cancelRegistry.unregister(conversationId);
  }
}

function cancelGeneration(conversationId) {
  const cancelled = cancelRegistry.cancel(conversationId);
  if (!cancelled) {
    throw ApiError.notFound('No active generation for this conversation');
  }
  return { cancelled: true, conversationId };
}

module.exports = {
  sendMessage,
  cancelGeneration,
  getContextMessages,
};
