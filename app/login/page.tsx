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
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-950 to-blue-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-xl group-hover:scale-110 transition-transform">🛡️</div>
            <span className="font-black text-white text-2xl">Compliance Copilot</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-lg">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@company.com' },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••••••' },
            ].map(field => (
              <div key={field.id}>
                <label className="block text-sm font-bold text-gray-300 mb-2">{field.label}</label>
                <input type={field.type} required placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all hover:border-white/20"
                  value={(form as Record<string, string>)[field.id]}
                  onChange={e => setForm(p => ({ ...p, [field.id]: e.target.value }))} />
              </div>
            ))}

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                <span className="text-rose-400 text-lg">⚠️</span>
                <span className="text-rose-400 text-sm font-medium">{error}</span>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-4 rounded-xl font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-violet-900/50 hover:-translate-y-0.5 active:translate-y-0">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
