import { create } from 'zustand';
import type { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';
import { storage } from '@/utils/storage';
import { isTokenExpired } from '@/utils/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const resolveInitialAuthState = () => {
  const persistedToken = localStorage.getItem(STORAGE_KEYS.authToken);
  const token = persistedToken && !isTokenExpired(persistedToken) ? persistedToken : null;
  const user = token ? storage.get<User>(STORAGE_KEYS.authUser) : null;

  if (!token && persistedToken) {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    storage.remove(STORAGE_KEYS.authUser);
  }

  return { token, user };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = resolveInitialAuthState();

  return {
    token: initialState.token,
    user: initialState.user,
    isAuthenticated: Boolean(initialState.token),
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
  };
});
