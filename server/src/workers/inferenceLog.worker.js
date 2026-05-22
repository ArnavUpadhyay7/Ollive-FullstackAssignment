const { Worker } = require('bullmq');
const { getRedisConnection } = require('../config/redis');
const { QUEUE_NAME } = require('../queue/inferenceLog.queue');
const inferenceLogService = require('../services/inferenceLog.service');
const { connectDB } = require('../config/db');

async function startWorker() {
  await connectDB();

  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      await inferenceLogService.persistFromQueue(job.data);
    },
    {
      connection: getRedisConnection(),
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.log(`Inference log job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Inference log job ${job?.id} failed:`, err.message);
  });

  console.log('Inference log worker started');
  return worker;
}

if (require.main === module) {
  startWorker().catch((err) => {
    console.error('Worker failed to start:', err);
    process.exit(1);
  });
}

module.exports = { startWorker };
