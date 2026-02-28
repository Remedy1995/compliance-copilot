'use client';
import Link from 'next/link';

const AGENTS = [
  { emoji: '⚖️', name: 'Legal Agent', role: 'Senior Compliance Attorney', desc: 'Drafts legally precise documents citing GDPR articles, CCPA, SOC2 criteria', color: 'from-violet-500 to-purple-600' },
  { emoji: '🛡️', name: 'Security Agent', role: 'CISO-Level Architect', desc: 'Assesses infrastructure gaps, references OWASP/NIST/CIS benchmarks', color: 'from-blue-500 to-cyan-600' },
  { emoji: '🎯', name: 'Product Agent', role: 'Product Strategist', desc: 'Translates legal/security into founder-friendly checklists with timelines', color: 'from-emerald-500 to-teal-600' },
  { emoji: '📊', name: 'Sales Agent', role: 'Enterprise Sales Specialist', desc: 'Rewrites technical content for Fortune 500 buyers and procurement teams', color: 'from-orange-500 to-amber-600' },
];

const TOOLS = [
  { emoji: '📜', name: 'Privacy Policy', desc: 'GDPR & CCPA compliant', agents: 2, href: '/dashboard/privacy-policy' },
  { emoji: '✅', name: 'SOC2 Checklist', desc: 'Gap analysis + action plan', agents: 2, href: '/dashboard/soc2-checklist' },
  { emoji: '🇪🇺', name: 'GDPR Suite', desc: 'Full docs + DPIA templates', agents: 3, href: '/dashboard/gdpr-docs' },
  { emoji: '🏗️', name: 'Security Arch', desc: 'Enterprise-ready docs', agents: 2, href: '/dashboard/security-arch' },
  { emoji: '📋', name: 'Vendor Risk', desc: 'Enterprise assessments', agents: 3, href: '/dashboard/vendor-risk' },
];

const STATS = [
  { value: '$50K+', label: 'Saved vs. compliance lawyers' },
  { value: '< 10min', label: 'To generate all 5 docs' },
  { value: '4 Agents', label: 'Collaborating in real-time' },
  { value: '100%', label: 'Built on complete.dev' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">🛡️</div>
            <span className="font-bold text-gray-900 text-lg">Compliance Copilot</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#agents" className="hover:text-gray-900 transition-colors">Agents</a>
            <a href="#tools" className="hover:text-gray-900 transition-colors">Tools</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm bg-gradient-to-r from-violet-600 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-200">
              Get Started Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-60" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 text-violet-700 text-sm font-semibold px-5 py-2.5 rounded-full mb-8 shadow-sm">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
            Built entirely on complete.dev · 4 AI Agents · Real-time collaboration
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.05] mb-6 tracking-tight">
            Enterprise Compliance<br />
            <span className="gradient-text">in Minutes, Not Months</span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            A Fortune 500 just asked for your SOC2 report, privacy policy, and vendor risk questionnaire.
            You have 48 hours. <strong className="text-gray-700">4 AI agents generate everything — instantly.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-2xl shadow-violet-200 hover:-translate-y-1">
              🚀 Start Free Audit
            </Link>
            <a href="#agents" className="w-full sm:w-auto text-gray-700 px-10 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all">
              See How It Works ↓
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black gradient-text">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-blue-900/20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Real Multi-Agent Collaboration</h2>
            <p className="text-gray-400 text-lg">Each agent builds on the previous one's expertise — not isolated calls</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', label: 'You fill the form', desc: 'Company details, infrastructure, data types', icon: '📝' },
              { step: '2', label: 'Agent 1 analyzes', desc: 'Legal or Security agent drafts the foundation', icon: '🤖' },
              { step: '3', label: 'Agent 2 enhances', desc: 'Receives full context from Agent 1, adds expertise', icon: '🔗' },
              { step: '4', label: 'Document delivered', desc: 'Multi-expert output streamed in real-time', icon: '✅' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg shadow-violet-900/50">{s.icon}</div>
                <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1">Step {s.step}</p>
                <p className="font-bold text-white mb-1">{s.label}</p>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section id="agents" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Meet Your 4 AI Agents</h2>
            <p className="text-gray-500 text-lg">Specialized experts that collaborate sequentially on every document</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AGENTS.map(a => (
              <div key={a.name} className="group border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 hover:-translate-y-1 bg-white">
                <div className={`w-12 h-12 bg-gradient-to-br ${a.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>{a.emoji}</div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{a.role}</p>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{a.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="py-24 bg-gradient-to-br from-violet-50 to-blue-50 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">5 Compliance Tools</h2>
            <p className="text-gray-500 text-lg">Everything a startup needs to close enterprise deals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOLS.map(t => (
              <Link key={t.name} href={t.href} className="group bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-violet-100 transition-all duration-300 hover:-translate-y-1 block">
                <div className="text-4xl mb-4">{t.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{t.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{t.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2.5 py-1 rounded-full">{t.agents} agents</span>
                  <span className="text-violet-600 text-sm font-semibold group-hover:translate-x-1 transition-transform">Generate →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 to-blue-900/30 pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-5xl font-black mb-6">Ready to close that<br /><span className="gradient-text">enterprise deal?</span></h2>
          <p className="text-gray-400 text-lg mb-10">Generate all 5 compliance documents in under 10 minutes. Free to start.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-violet-600 to-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:opacity-90 transition-all shadow-2xl shadow-violet-900/50 hover:-translate-y-1">
            🚀 Start Free Audit
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 border-t border-gray-800 py-8 px-6 text-center">
        <p className="text-gray-500 text-sm">⚠️ Documents are AI-generated for reference only. Always review with a qualified attorney before use.</p>
        <p className="text-gray-600 text-xs mt-2">© 2026 Compliance Copilot · Built with ❤️ on complete.dev multi-agent platform</p>
      </footer>
    </div>
  );
}
