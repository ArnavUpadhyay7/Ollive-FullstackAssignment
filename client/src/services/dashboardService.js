import { api } from '../lib/api';

export async function fetchMetrics(range = '24h') {
  const response = await api.get('/dashboard/metrics', { params: { range } });
  return response.data;
}
