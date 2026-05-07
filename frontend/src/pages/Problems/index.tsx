import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ProblemFilters } from '@/components/problem/ProblemFilters';
import { ProblemCard } from '@/components/problem/ProblemCard';
import { ProblemTable } from '@/components/problem/ProblemTable';
import { Button } from '@/components/common/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { useProblemStore } from '@/store/problemStore';
import { mockProblems } from '@/services/mockData';

const PAGE_SIZE = 4;

const ProblemsPage = () => {
  const [page, setPage] = useState(1);
  const query = useProblemStore((state) => state.query);
  const difficulty = useProblemStore((state) => state.difficulty);
  const tags = useProblemStore((state) => state.tags);
  const debouncedQuery = useDebounce(query);

  const filtered = useMemo(() => {
    return mockProblems.filter((problem) => {
      const queryMatch = problem.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      const difficultyMatch = difficulty === 'All' || problem.difficulty === difficulty;
      const tagsMatch = tags.length === 0 || tags.some((tag) => problem.tags.includes(tag));
      return queryMatch && difficultyMatch && tagsMatch;
    });
  }, [debouncedQuery, difficulty, tags]);

  const totalPages = filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <PageContainer>
      <SectionHeader title="Problems" subtitle="Search, filter and solve across all difficulty levels." />
      <ProblemFilters />
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-slate-400">
          No problems matched your current filters. Try widening your search.
        </div>
      ) : null}

      {filtered.length > 0 ? (
        <>
          <div className="mt-6 grid gap-4 lg:hidden">
            {paged.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>

          <div className="mt-6 hidden lg:block">
            <ProblemTable problems={paged} />
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <Button variant="ghost" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>Prev</Button>
            <span className="text-sm text-slate-400">Page {currentPage}/{totalPages}</span>
            <Button variant="secondary" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(value + 1, totalPages))}>Next</Button>
          </div>
        </>
      ) : null}
    </PageContainer>
  );
};

export default ProblemsPage;
