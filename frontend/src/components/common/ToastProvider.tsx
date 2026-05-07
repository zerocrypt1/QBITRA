import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

const iconByType = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: AlertCircle,
};

export const ToastProvider = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = iconByType[toast.type ?? 'info'];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              className="pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-white/15 bg-surface-card p-3 shadow-xl"
            >
              <Icon size={18} className="mt-0.5 text-brand-orange" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                {toast.description ? <p className="text-xs text-slate-300">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
