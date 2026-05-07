import type { User } from '@/types';
import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockUser } from './mockData';

const createDevToken = () => {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 }));
  return `${header}.${payload}.dev-signature`;
};

interface BackendUser {
  id: string;
  email: string;
  username?: string;
  role?: string;
  rating?: number;
  solved_problems?: string[];
  avatar_key?: string;
}

const toUser = (user: BackendUser): User => ({
  id: user.id,
  name: user.username ?? user.email.split('@')[0] ?? 'User',
  email: user.email,
  avatar: user.avatar_key || `https://api.dicebear.com/9.x/adventurer/svg?seed=${user.id}`,
  rating: user.rating ?? 0,
  streak: 0,
  solvedCount: user.solved_problems?.length ?? 0,
  role: user.role === 'admin' ? 'admin' : 'user',
});

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post(ENDPOINTS.auth.login, { email, password });
      if (response.data?.access_token && response.data?.user) {
        return { token: response.data.access_token as string, user: toUser(response.data.user as BackendUser) };
      }
    } catch (error) {
      console.error('Login failed:', error);
    }

    if (import.meta.env.DEV) {
      return { token: createDevToken(), user: mockUser as User };
    }

    throw new Error('Unable to authenticate user.');
  },
  async signup(username: string, email: string, password: string) {
    try {
      const response = await api.post(ENDPOINTS.auth.signup, { username, email, password });
      if (response.data?.access_token && response.data?.user) {
        return { token: response.data.access_token as string, user: toUser(response.data.user as BackendUser) };
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }

    if (import.meta.env.DEV) {
      return { token: createDevToken(), user: { ...mockUser, name: username, email } as User };
    }

    throw new Error('Unable to create account.');
  },
};
