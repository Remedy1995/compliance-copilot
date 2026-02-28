'use client';
import Link from 'next/link';
import { useComplianceScore } from '@/hooks/useComplianceScore';

const TOOLS = [
  { id: 'privacy-policy', emoji: '📜', name: 'Privacy Policy Generator', desc: 'GDPR & CCPA compliant policies', agents: ['⚖️ Legal', '🎯 Product'], color: 'from-violet-500 to-purple-600' },
  { id: 'soc2-checklist', emoji: '✅', name: 'SOC2 Readiness Checklist', desc: 'Gap analysis + prioritized action plan', agents: ['🛡️ Security', '🎯 Product'], color: 'from-emerald-500 to-teal-600' },
  { id: 'gdpr-docs', emoji: '🇪🇺', name: 'GDPR Documentation Suite', desc: 'Full GDPR docs + DPIA templates', agents: ['⚖️ Legal', '🛡️ Security', '🎯 Product'], color: 'from-blue-500 to-cyan-600' },
  { id: 'security-arch', emoji: '🏗️', name: 'Security Architecture Report', desc: 'Enterprise-ready security docs', agents: ['🛡️ Security', '📊 Sales'], color: 'from-orange-500 to-amber-600' },
  { id: 'vendor-risk', emoji: '📋', name: 'Vendor Risk Questionnaire', desc: 'Enterprise vendor assessments', agents: ['🛡️ Security', '📊 Sales', '⚖️ Legal'], color: 'from-rose-500 to-pink-600' },
];

export default function DashboardPage() {
  const { score, isToolComplete } = useComplianceScore();
  const completed = TOOLS.filter(t => isToolComplete(t.id)).length;
  const scoreGradient = score < 40 ? 'from-rose-500 to-pink-500' : score < 80 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500';

  return (
    <div className="p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 mb-1">Compliance Dashboard</h1>
        <p className="text-gray-500">Generate all 5 documents to reach 100% compliance readiness</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className={`bg-gradient-to-br ${scoreGradient} rounded-2xl p-6 text-white shadow-lg`}>
          <p className="text-white/70 text-sm font-semibold mb-1">Compliance Score</p>
          <p className="text-6xl font-black mb-1">{score}%</p>
          <p className="text-white/70 text-sm">{score === 100 ? '🎉 Fully compliant!' : `${5 - completed} documents remaining`}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm font-semibold mb-1">Documents Generated</p>
          <p className="text-6xl font-black text-gray-900 mb-1">{completed}</p>
          <p className="text-gray-400 text-sm">of 5 total documents</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-6">
          <p className="text-gray-500 text-sm font-semibold mb-1">Active Agents</p>
          <p className="text-6xl font-black gradient-text mb-1">4</p>
          <div className="flex gap-1 flex-wrap mt-2">
            {['⚖️','🛡️','🎯','📊'].map(e => (
              <span key={e} className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-sm shadow-sm border border-violet-100">{e}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-700">Overall Compliance Progress</span>
          <span className="text-sm font-bold text-gray-500">{score}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className={`h-3 rounded-full bg-gradient-to-r ${scoreGradient} transition-all duration-1000 ease-out`} style={{ width: `${score}%` }} />
        </div>
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-5">Compliance Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map(tool => {
          const done = isToolComplete(tool.id);
          return (
            <Link key={tool.id} href={`/dashboard/${tool.id}`}
              className={`group block bg-white border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl card-hover ${done ? 'border-emerald-200 bg-emerald-50/30' : 'border-gray-100 hover:border-violet-200'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>{tool.emoji}</div>
                {done && <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold">✅ Done</span>}
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{tool.name}</h3>
              <p className="text-gray-500 text-xs mb-4 leading-relaxed">{tool.desc}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {tool.agents.map(a => <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{a}</span>)}
              </div>
              <span className={`text-xs font-bold ${done ? 'text-emerald-600' : 'text-violet-600'} group-hover:translate-x-1 transition-transform inline-block`}>
                {done ? 'Regenerate →' : 'Generate →'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
