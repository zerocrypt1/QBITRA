import { BarChart3, Flag, LayoutDashboard, ListChecks, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/problems', label: 'Problems', icon: ListChecks },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/contests', label: 'Contests', icon: Flag },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export const AdminLayout = () => (
  <div className="grid min-h-screen md:grid-cols-[250px_1fr]">
    <aside className="border-r border-white/10 bg-[#07070c] p-4">
      <h2 className="mb-4 text-lg font-semibold text-white">Admin Panel</h2>
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? 'bg-brand-orange/20 text-brand-orange' : 'text-slate-300 hover:bg-white/8'
                }`
              }
            >
              <Icon size={15} /> {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
    <section className="bg-surface-base p-4 md:p-6">
      <Outlet />
    </section>
  </div>
);
