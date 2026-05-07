import type { User } from '@/types';
import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockUser } from './mockData';

const createDevToken = () => {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 }));
  return `${header}.${payload}.dev-signature`;
};

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post(ENDPOINTS.auth.login, { email, password });
      if (response.data?.token && response.data?.user) {
        return { token: response.data.token as string, user: response.data.user as User };
      }
    } catch (error) {
      console.error('Login failed:', error);
    }

    if (import.meta.env.DEV) {
      return { token: createDevToken(), user: mockUser as User };
    }

    throw new Error('Unable to authenticate user.');
  },
  async signup(name: string, email: string, password: string) {
    try {
      const response = await api.post(ENDPOINTS.auth.signup, { name, email, password });
      if (response.data?.token && response.data?.user) {
        return { token: response.data.token as string, user: response.data.user as User };
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }

    if (import.meta.env.DEV) {
      return { token: createDevToken(), user: { ...mockUser, name, email } as User };
    }

    throw new Error('Unable to create account.');
  },
};
