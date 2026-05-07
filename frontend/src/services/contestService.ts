import type { Contest } from '@/types';
import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockContests } from './mockData';

interface BackendContest {
  id?: string;
  title?: string;
  description?: string;
  starts_at?: string;
  duration_minutes?: number;
  participants?: number;
  status?: 'Live' | 'Upcoming' | 'Ended';
}

const toContest = (contest: BackendContest, index: number): Contest => ({
  id: contest.id ?? `contest-${index + 1}`,
  title: contest.title ?? `Contest #${index + 1}`,
  description: contest.description ?? 'Join this coding contest.',
  startsAt: contest.starts_at ?? new Date().toISOString(),
  durationMinutes: contest.duration_minutes ?? 90,
  participants: contest.participants ?? 0,
  status: contest.status ?? 'Upcoming',
});

export const contestService = {
  async list() {
    const response = await api.get(ENDPOINTS.contests.list).catch(() => null);
    if (Array.isArray(response?.data?.items)) {
      return (response?.data.items as BackendContest[]).map(toContest);
    }
    return mockContests;
  },
};
