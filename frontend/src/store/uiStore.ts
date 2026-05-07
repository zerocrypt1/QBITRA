import { create } from 'zustand';
import type { ToastMessage } from '@/types';
import { generateClientId } from '@/utils/helpers';

const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

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
    const timer = setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
      toastTimers.delete(id);
    }, 3500);

    toastTimers.set(id, timer);
  },
  removeToast: (id) => {
    const timer = toastTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.delete(id);
    }
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
  },
}));
