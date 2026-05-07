import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockContests } from './mockData';

export const contestService = {
  async list() {
    const response = await api.get(ENDPOINTS.contests.list).catch(() => null);
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    return mockContests;
  },
};
