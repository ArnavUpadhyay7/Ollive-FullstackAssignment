const createApp = require('./app');
const { connectDB } = require('./config/db');
const { getEnv } = require('./config/env');

async function startServer() {
  const { port, nodeEnv } = getEnv();

  await connectDB();

  const app = createApp();

  app.listen(port, () => {
    console.log(`Server running on port ${port} (${nodeEnv})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
