'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ companyName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/login');
    } catch { setError('Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-violet-900/20" />
        <div className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 sm:mb-8 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl shadow-xl group-hover:scale-110 transition-transform">🛡️</div>
            <span className="font-black text-white text-xl sm:text-2xl">Compliance Copilot</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Create your account</h1>
          <p className="text-gray-400 text-base sm:text-lg">Start generating compliance docs in minutes</p>
        </div>
        <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {[
              { id:'companyName', label:'Company Name', type:'text', placeholder:'TechCorp Inc.' },
              { id:'email', label:'Work Email', type:'email', placeholder:'you@company.com' },
              { id:'password', label:'Password', type:'password', placeholder:'••••••••••••' },
            ].map(field => (
              <div key={field.id}>
                <label className="block text-sm font-bold text-gray-300 mb-2">{field.label}</label>
                <input type={field.type} required placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all hover:border-white/20"
                  value={(form as Record<string,string>)[field.id]}
                  onChange={e => setForm(p => ({...p,[field.id]:e.target.value}))} />
              </div>
            ))}
            <p className="text-xs text-gray-600 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
              🔒 Password: 12+ chars with uppercase, lowercase, number &amp; symbol (@$!%*?&amp;)
            </p>
            {error && (
              <div className="p-3 sm:p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                <span className="text-rose-400 text-lg">⚠️</span>
                <span className="text-rose-400 text-sm font-medium">{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3.5 sm:py-4 rounded-xl font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-violet-900/50 hover:-translate-y-0.5 active:translate-y-0">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5 sm:mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
