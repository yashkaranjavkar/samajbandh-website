import React, { FormEvent, useEffect, useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { AdminDashboardPage } from './AdminDashboardPage';

export function AdminAccessGate() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/admin/session', { credentials: 'same-origin' });
      setAuthenticated(response.ok);
    } catch {
      setAuthenticated(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { void checkSession(); }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to sign in.');
      setPassword('');
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    try { await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }); } finally {
      setAuthenticated(false);
      setUsername('');
      setPassword('');
    }
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center text-slate-500">Checking admin access…</div>;

  if (authenticated) return (
    <div>
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 sm:px-8">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><ShieldCheck size={18} /> Secure admin session</div>
        <button onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Sign out</button>
      </div>
      <AdminDashboardPage />
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white"><LockKeyhole size={26} /></div>
        <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900">Admin Console</h1>
        <p className="mt-2 text-center text-sm leading-6 text-slate-500">Sign in with your authorized administrator credentials to continue.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="admin-username" className="mb-1.5 block text-sm font-semibold text-slate-700">Username</label>
            <input id="admin-username" autoComplete="username" required value={username} onChange={e => setUsername(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200" />
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in securely'}</button>
        </form>
        <p className="mt-5 text-center text-xs text-slate-400">Authorized personnel only · Sessions expire after 8 hours</p>
      </section>
    </main>
  );
}
