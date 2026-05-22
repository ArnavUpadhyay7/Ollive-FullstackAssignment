const { getProvider } = require('../providers/provider.factory');
const { enqueueInferenceLog } = require('../queue/inferenceLog.queue');

async function generateResponse({
  messages,
  sessionId,
  conversationId,
  providerName = 'gemini',
  signal,
}) {
  const provider = getProvider(providerName);
  let result;
  let metadata;

  try {
    result = await provider.generate({
      messages,
      sessionId,
      conversationId,
      signal,
    });
    metadata = result.metadata;
    return result;
  } catch (error) {
    metadata = provider.getLastMetadata?.() || {
      provider: providerName,
      model: 'unknown',
      latency: 0,
      tokenUsage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      status: signal?.aborted ? 'cancelled' : 'error',
      timestamp: new Date(),
      conversationId,
      sessionId,
      requestPreview: '',
      responsePreview: '',
      errors: [error.message],
    };
    throw error;
  } finally {
    if (metadata) {
      await enqueueInferenceLog(metadata);
    }
  }
}

module.exports = { generateResponse };
