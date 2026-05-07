import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';
import { Skeleton } from '@/components/common/Skeleton';

const HomePage = lazy(() => import('@/pages/Home'));
const ProblemsPage = lazy(() => import('@/pages/Problems'));
const ProblemDetailsPage = lazy(() => import('@/pages/ProblemDetails'));
const ContestPage = lazy(() => import('@/pages/Contest'));
const LeaderboardPage = lazy(() => import('@/pages/Leaderboard'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const LoginPage = lazy(() => import('@/pages/Login'));
const SignupPage = lazy(() => import('@/pages/Signup'));
const AdminPage = lazy(() => import('@/pages/Admin'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

const LoadingRoute = () => (
  <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
    <Skeleton className="h-10 w-56" />
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<LoadingRoute />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:problemId" element={<ProblemDetailsPage />} />
        <Route path="/contest" element={<ContestPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/:section" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  </Suspense>
);
