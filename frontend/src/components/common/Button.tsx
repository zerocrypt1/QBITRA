import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-orange text-black hover:bg-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.35)] focus:ring-brand-orange/60',
  secondary: 'bg-surface-elevated text-white hover:bg-surface-border border border-surface-border-bright',
  ghost: 'bg-transparent text-slate-200 hover:bg-white/10 border border-white/10',
};

export const Button = ({ className, variant = 'primary', children, ...props }: ButtonProps) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    whileHover={{ y: -1 }}
    className={cn(
      'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2',
      variants[variant],
      className,
    )}
    {...props}
  >
    {children}
  </motion.button>
);
