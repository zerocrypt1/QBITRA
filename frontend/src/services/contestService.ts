import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockContests } from './mockData';

export const contestService = {
  async list() {
    await api.get(ENDPOINTS.contests.list).catch(() => null);
    return mockContests;
  },
};
