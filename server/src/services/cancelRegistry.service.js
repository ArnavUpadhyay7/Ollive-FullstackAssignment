const activeRequests = new Map();

function register(conversationId, abortController) {
  const existing = activeRequests.get(conversationId);
  if (existing) {
    existing.abort();
  }
  activeRequests.set(conversationId, abortController);
}

function unregister(conversationId) {
  activeRequests.delete(conversationId);
}

function cancel(conversationId) {
  const controller = activeRequests.get(conversationId);
  if (!controller) {
    return false;
  }
  controller.abort();
  activeRequests.delete(conversationId);
  return true;
}

function isActive(conversationId) {
  return activeRequests.has(conversationId);
}

module.exports = {
  register,
  unregister,
  cancel,
  isActive,
};
