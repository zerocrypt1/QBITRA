import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockProblems } from './mockData';

export const problemService = {
  async list() {
    await api.get(ENDPOINTS.problems.list).catch(() => null);
    return mockProblems;
  },
  async get(id: string) {
    await api.get(ENDPOINTS.problems.byId(id)).catch(() => null);
    return mockProblems.find((problem) => problem.id === id) ?? mockProblems[0];
  },
};
