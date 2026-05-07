import { create } from 'zustand';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { storage } from '@/utils/storage';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const initialToken = localStorage.getItem(STORAGE_KEYS.authToken);
const initialUser = storage.get<User>(STORAGE_KEYS.authUser);

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: initialUser,
  isAuthenticated: Boolean(initialToken),
  login: (token, user) => {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    storage.set(STORAGE_KEYS.authUser, user);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    storage.remove(STORAGE_KEYS.authUser);
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
