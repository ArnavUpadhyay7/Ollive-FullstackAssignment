const InferenceLog = require('../models/InferenceLog');

function parseTimeRange(range = '24h') {
  const units = { h: 3600000, d: 86400000 };
  const match = range.match(/^(\d+)(h|d)$/);
  if (!match) return 24 * 3600000;
  return parseInt(match[1], 10) * units[match[2]];
}

async function getMetrics({ range = '24h' } = {}) {
  const since = new Date(Date.now() - parseTimeRange(range));

  const [aggregate, requestsOverTime, tokenBreakdown] = await Promise.all([
    InferenceLog.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          avgLatency: { $avg: '$latency' },
          totalTokens: { $sum: '$tokenUsage.totalTokens' },
          errorCount: {
            $sum: {
              $cond: [{ $in: ['$status', ['error', 'cancelled']] }, 1, 0],
            },
          },
        },
      },
    ]),
    InferenceLog.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%dT%H:00:00', date: '$createdAt' },
          },
          count: { $sum: 1 },
          errors: {
            $sum: {
              $cond: [{ $eq: ['$status', 'error'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    InferenceLog.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: '$provider',
          promptTokens: { $sum: '$tokenUsage.promptTokens' },
          completionTokens: { $sum: '$tokenUsage.completionTokens' },
          totalTokens: { $sum: '$tokenUsage.totalTokens' },
        },
      },
    ]),
  ]);

  const stats = aggregate[0] || {
    totalRequests: 0,
    avgLatency: 0,
    totalTokens: 0,
    errorCount: 0,
  };

  const rangeMs = parseTimeRange(range);
  const throughputPerMinute =
    stats.totalRequests > 0
      ? (stats.totalRequests / (rangeMs / 60000)).toFixed(2)
      : '0.00';

  const errorRate =
    stats.totalRequests > 0
      ? ((stats.errorCount / stats.totalRequests) * 100).toFixed(2)
      : '0.00';

  return {
    avgLatencyMs: Math.round(stats.avgLatency || 0),
    throughputPerMinute: parseFloat(throughputPerMinute),
    totalRequests: stats.totalRequests,
    errorRatePercent: parseFloat(errorRate),
    tokenUsage: {
      total: stats.totalTokens,
      byProvider: tokenBreakdown,
    },
    requestsOverTime: requestsOverTime.map((bucket) => ({
      hour: bucket._id,
      count: bucket.count,
      errors: bucket.errors,
    })),
    range,
    since,
  };
}

module.exports = { getMetrics, parseTimeRange };
