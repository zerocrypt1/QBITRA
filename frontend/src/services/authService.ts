import type { User } from '@/types';
import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockUser } from './mockData';

export const authService = {
  async login(email: string, password: string) {
    await api.post(ENDPOINTS.auth.login, { email, password }).catch(() => null);
    return { token: 'demo-token-qbitra', user: mockUser as User };
  },
  async signup(name: string, email: string, password: string) {
    await api.post(ENDPOINTS.auth.signup, { name, email, password }).catch(() => null);
    return { token: 'demo-token-qbitra', user: { ...mockUser, name, email } as User };
  },
};
