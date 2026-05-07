import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockProblems } from './mockData';

export const problemService = {
  async list() {
    const response = await api.get(ENDPOINTS.problems.list).catch(() => null);
    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }
    return mockProblems;
  },
  async get(id: string) {
    const response = await api.get(ENDPOINTS.problems.byId(id)).catch(() => null);
    if (response?.data) {
      return response.data;
    }
    return mockProblems.find((problem) => problem.id === id) ?? null;
  },
};
