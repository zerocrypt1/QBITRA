import { Card } from '@/components/common/Card';
import { PageContainer } from '@/components/common/PageContainer';
import { SectionHeader } from '@/components/common/SectionHeader';
import { ActivityTimeline } from '@/components/profile/ActivityTimeline';
import { StatCard } from '@/components/profile/StatCard';
import { mockUser } from '@/services/mockData';

const heatmap = Array.from({ length: 56 }, (_, index) => (index * 17) % 5);

const ProfilePage = () => (
  <PageContainer>
    <SectionHeader title="Profile" subtitle="Your coding performance dashboard." />

    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <Card>
        <div className="flex items-center gap-4">
          <img src={mockUser.avatar} alt={mockUser.name} className="h-16 w-16 rounded-full border border-white/20" />
          <div>
            <h1 className="text-xl font-semibold text-white">{mockUser.name}</h1>
            <p className="text-sm text-slate-400">{mockUser.email}</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Rating" value={String(mockUser.rating)} hint="Global top 8%" />
        <StatCard label="Solved" value={String(mockUser.solvedCount)} hint="Across all topics" />
        <StatCard label="Streak" value={`${mockUser.streak}d`} hint="Daily consistency" />
      </div>
    </div>

    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-white">Submission Heatmap</h3>
        <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1">
          {heatmap.map((value, index) => (
            <span
              key={index}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: `rgba(249,115,22,${0.08 + value * 0.2})` }}
              aria-label={`Contribution level ${value}`}
            />
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-white">Rating Graph (30 days)</h3>
        <div className="h-44 rounded-xl bg-gradient-to-b from-brand-orange/20 to-transparent p-3">
          <svg viewBox="0 0 300 120" className="h-full w-full">
            <polyline
              fill="none"
              stroke="rgb(249,115,22)"
              strokeWidth="3"
              points="0,90 30,80 60,78 90,66 120,72 150,58 180,54 210,48 240,38 270,32 300,26"
            />
          </svg>
        </div>
      </Card>
    </div>

    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-4 text-sm font-semibold text-white">Solved Problems</h3>
        <ul className="space-y-2 text-sm text-slate-300">
          {['Two Sum', 'Word Ladder', 'Shortest Path', 'Range Update Query'].map((item) => (
            <li key={item} className="rounded-lg bg-white/5 px-3 py-2">{item}</li>
          ))}
        </ul>
      </Card>
      <ActivityTimeline />
    </div>
  </PageContainer>
);

export default ProfilePage;
