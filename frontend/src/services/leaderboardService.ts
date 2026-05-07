import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockLeaderboard } from './mockData';

export const leaderboardService = {
  async list() {
    const response = await api.get(ENDPOINTS.leaderboard.list).catch(() => null);
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    return mockLeaderboard;
  },
};
