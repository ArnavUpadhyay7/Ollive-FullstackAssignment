const GeminiProvider = require('./gemini.provider');

const providers = {
  gemini: () => new GeminiProvider(),
};

function getProvider(name = 'gemini') {
  const factory = providers[name];
  if (!factory) {
    throw new Error(`Unsupported provider: ${name}. Available: ${Object.keys(providers).join(', ')}`);
  }
  return factory();
}

function registerProvider(name, factory) {
  providers[name] = factory;
}

module.exports = { getProvider, registerProvider };
