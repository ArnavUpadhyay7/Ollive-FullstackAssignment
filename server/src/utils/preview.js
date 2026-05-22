const { getEnv } = require('../config/env');
const { redactString } = require('./piiRedaction');

function buildPreview(content) {
  const { previewMaxLength } = getEnv();
  if (!content) return '';

  const text = typeof content === 'string' ? content : JSON.stringify(content);
  const redacted = redactString(text);
  return redacted.length > previewMaxLength
    ? `${redacted.slice(0, previewMaxLength)}...`
    : redacted;
}

module.exports = { buildPreview };
