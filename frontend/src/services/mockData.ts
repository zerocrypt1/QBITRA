import type { Contest, LeaderboardEntry, Problem, User } from '@/types';

export const mockProblems: Problem[] = [
  { id: 'two-sum', title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hashing'], acceptance: 82.3, points: 100, solvedBy: 72891 },
  { id: 'network-delay', title: 'Network Delay Time', difficulty: 'Medium', tags: ['Graph', 'Dijkstra'], acceptance: 54.6, points: 240, solvedBy: 19324 },
  { id: 'distinct-palindrome', title: 'Distinct Palindrome Subsequences', difficulty: 'Hard', tags: ['DP', 'String'], acceptance: 31.8, points: 390, solvedBy: 5482 },
  { id: 'max-subarray', title: 'Maximum Subarray', difficulty: 'Easy', tags: ['DP', 'Array'], acceptance: 68.2, points: 110, solvedBy: 62011 },
  { id: 'word-ladder', title: 'Word Ladder', difficulty: 'Medium', tags: ['Graph', 'BFS'], acceptance: 45.9, points: 260, solvedBy: 14002 },
  { id: 'segment-tree-beats', title: 'Segment Tree Beats', difficulty: 'Hard', tags: ['Segment Tree', 'Math'], acceptance: 21.4, points: 480, solvedBy: 1723 },
];

export const mockContests: Contest[] = [
  { id: 'c1', title: 'Nebula Sprint #27', description: '90-minute high-intensity algorithmic sprint.', startsAt: new Date(Date.now() + 7_200_000).toISOString(), durationMinutes: 90, participants: 3412, status: 'Upcoming' },
  { id: 'c2', title: 'Quantum Arena Finals', description: 'Elite rated live finals with anti-cheat rounds.', startsAt: new Date(Date.now() + 18_000_000).toISOString(), durationMinutes: 150, participants: 918, status: 'Live' },
  { id: 'c3', title: 'Graph Masters Cup', description: 'Specialized challenge focused on graph algorithms.', startsAt: new Date(Date.now() + 86_400_000).toISOString(), durationMinutes: 120, participants: 2110, status: 'Upcoming' },
];

export const mockUser: User = {
  id: 'u1',
  name: 'Aarav Mehta',
  email: 'aarav@qbitra.dev',
  avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Aarav',
  rating: 1912,
  streak: 12,
  solvedCount: 428,
  role: 'admin',
};

export const mockLeaderboard: LeaderboardEntry[] = Array.from({ length: 12 }, (_, index) => ({
  rank: index + 1,
  change: (index % 3) - 1,
  user: {
    ...mockUser,
    id: `u-${index + 1}`,
    name: ['Aarav', 'Maya', 'Noah', 'Ivy', 'Liam', 'Sara', 'Nora', 'Ethan', 'Aria', 'Zoe', 'Milan', 'Riya'][index],
    rating: 2200 - index * 43,
    streak: 18 - index,
    solvedCount: 560 - index * 17,
    avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=user-${index + 1}`,
    role: 'user',
  },
}));
