const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_PATTERN = /\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g;
const API_KEY_PATTERN = /\b(?:sk|pk|api|key|token|bearer)[-_]?[a-zA-Z0-9]{16,}\b/gi;
const JWT_PATTERN = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g;

const REDACTED = '[REDACTED]';

function redactString(value) {
  if (typeof value !== 'string') return value;

  return value
    .replace(EMAIL_PATTERN, REDACTED)
    .replace(PHONE_PATTERN, REDACTED)
    .replace(JWT_PATTERN, REDACTED)
    .replace(API_KEY_PATTERN, REDACTED);
}

function redactValue(value) {
  if (typeof value === 'string') {
    return redactString(value);
  }

  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, redactValue(val)])
    );
  }

  return value;
}

function redactInferencePayload(payload) {
  return redactValue(payload);
}

module.exports = {
  redactString,
  redactValue,
  redactInferencePayload,
  REDACTED,
};
