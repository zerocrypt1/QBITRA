import { Card } from '@/components/common/Card';

const timeline = [
  'Solved Dynamic Grid Paths',
  'Reached top 10% in Night Blitz #27',
  'Maintained 12-day solving streak',
  'Unlocked 1900 rating badge',
];

export const ActivityTimeline = () => (
  <Card>
    <h3 className="mb-4 text-sm font-semibold text-white">Recent activity</h3>
    <ul className="space-y-3">
      {timeline.map((item) => (
        <li key={item} className="relative pl-4 text-sm text-slate-300 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-brand-orange">
          {item}
        </li>
      ))}
    </ul>
  </Card>
);
