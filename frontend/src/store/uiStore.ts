import { create } from 'zustand';
import type { ToastMessage } from '@/types';
import { generateClientId } from '@/utils/helpers';

interface UIState {
  mobileNavOpen: boolean;
  toasts: ToastMessage[];
  setMobileNavOpen: (open: boolean) => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileNavOpen: false,
  toasts: [],
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  pushToast: (toast) => {
    const id = generateClientId();
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
    }, 3500);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
}));
