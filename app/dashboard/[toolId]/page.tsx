'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { TOOLS } from '@/lib/tools/config';
import ToolForm from '@/components/ToolForm';
import { useComplianceScore } from '@/hooks/useComplianceScore';

export default function ToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params?.toolId as string;
  const tool = TOOLS[toolId];
  const { markToolComplete, isToolComplete } = useComplianceScore();

  useEffect(() => { if (!tool) router.push('/dashboard'); }, [tool, router]);
  if (!tool) return null;

  const agentColors: Record<string,string> = { legal:'from-violet-500 to-purple-600', security:'from-blue-500 to-cyan-600', product:'from-emerald-500 to-teal-600', sales:'from-orange-500 to-amber-600' };
  const agentEmojis: Record<string,string> = { legal:'⚖️', security:'🛡️', product:'🎯', sales:'📊' };
  const agentNames: Record<string,string> = { legal:'Legal Agent', security:'Security Agent', product:'Product Agent', sales:'Sales Agent' };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/dashboard" className="hover:text-gray-600 transition-colors font-medium">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-700 font-semibold">{tool.name}</span>
      </div>
      <div className="flex items-start gap-5 mb-10">
        <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>{tool.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-gray-900">{tool.name}</h1>
            {isToolComplete(toolId) && <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">✅ Previously Generated</span>}
          </div>
          <p className="text-gray-500">{tool.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <ToolForm tool={tool} onComplete={() => markToolComplete(toolId)} />
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Agent Chain</h3>
            <div className="space-y-3">
              {tool.agentChain.map((agentId, i) => (
                <div key={agentId} className="flex items-center gap-3">
                  <div className={`w-9 h-9 bg-gradient-to-br ${agentColors[agentId]} rounded-xl flex items-center justify-center text-base shadow-sm flex-shrink-0`}>{agentEmojis[agentId]}</div>
                  <div>
                    <p className="text-xs font-bold text-gray-700">{agentNames[agentId]}</p>
                    <p className="text-xs text-gray-400">Step {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Legal Disclaimer</p>
            <p className="text-xs text-amber-600 leading-relaxed">All documents are AI-generated for reference only. Review with a qualified attorney before use.</p>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 border border-violet-100 rounded-2xl p-5">
            <p className="text-xs font-bold text-violet-700 mb-1">🤖 Powered by complete.dev</p>
            <p className="text-xs text-violet-600 leading-relaxed">4 specialized agents collaborating in real-time on the complete.dev platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
