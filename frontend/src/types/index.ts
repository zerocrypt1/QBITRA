export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  streak: number;
  solvedCount: number;
  role: 'user' | 'admin';
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  acceptance: number;
  points: number;
  solvedBy: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  durationMinutes: number;
  participants: number;
  status: 'Live' | 'Upcoming' | 'Ended';
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  change: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}
