const { GoogleGenerativeAI } = require('@google/generative-ai');
const BaseProvider = require('./base.provider');
const { getEnv } = require('../config/env');
const { buildPreview } = require('../utils/preview');
const ApiError = require('../utils/ApiError');

class GeminiProvider extends BaseProvider {
  constructor() {
    super('gemini');
    const { geminiApiKey, geminiModel } = getEnv();
    this.client = new GoogleGenerativeAI(geminiApiKey);
    this.modelName = geminiModel;
  }

  _mapMessages(messages) {
    return messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));
  }

  async generate({ messages, sessionId, conversationId, signal }) {
    const startedAt = Date.now();
    const requestPreview = buildPreview(
      messages.map((m) => `${m.role}: ${m.content}`).join('\n')
    );

    let status = 'success';
    let responseText = '';
    let errors = [];
    let tokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };

    try {
      if (signal?.aborted) {
        const abortErr = new Error('Aborted');
        abortErr.name = 'AbortError';
        throw abortErr;
      }

      const model = this.client.getGenerativeModel({ model: this.modelName });
      const history = this._mapMessages(messages.slice(0, -1));
      const lastMessage = messages[messages.length - 1];

      if (!lastMessage || lastMessage.role !== 'user') {
        throw ApiError.badRequest('Last message must be from user');
      }

      const chat = model.startChat({ history });

      const generationPromise = chat.sendMessage(lastMessage.content);
      const result = signal
        ? await Promise.race([
            generationPromise,
            new Promise((_, reject) => {
              if (signal.aborted) {
                reject(Object.assign(new Error('Aborted'), { name: 'AbortError' }));
                return;
              }
              signal.addEventListener(
                'abort',
                () => reject(Object.assign(new Error('Aborted'), { name: 'AbortError' })),
                { once: true }
              );
            }),
          ])
        : await generationPromise;

      responseText = result.response.text();

      const usage = result.response.usageMetadata;
      if (usage) {
        tokenUsage = {
          promptTokens: usage.promptTokenCount || 0,
          completionTokens: usage.candidatesTokenCount || 0,
          totalTokens: usage.totalTokenCount || 0,
        };
      }
    } catch (error) {
      if (signal?.aborted || error.name === 'AbortError') {
        status = 'cancelled';
        errors = ['Generation cancelled by user'];
      } else {
        status = 'error';
        errors = [error.message || 'Unknown provider error'];
      }
      throw error;
    } finally {
      const latency = Date.now() - startedAt;

      this._lastMetadata = {
        provider: this.name,
        model: this.modelName,
        latency,
        tokenUsage,
        status,
        timestamp: new Date(),
        conversationId,
        sessionId,
        requestPreview,
        responsePreview: buildPreview(responseText),
        errors,
      };
    }

    return {
      response: responseText,
      metadata: this._lastMetadata,
    };
  }

  getLastMetadata() {
    return this._lastMetadata;
  }
}

module.exports = GeminiProvider;
