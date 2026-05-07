import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = ({ label, hint, className, id, ...props }: InputProps) => (
  <label htmlFor={id} className="block space-y-2">
    {label ? <span className="text-sm font-medium text-slate-200">{label}</span> : null}
    <input
      id={id}
      className={cn(
        'w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none transition focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/30',
        className,
      )}
      {...props}
    />
    {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
  </label>
);
