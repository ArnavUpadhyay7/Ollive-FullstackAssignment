const { generateResponse } = require('../services/inference.service');

/**
 * Public SDK surface for LLM inference with automatic metadata capture.
 * Delegates to provider abstraction; logs are enqueued asynchronously.
 */
module.exports = {
  generateResponse,
};
