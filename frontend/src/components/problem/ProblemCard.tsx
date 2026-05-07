import { motion } from 'framer-motion';
import { ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import type { Problem } from '@/types';
import { formatPercent } from '@/utils/format';
import { cn } from '@/utils/cn';

const difficultyClasses: Record<Problem['difficulty'], string> = {
  Easy: 'text-emerald-300 bg-emerald-500/15',
  Medium: 'text-amber-300 bg-amber-500/15',
  Hard: 'text-rose-300 bg-rose-500/15',
};

export const ProblemCard = ({ problem }: { problem: Problem }) => (
  <motion.div whileHover={{ y: -5 }}>
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-white">{problem.title}</p>
          <p className="mt-1 text-xs text-slate-400">Acceptance {formatPercent(problem.acceptance)}</p>
        </div>
        <span className={cn('rounded-full px-2 py-1 text-xs', difficultyClasses[problem.difficulty])}>
          {problem.difficulty}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {problem.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-1 text-xs text-slate-300">
            <Tag size={12} />
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5">
        <Link
          to={`/problems/${problem.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-orange transition hover:gap-2"
        >
          Solve now <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  </motion.div>
);
