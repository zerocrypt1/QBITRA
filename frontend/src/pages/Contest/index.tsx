import { Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ContestCard } from '@/components/contest/ContestCard';
import { Card } from '@/components/common/Card';
import { contestService } from '@/services/contestService';
import { leaderboardService } from '@/services/leaderboardService';
import type { Contest, LeaderboardEntry } from '@/types';

const ContestPage = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([contestService.list(), leaderboardService.list()]).then(([contestItems, ranking]) => {
      if (!mounted) return;
      setContests(contestItems);
      setLeaderboard(ranking);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageContainer>
    <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 p-5">
      <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs text-white">
        <Rocket size={12} /> Live Arena
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-white">Compete in real-time coding battles</h1>
      <p className="mt-2 text-sm text-slate-200">Join ranked contests, beat the clock, and climb global standings.</p>
    </div>

    <SectionHeader title="Contests" subtitle="Live and upcoming events" />
    <div className="grid gap-4 lg:grid-cols-3">
      {contests.map((contest) => (
        <ContestCard key={contest.id} contest={contest} />
      ))}
    </div>

    <section className="mt-8">
      <SectionHeader title="Ranking Preview" subtitle="Current top performers" />
      <Card>
        <ul className="space-y-2 text-sm">
          {leaderboard.slice(0, 5).map((entry) => (
            <li key={entry.user.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <span>#{entry.rank} {entry.user.name}</span>
              <span className="font-mono text-brand-orange">{entry.user.rating}</span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
    </PageContainer>
  );
};

export default ContestPage;
