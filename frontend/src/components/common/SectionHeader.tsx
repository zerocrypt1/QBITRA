import type { ReactNode } from 'react';

export const SectionHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) => (
  <div className="mb-6 flex items-end justify-between gap-3">
    <div>
      <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
    </div>
    {action}
  </div>
);
