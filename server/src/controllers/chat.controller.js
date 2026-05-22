const chatService = require('../services/chat.service');

async function sendChat(req, res) {
  const { conversationId, message, sessionId, provider } = req.body;
  const result = await chatService.sendMessage({
    conversationId,
    content: message,
    sessionId,
    providerName: provider,
  });

  res.json({
    success: true,
    data: {
      userMessage: result.userMessage,
      assistantMessage: result.assistantMessage,
      metadata: result.metadata,
    },
  });
}

async function cancel(req, res) {
  const { conversationId } = req.body;
  const result = chatService.cancelGeneration(conversationId);
  res.json({ success: true, data: result });
}

module.exports = { sendChat, cancel };
