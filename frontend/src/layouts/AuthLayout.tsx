import { Outlet } from 'react-router-dom';

export const AuthLayout = () => (
  <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#05050a] px-4 py-8">
    <div className="absolute -left-16 top-0 h-72 w-72 rounded-full bg-brand-orange/30 blur-3xl" />
    <div className="absolute -right-8 bottom-0 h-72 w-72 rounded-full bg-neon-purple/30 blur-3xl" />
    <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-2xl md:p-8">
      <Outlet />
    </div>
  </div>
);
