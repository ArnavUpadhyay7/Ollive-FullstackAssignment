class BaseProvider {
  constructor(name) {
    if (new.target === BaseProvider) {
      throw new Error('BaseProvider cannot be instantiated directly');
    }
    this.name = name;
  }

  /**
   * @param {Object} params
   * @param {Array<{role: string, content: string}>} params.messages
   * @param {string} [params.sessionId]
   * @param {string} [params.conversationId]
   * @param {AbortSignal} [params.signal]
   * @returns {Promise<{response: string, metadata: Object}>}
   */
  async generate(_params) {
    throw new Error('generate() must be implemented by provider subclass');
  }
}

module.exports = BaseProvider;
