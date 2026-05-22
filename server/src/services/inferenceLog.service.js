const InferenceLog = require('../models/InferenceLog');
const { redactInferencePayload } = require('../utils/piiRedaction');
const { enqueueInferenceLog } = require('../queue/inferenceLog.queue');
const ApiError = require('../utils/ApiError');

const REQUIRED_LOG_FIELDS = ['provider', 'model', 'latency', 'status'];

function extractMetadata(rawPayload) {
  const payload = typeof rawPayload === 'string' ? JSON.parse(rawPayload) : rawPayload;

  const tokenUsage = payload.tokenUsage || payload.tokens || {};
  const normalizedTokens = {
    promptTokens: tokenUsage.promptTokens ?? tokenUsage.prompt ?? 0,
    completionTokens: tokenUsage.completionTokens ?? tokenUsage.completion ?? 0,
    totalTokens:
      tokenUsage.totalTokens ??
      tokenUsage.total ??
      (tokenUsage.promptTokens ?? 0) + (tokenUsage.completionTokens ?? 0),
  };

  return {
    provider: payload.provider,
    model: payload.model,
    latency: Number(payload.latency ?? payload.latencyMs ?? 0),
    tokenUsage: normalizedTokens,
    status: payload.status || 'success',
    requestPreview: payload.requestPreview || payload.inputPreview || '',
    responsePreview: payload.responsePreview || payload.outputPreview || '',
    errors: Array.isArray(payload.errors) ? payload.errors : payload.error ? [payload.error] : [],
    conversationId: payload.conversationId || null,
    sessionId: payload.sessionId || null,
    metadata: payload.metadata || {},
    timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
  };
}

function validateLogPayload(payload) {
  const missing = REQUIRED_LOG_FIELDS.filter((field) => payload[field] === undefined);
  if (missing.length > 0) {
    throw ApiError.badRequest(`Missing required log fields: ${missing.join(', ')}`);
  }

  if (!['success', 'error', 'cancelled'].includes(payload.status)) {
    throw ApiError.badRequest('status must be success, error, or cancelled');
  }

  if (Number.isNaN(payload.latency) || payload.latency < 0) {
    throw ApiError.badRequest('latency must be a non-negative number');
  }
}

async function ingestLog(rawPayload) {
  const extracted = extractMetadata(rawPayload);
  validateLogPayload(extracted);

  const redacted = redactInferencePayload(extracted);
  await enqueueInferenceLog(redacted);

  return { queued: true, conversationId: redacted.conversationId };
}

async function persistFromQueue(payload) {
  const redacted = redactInferencePayload(payload);

  await InferenceLog.create({
    provider: redacted.provider,
    model: redacted.model,
    latency: redacted.latency,
    tokenUsage: redacted.tokenUsage,
    status: redacted.status,
    requestPreview: redacted.requestPreview,
    responsePreview: redacted.responsePreview,
    errors: redacted.errors,
    conversationId: redacted.conversationId,
    sessionId: redacted.sessionId,
    metadata: redacted.metadata,
    createdAt: redacted.timestamp,
  });
}

module.exports = {
  ingestLog,
  persistFromQueue,
  extractMetadata,
  validateLogPayload,
};
