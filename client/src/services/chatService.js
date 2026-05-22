import { api } from '../lib/api';

export async function sendMessage({ conversationId, message, sessionId, provider, signal }) {
  const response = await api.post(
    '/chat',
    { conversationId, message, sessionId, provider },
    { signal }
  );
  return response.data;
}

export async function cancelGeneration(conversationId) {
  const response = await api.post('/chat/cancel', { conversationId });
  return response.data;
}
