const inferenceLogService = require('../services/inferenceLog.service');

async function ingest(req, res) {
  const result = await inferenceLogService.ingestLog(req.body);
  res.status(202).json({ success: true, data: result });
}

module.exports = { ingest };
