import { Code2, Mail, UserRound } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

const SignupPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !password) {
      toast.warning('Incomplete form', 'Please complete all required fields.');
      return;
    }
    const response = await authService.signup(name, email, password);
    login(response.token, response.user);
    toast.success('Account created', 'Welcome to the QBITRA arena.');
    navigate('/profile');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Create your QBITRA account</h1>
      <p className="mt-1 text-sm text-slate-400">Unlock contests, ratings, and personalized analytics.</p>

      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Input id="name" label="Full name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Jane Doe" />
        <Input id="email" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@qbitra.dev" />
        <Input id="password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" />
        <Button className="w-full"><UserRound size={14} className="mr-2" /> Create account</Button>
      </form>

      <div className="mt-4 space-y-2">
        <Button variant="ghost" className="w-full"><Code2 size={14} className="mr-2" /> Sign up with GitHub</Button>
        <Button variant="ghost" className="w-full"><Mail size={14} className="mr-2" /> Sign up with Google</Button>
      </div>

      <p className="mt-6 text-sm text-slate-400">
        Already have an account? <Link to="/login" className="text-brand-orange">Sign in</Link>
      </p>
    </div>
  );
};

export default SignupPage;
