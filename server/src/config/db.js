const mongoose = require('mongoose');
const { getEnv } = require('./env');

async function connectDB() {
  const { mongoUri } = getEnv();
  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log('MongoDB connected');
}

module.exports = { connectDB };
