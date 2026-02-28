'use client';
import Link from 'next/link';

const AGENTS = [
  { emoji:'⚖️', name:'Legal Agent', role:'Senior Compliance Attorney', desc:'Drafts legally precise documents citing GDPR articles, CCPA, SOC2 criteria with proper legal structure', color:'from-violet-500 to-purple-600', bg:'bg-violet-50', border:'border-violet-100' },
  { emoji:'🛡️', name:'Security Agent', role:'CISO-Level Architect', desc:'Assesses infrastructure gaps, references OWASP/NIST/CIS benchmarks with severity ratings', color:'from-blue-500 to-cyan-600', bg:'bg-blue-50', border:'border-blue-100' },
  { emoji:'🎯', name:'Product Agent', role:'Product Strategist', desc:'Translates legal/security into founder-friendly checklists with timelines and team assignments', color:'from-emerald-500 to-teal-600', bg:'bg-emerald-50', border:'border-emerald-100' },
  { emoji:'📊', name:'Sales Agent', role:'Enterprise Sales Specialist', desc:'Rewrites technical content for Fortune 500 buyers and enterprise procurement teams', color:'from-orange-500 to-amber-600', bg:'bg-orange-50', border:'border-orange-100' },
];
const TOOLS = [
  { emoji:'📜', name:'Privacy Policy', desc:'GDPR & CCPA compliant', agents:2, href:'/dashboard/privacy-policy', color:'from-violet-500 to-purple-600' },
  { emoji:'✅', name:'SOC2 Checklist', desc:'Gap analysis + action plan', agents:2, href:'/dashboard/soc2-checklist', color:'from-emerald-500 to-teal-600' },
  { emoji:'🇪🇺', name:'GDPR Suite', desc:'Full docs + DPIA templates', agents:3, href:'/dashboard/gdpr-docs', color:'from-blue-500 to-cyan-600' },
  { emoji:'🏗️', name:'Security Arch', desc:'Enterprise-ready docs', agents:2, href:'/dashboard/security-arch', color:'from-orange-500 to-amber-600' },
  { emoji:'📋', name:'Vendor Risk', desc:'Enterprise assessments', agents:3, href:'/dashboard/vendor-risk', color:'from-rose-500 to-pink-600' },
];
const STATS = [
  { value:'$50K+', label:'Saved vs. compliance lawyers', icon:'💰' },
  { value:'< 10min', label:'To generate all 5 docs', icon:'⚡' },
  { value:'4 Agents', label:'Collaborating in real-time', icon:'🤖' },
  { value:'100%', label:'Built on complete.dev', icon:'🏆' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm sm:text-base shadow-md">🛡️</div>
            <span className="font-black text-gray-900 text-base sm:text-lg tracking-tight">Compliance Copilot</span>
          </div>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#how" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#agents" className="hover:text-gray-900 transition-colors">Agents</a>
            <a href="#tools" className="hover:text-gray-900 transition-colors">Tools</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 font-semibold transition-colors px-3 py-2 rounded-xl hover:bg-gray-50">Sign In</Link>
            <Link href="/register" className="text-xs sm:text-sm bg-gradient-to-r from-violet-600 to-blue-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-violet-200 hover:-translate-y-0.5">
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-60 -right-60 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 text-violet-700 text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-8 sm:mb-10 shadow-sm">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
            Built entirely on complete.dev · 4 AI Agents
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-[1.02] mb-5 sm:mb-6 tracking-tight">
            Enterprise Compliance<br />
            <span className="gradient-text">in Minutes, Not Months</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-500 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
            A Fortune 500 just asked for your SOC2 report, privacy policy, and vendor risk questionnaire. You have 48 hours.{' '}
            <strong className="text-gray-800 font-bold">4 AI agents generate everything — instantly.</strong>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16 sm:mb-20 px-4">
            <Link href="/register" className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg hover:opacity-90 transition-all shadow-2xl shadow-violet-200 hover:-translate-y-1 active:translate-y-0 text-center">
              🚀 Start Free Audit
            </Link>
            <a href="#how" className="w-full sm:w-auto text-gray-700 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg border-2 border-gray-200 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-all text-center">
              See How It Works ↓
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="text-center group">
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:animate-bounce">{s.icon}</div>
                <p className="text-2xl sm:text-3xl font-black gradient-text">{s.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 sm:py-28 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">How It Works</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Real Multi-Agent Collaboration</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">Each agent builds on the previous one&apos;s expertise — not isolated calls.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step:'01', label:'You fill the form', desc:'Company details, infrastructure, data types', icon:'📝', color:'from-violet-600 to-purple-600' },
              { step:'02', label:'Agent 1 analyzes', desc:'Legal or Security agent drafts the foundation', icon:'⚖️', color:'from-blue-600 to-cyan-600' },
              { step:'03', label:'Agent 2 enhances', desc:'Receives full context, adds specialized expertise', icon:'🔗', color:'from-emerald-600 to-teal-600' },
              { step:'04', label:'Document delivered', desc:'Multi-expert output streamed live', icon:'✅', color:'from-orange-600 to-amber-600' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${s.color} rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5 shadow-xl group-hover:scale-110 transition-transform`}>{s.icon}</div>
                <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-1">Step {s.step}</p>
                <p className="font-black text-white text-sm mb-1 sm:mb-2">{s.label}</p>
                <p className="text-gray-400 text-xs leading-relaxed hidden sm:block">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section id="agents" className="py-20 sm:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">The Team</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">Meet Your 4 AI Agents</h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">Specialized experts that collaborate sequentially on every document</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {AGENTS.map(a => (
              <div key={a.name} className={`group ${a.bg} border ${a.border} rounded-2xl p-5 sm:p-7 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 card-hover`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${a.color} rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform`}>{a.emoji}</div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{a.role}</p>
                <h3 className="font-black text-gray-900 text-lg sm:text-xl mb-2 sm:mb-3">{a.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section id="tools" className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-br from-slate-50 to-violet-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">5 Tools</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">Everything to Close Enterprise Deals</h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">All the compliance documents Fortune 500 buyers ask for</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {TOOLS.map(t => (
              <Link key={t.name} href={t.href}
                className="group bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 hover:shadow-2xl hover:border-violet-200 transition-all duration-300 hover:-translate-y-2 block card-hover">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${t.color} rounded-2xl flex items-center justify-center text-xl sm:text-2xl mb-4 sm:mb-5 shadow-lg group-hover:scale-110 transition-transform`}>{t.emoji}</div>
                <h3 className="font-black text-gray-900 text-sm sm:text-base mb-2">{t.name}</h3>
                <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed">{t.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-violet-50 text-violet-700 font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-violet-100">{t.agents} agents</span>
                  <span className="text-violet-600 text-sm font-black group-hover:translate-x-2 transition-transform">Generate →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gray-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-900/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative">
          <div className="text-5xl sm:text-6xl mb-5 sm:mb-6 animate-float">🚀</div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-5 sm:mb-6 leading-tight">
            Ready to close that<br /><span className="gradient-text">enterprise deal?</span>
          </h2>
          <p className="text-gray-400 text-base sm:text-xl mb-10 sm:mb-12 leading-relaxed">Generate all 5 compliance documents in under 10 minutes.<br className="hidden sm:block" />Free to start. No credit card required.</p>
          <Link href="/register" className="inline-block bg-gradient-to-r from-violet-600 to-blue-600 text-white px-10 sm:px-14 py-4 sm:py-6 rounded-2xl font-black text-lg sm:text-xl hover:opacity-90 transition-all shadow-2xl shadow-violet-900/50 hover:-translate-y-1 active:translate-y-0">
            🚀 Start Free Audit
          </Link>
          <p className="text-gray-600 text-sm mt-5 sm:mt-6">Built with ❤️ on complete.dev multi-agent platform</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-950 border-t border-gray-800/50 py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs">🛡️</div>
            <span className="font-bold text-gray-400 text-sm">Compliance Copilot</span>
          </div>
          <p className="text-gray-600 text-xs text-center">⚠️ Documents are AI-generated for reference only. Always review with a qualified attorney.</p>
          <p className="text-gray-700 text-xs">© 2026 · Built on complete.dev</p>
        </div>
      </footer>
    </div>
  );
}
