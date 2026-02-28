'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      if (data.token) localStorage.setItem('auth_token', data.token);
      router.push('/dashboard');
    } catch { setError('Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-blue-900/20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-lg">🛡️</div>
            <span className="font-bold text-white text-xl">Compliance Copilot</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@company.com' },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••••••' },
            ].map(field => (
              <div key={field.id}>
                <label className="block text-sm font-semibold text-gray-300 mb-2">{field.label}</label>
                <input type={field.type} required placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  value={(form as Record<string, string>)[field.id]}
                  onChange={e => setForm(p => ({ ...p, [field.id]: e.target.value }))} />
              </div>
            ))}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <span className="text-rose-400 text-sm">⚠️ {error}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-violet-900/50">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
