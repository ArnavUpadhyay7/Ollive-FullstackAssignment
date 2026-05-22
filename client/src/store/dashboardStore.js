import { create } from 'zustand';
import * as dashboardService from '../services/dashboardService';

export const useDashboardStore = create((set) => ({
  metrics: null,
  loading: false,
  error: null,
  range: '24h',

  clearError: () => set({ error: null }),

  fetchMetrics: async (range) => {
    const selectedRange = range || useDashboardStore.getState().range;
    set({ loading: true, error: null, range: selectedRange });

    try {
      const metrics = await dashboardService.fetchMetrics(selectedRange);
      set({ metrics, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
