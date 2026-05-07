import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockLeaderboard } from './mockData';

export const leaderboardService = {
  async list() {
    await api.get(ENDPOINTS.leaderboard.list).catch(() => null);
    return mockLeaderboard;
  },
};
