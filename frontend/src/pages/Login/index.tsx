import { Code2, Lock, Mail } from 'lucide-react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { BRAND } from '@/utils/constants';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      toast.warning('Missing credentials', 'Please fill both email and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      login(response.token, response.user);
      toast.success('Welcome back', 'Signed in successfully.');
      navigate('/profile');
    } catch {
      toast.error('Sign in failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-brand-orange">{BRAND.name}</p>
      <h1 className="mt-2 text-2xl font-semibold text-white">Sign in to your workspace</h1>
      <p className="mt-1 text-sm text-slate-400">Continue your coding streaks and contests.</p>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Input id="email" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@qbitra.dev" />
        <Input id="password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
        <Button className="w-full" disabled={loading}>
          <Lock size={14} className="mr-2" /> {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-4 space-y-2">
        <Button variant="ghost" className="w-full"><Code2 size={14} className="mr-2" /> Continue with GitHub</Button>
        <Button variant="ghost" className="w-full"><Mail size={14} className="mr-2" /> Continue with Google</Button>
      </div>

      <p className="mt-6 text-sm text-slate-400">
        New to QBITRA? <Link to="/signup" className="text-brand-orange">Create account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
