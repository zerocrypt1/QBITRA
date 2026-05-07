import type { LeaderboardEntry } from '@/types';
import { mockLeaderboard } from './mockData';
import { userService } from './userService';

export const leaderboardService = {
  async list() {
    try {
      const me = await userService.me();
      const mineEntry: LeaderboardEntry = {
        rank: 1,
        change: 0,
        user: me,
      };
      return [mineEntry, ...mockLeaderboard.filter((entry) => entry.user.id !== me.id)];
    } catch {
      return mockLeaderboard;
    }
  },
};
