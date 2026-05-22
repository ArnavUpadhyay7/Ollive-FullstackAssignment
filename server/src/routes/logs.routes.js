const express = require('express');
const logsController = require('../controllers/logs.controller');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', asyncHandler(logsController.ingest));

module.exports = router;
