import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { PageContainer } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { mockLeaderboard } from '@/services/mockData';

const TrendIcon = ({ change }: { change: number }) => {
  if (change > 0) return <ArrowUp size={14} className="text-emerald-300" />;
  if (change < 0) return <ArrowDown size={14} className="text-rose-300" />;
  return <Minus size={14} className="text-slate-400" />;
};

const LeaderboardPage = () => (
  <PageContainer>
    <SectionHeader title="Leaderboard" subtitle="Global rankings, ratings, and streak performance." />
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Coder</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Streak</th>
              <th className="px-4 py-3">Solved</th>
              <th className="px-4 py-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((entry) => (
              <tr key={entry.user.id} className="border-t border-white/5 hover:bg-white/[0.04]">
                <td className="px-4 py-3 font-semibold text-white">#{entry.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={entry.user.avatar} alt={entry.user.name} className="h-9 w-9 rounded-full border border-white/20" />
                    <span>{entry.user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-brand-orange">{entry.user.rating}</td>
                <td className="px-4 py-3">{entry.user.streak} days</td>
                <td className="px-4 py-3">{entry.user.solvedCount}</td>
                <td className="px-4 py-3"><TrendIcon change={entry.change} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </PageContainer>
);

export default LeaderboardPage;
