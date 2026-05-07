import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/navbar/Navbar';

export const MainLayout = () => (
  <div className="min-h-screen bg-surface-base text-slate-100">
    <div className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern bg-[size:30px_30px] opacity-50" />
    <div className="pointer-events-none fixed inset-x-0 top-[-180px] -z-10 mx-auto h-[380px] w-[780px] rounded-full bg-brand-orange/20 blur-3xl" />
    <Navbar />
    <Outlet />
  </div>
);
