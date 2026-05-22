const express = require('express');
const conversationController = require('../controllers/conversation.controller');
const asyncHandler = require('../utils/asyncHandler');
const { validateObjectId } = require('../middleware/validate');

const router = express.Router();

router.get('/', asyncHandler(conversationController.list));
router.post('/', asyncHandler(conversationController.create));
router.get(
  '/:id',
  validateObjectId('id'),
  asyncHandler(conversationController.getById)
);
router.delete(
  '/:id',
  validateObjectId('id'),
  asyncHandler(conversationController.remove)
);

module.exports = router;
