const express = require('express');
const chatController = require('../controllers/chat.controller');
const asyncHandler = require('../utils/asyncHandler');
const { validateBody } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  validateBody(['conversationId', 'message']),
  asyncHandler(chatController.sendChat)
);

router.post(
  '/cancel',
  validateBody(['conversationId']),
  asyncHandler(chatController.cancel)
);

module.exports = router;
