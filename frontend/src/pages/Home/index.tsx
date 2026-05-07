import { ArrowRight, Sparkles, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { ProblemCard } from '@/components/problem/ProblemCard';
import { ContestCard } from '@/components/contest/ContestCard';
import { problemService } from '@/services/problemService';
import { contestService } from '@/services/contestService';
import type { Contest, Problem } from '@/types';

const stats = [
  { label: 'Active Coders', value: '84K+' },
  { label: 'Problems', value: '3.2K+' },
  { label: 'Live Contests', value: '18' },
  { label: 'Daily Submissions', value: '1.4M' },
];

const HomePage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([problemService.list(), contestService.list()]).then(([problemItems, contestItems]) => {
      if (!mounted) return;
      setProblems(problemItems);
      setContests(contestItems);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageContainer>
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 px-5 py-10 backdrop-blur-xl md:px-10">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-neon-blue/20 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs text-brand-orange">
          <Sparkles size={12} /> Next-gen coding arena
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
          Build your edge. Compete. <span className="text-brand-orange">Evolve with QBITRA.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-300 md:text-base">
          Futuristic competitive coding workspace with live contests, deep analytics, and blazing fast editor workflows.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button><Link to="/problems" className="inline-flex items-center gap-2">Start Solving <ArrowRight size={14} /></Link></Button>
          <Button variant="ghost"><Link to="/contest">Explore Contests</Link></Button>
        </div>
      </motion.div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-10">
      <SectionHeader title="Featured Problems" subtitle="Curated set to sharpen your core DSA instincts." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {problems.slice(0, 3).map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
      </div>
    </section>

    <section className="mt-10">
      <SectionHeader title="Trending Contests" subtitle="Live and upcoming battles in the arena." />
      <div className="grid gap-4 lg:grid-cols-3">
        {contests.map((contest) => (
          <ContestCard key={contest.id} contest={contest} />
        ))}
      </div>
    </section>

    <section className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-r from-brand-orange/15 to-neon-purple/15 p-6 text-center">
      <p className="text-sm text-slate-200">Ready to climb the leaderboard?</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Push your limits with daily problem streaks.</h3>
      <Button className="mt-4"><Link to="/signup" className="inline-flex items-center gap-2">Create account <Zap size={14} /></Link></Button>
    </section>

    <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-slate-400">
      <p>© {new Date().getFullYear()} QBITRA. All rights reserved.</p>
      <p className="inline-flex items-center gap-1"><Trophy size={14} /> CODE. SOLVE. EVOLVE.</p>
    </footer>
    </PageContainer>
  );
};

export default HomePage;
