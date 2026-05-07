import { mockLeaderboard } from './mockData';

export const leaderboardService = {
  async list() {
    return mockLeaderboard;
  },
};
