import { Clock3, Users } from 'lucide-react';
import { Card } from '@/components/common/Card';
import type { Contest } from '@/types';
import { formatDateTime, formatNumber } from '@/utils/format';
import { useCountdown } from '@/hooks/useCountdown';

export const ContestCard = ({ contest }: { contest: Contest }) => {
  const countdown = useCountdown(contest.startsAt);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-brand-orange/15 px-3 py-1 text-xs font-semibold text-brand-orange">
          {contest.status}
        </span>
        <p className="text-xs text-slate-400">{formatDateTime(contest.startsAt)}</p>
      </div>
      <h3 className="text-lg font-semibold text-white">{contest.title}</h3>
      <p className="mt-1 text-sm text-slate-300">{contest.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-white/5 p-3">
          <p className="mb-1 flex items-center gap-2 text-slate-400">
            <Clock3 size={14} /> Countdown
          </p>
          <p className="font-mono text-slate-100">
            {countdown.completed
              ? 'Contest started'
              : `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
          </p>
        </div>
        <div className="rounded-xl bg-white/5 p-3">
          <p className="mb-1 flex items-center gap-2 text-slate-400">
            <Users size={14} /> Participants
          </p>
          <p className="font-semibold text-white">{formatNumber(contest.participants)}</p>
        </div>
      </div>
    </Card>
  );
};
