'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorCode = new URLSearchParams(window.location.search).get('error');
    if (errorCode === 'supabase_not_configured') {
      setError('Sign-in is not configured yet. Add the Supabase URL and anon key to the deployment environment.');
    } else if (errorCode === 'profile_setup_incomplete') {
      setError('The account database is not ready. Apply the Supabase database migration and try again.');
    } else if (errorCode === 'auth_callback_failed') {
      setError('Email verification could not be completed. Request a new verification email and try again.');
    }
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const redirectTo = new URLSearchParams(window.location.search).get('redirectTo');
      let safeRedirectTo = '/dashboard';
      if (redirectTo) {
        try {
          const target = new URL(redirectTo, window.location.origin);
          if (target.origin === window.location.origin) {
            safeRedirectTo = `${target.pathname}${target.search}${target.hash}`;
          }
        } catch {
          safeRedirectTo = '/dashboard';
        }
      }
      router.replace(safeRedirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="bg-slate-950 p-8 text-white lg:p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black">AgriShield AI</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-300">Protecting every harvest</div>
            </div>
          </div>

          <h1 className="mt-10 text-3xl font-black leading-tight">Weather intelligence built for real farm decisions.</h1>
          <p className="mt-4 max-w-md text-slate-300">Know when rain is coming, protect your field, and make the right call before the storm arrives.</p>

          <div className="mt-10 space-y-4">
            {['Live rainfall risk monitoring', '24-hour field advisories', 'English + Kiswahili messaging'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <div className="mb-8 text-center lg:text-left">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Sign in</div>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Welcome back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
              <input
                type="email"
                autoComplete="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-600"
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none ring-0 transition focus:border-emerald-600"
                placeholder="Enter your password"
                required
              />
            </div>

            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Need an account?{' '}
            <Link href="/register" className="font-semibold text-emerald-700">Create one</Link>
          </div>

        </div>
      </div>
    </main>
  );
}
