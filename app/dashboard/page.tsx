'use client';
import Link from 'next/link';
import { useComplianceScore } from '@/hooks/useComplianceScore';

const TOOLS = [
  { id:'privacy-policy', emoji:'📜', name:'Privacy Policy Generator', desc:'GDPR & CCPA compliant policies', agents:['⚖️ Legal','🎯 Product'], color:'from-violet-500 to-purple-600', time:'~3 min' },
  { id:'soc2-checklist', emoji:'✅', name:'SOC2 Readiness Checklist', desc:'Gap analysis + prioritized action plan', agents:['🛡️ Security','🎯 Product'], color:'from-emerald-500 to-teal-600', time:'~4 min' },
  { id:'gdpr-docs', emoji:'🇪🇺', name:'GDPR Documentation Suite', desc:'Full GDPR docs + DPIA templates', agents:['⚖️ Legal','🛡️ Security','🎯 Product'], color:'from-blue-500 to-cyan-600', time:'~6 min' },
  { id:'security-arch', emoji:'🏗️', name:'Security Architecture Report', desc:'Enterprise-ready security docs', agents:['🛡️ Security','📊 Sales'], color:'from-orange-500 to-amber-600', time:'~4 min' },
  { id:'vendor-risk', emoji:'📋', name:'Vendor Risk Questionnaire', desc:'Enterprise vendor assessments', agents:['🛡️ Security','📊 Sales','⚖️ Legal'], color:'from-rose-500 to-pink-600', time:'~6 min' },
];

export default function DashboardPage() {
  const { score, isToolComplete } = useComplianceScore();
  const completed = TOOLS.filter(t => isToolComplete(t.id)).length;
  const scoreColor = score < 40 ? 'from-rose-500 to-pink-500' : score < 80 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Compliance Dashboard</h1>
        <p className="text-gray-500 text-sm sm:text-base">Generate all 5 documents to reach 100% compliance readiness</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className={`bg-gradient-to-br ${scoreColor} rounded-2xl p-5 sm:p-7 text-white shadow-xl`}>
          <p className="text-white/70 text-xs sm:text-sm font-bold mb-2 uppercase tracking-wider">Compliance Score</p>
          <div className="flex items-end gap-2 sm:gap-3 mb-2">
            <p className="text-5xl sm:text-7xl font-black leading-none">{score}</p>
            <p className="text-2xl sm:text-3xl font-black text-white/70 mb-1 sm:mb-2">%</p>
          </div>
          <p className="text-white/80 text-xs sm:text-sm font-medium">{score===100 ? '🎉 Fully compliant!' : `${5-completed} documents remaining`}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm">
          <p className="text-gray-500 text-xs sm:text-sm font-bold mb-2 uppercase tracking-wider">Documents Generated</p>
          <div className="flex items-end gap-2 mb-2">
            <p className="text-5xl sm:text-7xl font-black text-gray-900 leading-none">{completed}</p>
            <p className="text-2xl sm:text-3xl font-black text-gray-300 mb-1 sm:mb-2">/ 5</p>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm font-medium">Total documents</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-5 sm:p-7">
          <p className="text-gray-500 text-xs sm:text-sm font-bold mb-2 uppercase tracking-wider">Active Agents</p>
          <p className="text-5xl sm:text-7xl font-black gradient-text leading-none mb-2 sm:mb-3">4</p>
          <div className="flex gap-1.5 flex-wrap">
            {[{e:'⚖️',l:'Legal'},{e:'🛡️',l:'Security'},{e:'🎯',l:'Product'},{e:'📊',l:'Sales'}].map(a => (
              <span key={a.e} className="flex items-center gap-1 bg-white border border-violet-100 text-xs font-bold text-violet-700 px-2 py-1 rounded-full shadow-sm">{a.e} {a.l}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-700">Overall Compliance Progress</span>
          <span className="text-sm font-black text-gray-900">{score}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
          <div className={`h-full rounded-full bg-gradient-to-r ${scoreColor} transition-all duration-1000 ease-out`} style={{width:`${score}%`}} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">0%</span>
          <span className="text-xs text-gray-400">100% — Enterprise Ready</span>
        </div>
      </div>

      <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4 sm:mb-5">Compliance Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {TOOLS.map(tool => {
          const done = isToolComplete(tool.id);
          return (
            <Link key={tool.id} href={`/dashboard/${tool.id}`}
              className={`group block bg-white border rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl card-hover ${done ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50' : 'border-gray-100 hover:border-violet-200'}`}>
              <div className="flex items-start justify-between mb-4 sm:mb-5">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:scale-110 transition-transform`}>{tool.emoji}</div>
                {done
                  ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold border border-emerald-200">✅ Done</span>
                  : <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full border border-gray-100">{tool.time}</span>
                }
              </div>
              <h3 className="font-black text-gray-900 mb-1.5 text-sm leading-tight">{tool.name}</h3>
              <p className="text-gray-500 text-xs mb-3 sm:mb-4 leading-relaxed">{tool.desc}</p>
              <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                {tool.agents.map(a => <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">{a}</span>)}
              </div>
              <span className={`text-xs font-black ${done ? 'text-emerald-600' : 'text-violet-600'} group-hover:translate-x-1 transition-transform inline-block`}>
                {done ? 'Regenerate →' : 'Generate →'}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
