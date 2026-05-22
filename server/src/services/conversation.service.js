const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ApiError = require('../utils/ApiError');

async function createConversation({ title } = {}) {
  return Conversation.create({
    title: title || 'New conversation',
  });
}

async function listConversations() {
  return Conversation.find().sort({ updatedAt: -1 }).lean();
}

async function getConversationById(id) {
  const conversation = await Conversation.findById(id).lean();
  if (!conversation) {
    throw ApiError.notFound('Conversation not found');
  }

  const messages = await Message.find({ conversationId: id })
    .sort({ timestamp: 1 })
    .lean();

  return { ...conversation, messages };
}

async function deleteConversation(id) {
  const conversation = await Conversation.findByIdAndDelete(id);
  if (!conversation) {
    throw ApiError.notFound('Conversation not found');
  }

  await Message.deleteMany({ conversationId: id });
  return conversation;
}

async function updateTitleFromFirstMessage(conversationId, content) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || conversation.title !== 'New conversation') {
    return;
  }

  conversation.title = content.slice(0, 80) || 'New conversation';
  await conversation.save();
}

module.exports = {
  createConversation,
  listConversations,
  getConversationById,
  deleteConversation,
  updateTitleFromFirstMessage,
};
