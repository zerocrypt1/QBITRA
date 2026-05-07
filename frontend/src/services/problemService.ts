import type { Difficulty, Problem } from '@/types';
import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockProblems } from './mockData';

interface BackendProblem {
  id: string;
  title: string;
  difficulty: string;
  tags?: string[];
}

const toDifficulty = (value: string): Difficulty => {
  const normalized = value.toLowerCase();
  if (normalized === 'easy') return 'Easy';
  if (normalized === 'medium') return 'Medium';
  return 'Hard';
};

const toProblem = (problem: BackendProblem): Problem => ({
  id: problem.id,
  title: problem.title,
  difficulty: toDifficulty(problem.difficulty),
  tags: problem.tags ?? [],
  acceptance: 0,
  points: 0,
  solvedBy: 0,
});

export const problemService = {
  async list() {
    const response = await api.get(ENDPOINTS.problems.list).catch(() => null);
    if (Array.isArray(response?.data?.items)) {
      return (response?.data.items as BackendProblem[]).map(toProblem);
    }
    return mockProblems;
  },
  async get(id: string) {
    const response = await api.get(ENDPOINTS.problems.byId(id)).catch(() => null);
    if (response?.data?.id) {
      return toProblem(response.data as BackendProblem);
    }
    return mockProblems.find((problem) => problem.id === id) ?? null;
  },
};
