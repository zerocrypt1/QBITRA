import type { User } from '@/types';
import { api } from '@/api/axios';
import { ENDPOINTS } from '@/api/endpoints';
import { mockUser } from './mockData';

interface MeResponse {
  user_id: string;
  role?: string;
}

const toUser = (data: MeResponse): User => {
  const userPrefix = data.user_id.slice(0, 6);
  return {
    id: data.user_id,
    name: `user-${userPrefix}`,
    email: `${userPrefix}@qbitra.local`,
    avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${data.user_id}`,
    rating: 0,
    streak: 0,
    solvedCount: 0,
    role: data.role === 'admin' ? 'admin' : 'user',
  };
};

export const userService = {
  async me() {
    const response = await api.get(ENDPOINTS.users.me).catch(() => null);
    if (response?.data?.user_id) {
      return toUser(response.data as MeResponse);
    }
    return mockUser;
  },
};
