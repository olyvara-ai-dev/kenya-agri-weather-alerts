'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function getEmailRedirectTo() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  return new URL('/auth/callback?next=/dashboard', siteUrl).toString();
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: getEmailRedirectTo(),
        },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        router.replace('/dashboard');
        router.refresh();
      } else {
        setMessage('Check your email for a verification link to finish creating your account.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: getEmailRedirectTo() },
      });
      if (resendError) throw resendError;
      setMessage('A new verification link has been sent. Check your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to resend the verification email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-100 p-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">AgriShield AI</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Register</div>
            </div>
          </div>
          <Link href="/login" className="text-sm font-semibold text-emerald-700">Already have an account?</Link>
        </div>

        <div className="grid lg:grid-cols-2">
          <div className="bg-slate-950 p-8 text-white">
            <h1 className="text-3xl font-black leading-tight">Set up your farm intelligence account.</h1>
            <p className="mt-4 text-slate-300">Create a profile to receive rainfall warnings, crop recommendations and organization-level insights.</p>
            <div className="mt-8 space-y-4 text-sm text-slate-200">
              {['Farm, county and crop registration', 'Kiswahili and English alerts', 'Secure, role-based access'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
              <input name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Your full name" maxLength={100} required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="Enter your email address" required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input name="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" placeholder="At least 8 characters" minLength={8} required />
            </div>

            <p className="text-sm text-slate-500">New accounts start with farmer access. Administrative roles must be assigned by an authorized administrator.</p>

            {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
            {message ? <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div> : null}
            {email.trim() ? <button type="button" onClick={resendConfirmation} disabled={loading} className="text-sm font-semibold text-emerald-700 underline disabled:opacity-60">Resend verification email</button> : null}

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-forest px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-70">
              {loading ? 'Creating account…' : 'Create account'}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
