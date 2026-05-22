const express = require('express');
const chatRoutes = require('./chat.routes');
const conversationRoutes = require('./conversation.routes');
const logsRoutes = require('./logs.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/chat', chatRoutes);
router.use('/conversations', conversationRoutes);
router.use('/logs', logsRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
