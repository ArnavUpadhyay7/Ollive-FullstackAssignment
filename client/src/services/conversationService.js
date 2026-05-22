import { api } from '../lib/api';

export async function listConversations() {
  const response = await api.get('/conversations');
  return response.data;
}

export async function createConversation(title) {
  const response = await api.post('/conversations', title ? { title } : {});
  return response.data;
}

export async function getConversation(id) {
  const response = await api.get(`/conversations/${id}`);
  return response.data;
}

export async function deleteConversation(id) {
  const response = await api.delete(`/conversations/${id}`);
  return response;
}
