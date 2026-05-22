const IORedis = require('ioredis');
const { getEnv } = require('./env');

let connection = null;

function getRedisConnection() {
  if (!connection) {
    const { redisUrl } = getEnv();
    connection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    });
  }
  return connection;
}

module.exports = { getRedisConnection };
