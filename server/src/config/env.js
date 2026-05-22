require('dotenv').config();

function getRequiredKeys() {
  const keys = ['MONGO_URI'];
  if (process.env.SERVICE_ROLE !== 'worker') {
    keys.push('GEMINI_API_KEY');
  }
  return keys;
}

function getEnv() {
  const missing = getRequiredKeys().filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI,
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    previewMaxLength: parseInt(process.env.PREVIEW_MAX_LENGTH || '500', 10),
    contextMessageLimit: parseInt(process.env.CONTEXT_MESSAGE_LIMIT || '20', 10),
  };
}

module.exports = { getEnv };
