import { useUIStore } from '@/store/uiStore';

export const useToast = () => {
  const pushToast = useUIStore((state) => state.pushToast);

  return {
    info: (title: string, description?: string) => pushToast({ title, description, type: 'info' }),
    success: (title: string, description?: string) => pushToast({ title, description, type: 'success' }),
    warning: (title: string, description?: string) => pushToast({ title, description, type: 'warning' }),
    error: (title: string, description?: string) => pushToast({ title, description, type: 'error' }),
  };
};
