import { Card } from '@/components/common/Card';

const metrics = [
  { label: 'Daily Active Users', value: '12,412' },
  { label: 'Submissions Today', value: '142,100' },
  { label: 'Live Contests', value: '5' },
  { label: 'Flagged Solutions', value: '23' },
];

const AdminPage = () => (
  <main className="space-y-6">
    <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <p className="text-xs uppercase tracking-wide text-slate-400">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
        </Card>
      ))}
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <h2 className="text-sm font-semibold text-white">Problem Management</h2>
        <p className="mt-2 text-sm text-slate-300">Create, edit, and moderate coding problems and testcases.</p>
      </Card>
      <Card className="lg:col-span-1">
        <h2 className="text-sm font-semibold text-white">User Management</h2>
        <p className="mt-2 text-sm text-slate-300">Handle user roles, moderation, and verification workflows.</p>
      </Card>
      <Card className="lg:col-span-1">
        <h2 className="text-sm font-semibold text-white">Contest Management</h2>
        <p className="mt-2 text-sm text-slate-300">Schedule contests, monitor fairness checks, and publish results.</p>
      </Card>
    </div>
  </main>
);

export default AdminPage;
