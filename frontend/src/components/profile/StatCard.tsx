import { Card } from '@/components/common/Card';

export const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) => (
  <Card>
    <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
  </Card>
);
