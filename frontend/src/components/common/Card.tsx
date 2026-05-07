import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export const Card = ({
  className,
  children,
  hover = true,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) => (
  <motion.div
    whileHover={hover ? { y: -4 } : undefined}
    className={cn(
      'rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.35)]',
      className,
    )}
  >
    {children}
  </motion.div>
);
