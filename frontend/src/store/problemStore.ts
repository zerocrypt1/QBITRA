import { create } from 'zustand';
import type { Difficulty } from '@/types';

interface ProblemState {
  query: string;
  difficulty: Difficulty | 'All';
  tags: string[];
  setQuery: (value: string) => void;
  setDifficulty: (value: Difficulty | 'All') => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
}

export const useProblemStore = create<ProblemState>((set) => ({
  query: '',
  difficulty: 'All',
  tags: [],
  setQuery: (value) => set({ query: value }),
  setDifficulty: (value) => set({ difficulty: value }),
  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag) ? state.tags.filter((item) => item !== tag) : [...state.tags, tag],
    })),
  clearFilters: () => set({ query: '', difficulty: 'All', tags: [] }),
}));
