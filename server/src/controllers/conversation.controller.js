const conversationService = require('../services/conversation.service');

async function create(req, res) {
  const conversation = await conversationService.createConversation(req.body);
  res.status(201).json({ success: true, data: conversation });
}

async function list(req, res) {
  const conversations = await conversationService.listConversations();
  res.json({ success: true, data: conversations });
}

async function getById(req, res) {
  const conversation = await conversationService.getConversationById(req.params.id);
  res.json({ success: true, data: conversation });
}

async function remove(req, res) {
  await conversationService.deleteConversation(req.params.id);
  res.json({ success: true, message: 'Conversation deleted' });
}

module.exports = { create, list, getById, remove };
