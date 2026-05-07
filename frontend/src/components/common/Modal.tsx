import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ open, title, onClose, children }: ModalProps) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-xl rounded-2xl border border-white/10 bg-surface-card p-5"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" aria-label="Close" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
