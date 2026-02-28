'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools/config';
import ToolForm from '@/components/ToolForm';
import { useComplianceScore } from '@/hooks/useComplianceScore';

const AGENT_COLORS: Record<string,string> = { legal:'from-violet-500 to-purple-600', security:'from-blue-500 to-cyan-600', product:'from-emerald-500 to-teal-600', sales:'from-orange-500 to-amber-600' };
const AGENT_EMOJIS: Record<string,string> = { legal:'⚖️', security:'🛡️', product:'🎯', sales:'📊' };
const AGENT_NAMES: Record<string,string> = { legal:'Legal Agent', security:'Security Agent', product:'Product Agent', sales:'Sales Agent' };
const AGENT_ROLES: Record<string,string> = { legal:'Senior Compliance Attorney', security:'CISO-Level Architect', product:'Product Strategist', sales:'Enterprise Sales Specialist' };

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params?.toolId as string;
  const tool = TOOLS[toolId];
  const { markToolComplete, isToolComplete } = useComplianceScore();

  useEffect(() => { if (toolId && !tool) router.push('/dashboard'); }, [tool, toolId, router]);
  if (!tool) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 sm:mb-8">
        <Link href="/dashboard" className="hover:text-violet-600 transition-colors font-semibold">Dashboard</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-700 font-bold truncate">{tool.name}</span>
      </div>

      <div className="flex items-start gap-4 sm:gap-5 mb-8 sm:mb-10">
        <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xl flex-shrink-0`}>{tool.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">{tool.name}</h1>
            {isToolComplete(toolId) && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold border border-emerald-200 flex-shrink-0">✅ Previously Generated</span>
            )}
          </div>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{tool.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-sm">
            <ToolForm tool={tool} onComplete={() => markToolComplete(toolId)} />
          </div>
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-500 rounded-full"></span>Agent Chain
            </h3>
            <div className="space-y-3">
              {tool.agentChain.map((agentId, i) => (
                <div key={agentId}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${AGENT_COLORS[agentId]} rounded-xl flex items-center justify-center text-base sm:text-lg shadow-md flex-shrink-0`}>{AGENT_EMOJIS[agentId]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-800 truncate">{AGENT_NAMES[agentId]}</p>
                      <p className="text-xs text-gray-400 truncate">{AGENT_ROLES[agentId]}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-bold flex-shrink-0">#{i+1}</span>
                  </div>
                  {i < tool.agentChain.length-1 && <div className="ml-5 mt-1 mb-1 w-px h-3 bg-gray-200"></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-black text-amber-700 mb-2 flex items-center gap-1.5"><span>⚠️</span> Legal Disclaimer</p>
            <p className="text-xs text-amber-600 leading-relaxed">All documents are AI-generated for reference only. Always review with a qualified attorney before use.</p>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-black text-violet-700 mb-2 flex items-center gap-1.5"><span>🤖</span> Powered by complete.dev</p>
            <p className="text-xs text-violet-600 leading-relaxed">{tool.agentChain.length} specialized agents collaborating in real-time on the complete.dev multi-agent platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
