const dashboardService = require('../services/dashboard.service');

async function getMetrics(req, res) {
  const metrics = await dashboardService.getMetrics({
    range: req.query.range || '24h',
  });
  res.json({ success: true, data: metrics });
}

module.exports = { getMetrics };
