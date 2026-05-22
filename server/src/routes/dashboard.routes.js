const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/metrics', asyncHandler(dashboardController.getMetrics));

module.exports = router;
