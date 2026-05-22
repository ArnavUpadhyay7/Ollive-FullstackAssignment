const { Queue } = require('bullmq');
const { getRedisConnection } = require('../config/redis');

const QUEUE_NAME = 'inference-logs';

let queue = null;

function getQueue() {
  if (!queue) {
    queue = new Queue(QUEUE_NAME, {
      connection: getRedisConnection(),
      defaultJobOptions: {
        removeOnComplete: 1000,
        removeOnFail: 5000,
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      },
    });
  }
  return queue;
}

async function enqueueInferenceLog(payload) {
  const q = getQueue();
  await q.add('persist-log', payload, {
    jobId: `${payload.conversationId || 'none'}-${Date.now()}`,
  });
}

module.exports = {
  QUEUE_NAME,
  getQueue,
  enqueueInferenceLog,
};
