import { Link } from 'react-router-dom';
import type { Problem } from '@/types';

export const ProblemTable = ({ problems }: { problems: Problem[] }) => (
  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px]">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-slate-400">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Difficulty</th>
            <th className="px-4 py-3">Acceptance</th>
            <th className="px-4 py-3">Points</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.id} className="border-b border-white/5 text-sm text-slate-200 transition hover:bg-white/[0.04]">
              <td className="px-4 py-3">{problem.title}</td>
              <td className="px-4 py-3">{problem.difficulty}</td>
              <td className="px-4 py-3">{problem.acceptance.toFixed(1)}%</td>
              <td className="px-4 py-3">{problem.points}</td>
              <td className="px-4 py-3 text-right">
                <Link to={`/problems/${problem.id}`} className="font-semibold text-brand-orange">
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
