import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BRAND } from '@/utils/constants';
import { useUIStore } from '@/store/uiStore';

const links = [
  { to: '/', label: 'Home' },
  { to: '/problems', label: 'Problems' },
  { to: '/contest', label: 'Contest' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/profile', label: 'Profile' },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm transition ${isActive ? 'bg-white/12 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`;

export const Navbar = () => {
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-orange/20 text-brand-orange">
            <Code2 size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{BRAND.name}</p>
            <p className="text-[10px] text-slate-400">{BRAND.tagline}</p>
          </div>
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            className="ml-2 inline-flex items-center justify-center rounded-xl border border-surface-border-bright bg-surface-elevated px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-surface-border"
          >
            Sign in
          </NavLink>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-200 hover:bg-white/10 md:hidden"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileNavOpen ? (
          <motion.div
            className="border-t border-white/10 bg-black/80 px-4 py-3 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={navLinkClass}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/login" className={navLinkClass} onClick={() => setMobileNavOpen(false)}>
                Sign in
              </NavLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
