import { Search } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useProblemStore } from '@/store/problemStore';

const tags = ['Array', 'DP', 'Greedy', 'Graph', 'Math'];

export const ProblemFilters = () => {
  const query = useProblemStore((state) => state.query);
  const difficulty = useProblemStore((state) => state.difficulty);
  const selectedTags = useProblemStore((state) => state.tags);
  const setQuery = useProblemStore((state) => state.setQuery);
  const setDifficulty = useProblemStore((state) => state.setDifficulty);
  const toggleTag = useProblemStore((state) => state.toggleTag);
  const clearFilters = useProblemStore((state) => state.clearFilters);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Search by title or keyword"
          />
        </div>
        <select
          value={difficulty}
          onChange={(event) => setDifficulty(event.target.value as 'All' | 'Easy' | 'Medium' | 'Hard')}
          className="rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-sm text-slate-200 outline-none"
          aria-label="Difficulty"
        >
          <option value="All">All difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <Button variant="ghost" onClick={clearFilters}>
          Clear
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-3 py-1 text-xs transition ${active ? 'bg-brand-orange text-black' : 'bg-white/10 text-slate-300 hover:bg-white/20'}`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};
