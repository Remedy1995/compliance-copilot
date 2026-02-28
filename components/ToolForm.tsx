'use client';
import { useState } from 'react';
import { Tool } from '@/lib/tools/config';

interface Props { tool: Tool; onComplete: () => void; }
const AGENT_COLORS: Record<string,string> = { legal:'from-violet-500 to-purple-600', security:'from-blue-500 to-cyan-600', product:'from-emerald-500 to-teal-600', sales:'from-orange-500 to-amber-600' };
const AGENT_EMOJIS: Record<string,string> = { legal:'⚖️', security:'🛡️', product:'🎯', sales:'📊' };
const AGENT_NAMES: Record<string,string> = { legal:'Legal Agent', security:'Security Agent', product:'Product Agent', sales:'Sales Agent' };

export default function ToolForm({ tool, onComplete }: Props) {
  const [inputs, setInputs] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);
  const [agentStatus, setAgentStatus] = useState<{id:string;name:string;emoji:string;done:boolean}[]>([]);
  const [document, setDocument] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'form'|'output'>('form');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setDocument(''); setAgentStatus([]);
    try {
      const token = localStorage.getItem('auth_token') ?? '';
      const res = await fetch(`/api/tools/${tool.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(inputs),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(err.error ?? 'Request failed');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'agent_start') setAgentStatus(prev => [...prev, { id: event.agent.id, name: event.agent.name, emoji: event.agent.emoji, done: false }]);
            else if (event.type === 'agent_complete') setAgentStatus(prev => prev.map(a => a.name === event.agentName ? { ...a, done: true } : a));
            else if (event.type === 'complete') { setDocument(event.document); setActiveTab('output'); onComplete(); }
            else if (event.type === 'error') setError(event.message);
          } catch {}
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const handleCopy = async () => { await navigator.clipboard.writeText(document); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const downloadDoc = () => {
    const blob = new Blob([document], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url; a.download = `${tool.id}-${Date.now()}.md`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      {document && (
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {(['form','output'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab===tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'form' ? '📝 Form' : '📄 Document'}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {tool.inputFields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {field.label}{field.required && <span className="text-rose-500 ml-1">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea rows={3} placeholder={field.placeholder} required={field.required}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none bg-gray-50 focus:bg-white placeholder-gray-400"
                  value={inputs[field.id]??''} onChange={e => setInputs(p => ({...p,[field.id]:e.target.value}))} />
              ) : field.type === 'select' ? (
                <select required={field.required}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  value={inputs[field.id]??''} onChange={e => setInputs(p => ({...p,[field.id]:e.target.value}))}>
                  <option value="">Select an option...</option>
                  {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type="text" placeholder={field.placeholder} required={field.required}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white placeholder-gray-400"
                  value={inputs[field.id]??''} onChange={e => setInputs(p => ({...p,[field.id]:e.target.value}))} />
              )}
            </div>
          ))}

          <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-100 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Agent Chain</p>
            <div className="flex items-center gap-2 flex-wrap">
              {tool.agentChain.map((agentId, i) => (
                <div key={agentId} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-white border border-violet-200 px-3 py-1.5 rounded-full shadow-sm">
                    <span className="text-sm">{AGENT_EMOJIS[agentId]}</span>
                    <span className="text-xs font-bold text-violet-700">{AGENT_NAMES[agentId]}</span>
                  </div>
                  {i < tool.agentChain.length-1 && <span className="text-violet-300 font-bold">→</span>}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-4 rounded-xl font-bold text-sm hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-violet-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Agents Working...</>
            ) : `🚀 Generate ${tool.name}`}
          </button>
        </form>
      )}

      {loading && agentStatus.length > 0 && (
        <div className="mt-6 space-y-3 animate-slide-up">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Live Agent Activity</p>
          {agentStatus.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${a.done ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200 animate-pulse'}`}>
              <div className={`w-10 h-10 bg-gradient-to-br ${AGENT_COLORS[a.id]??'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center text-lg shadow-sm flex-shrink-0`}>{a.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${a.done ? 'text-emerald-700' : 'text-blue-700'}`}>{a.name}</p>
                <p className="text-xs text-gray-500">{a.done ? '✅ Complete' : '⚡ Processing...'}</p>
              </div>
              {!a.done && <svg className="animate-spin h-5 w-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <span className="text-rose-500 text-xl flex-shrink-0">⚠️</span>
          <p className="text-rose-700 text-sm leading-relaxed">{error}</p>
        </div>
      )}

      {activeTab === 'output' && document && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <h3 className="font-bold text-gray-900 text-sm">Document Generated Successfully</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all font-semibold ${copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
              <button onClick={downloadDoc}
                className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg transition-all font-semibold shadow-sm">
                ⬇️ Download .md
              </button>
            </div>
          </div>
          <div className="bg-gray-950 rounded-2xl p-6 max-h-[520px] overflow-y-auto border border-gray-800 shadow-2xl">
            <pre className="text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">{document}</pre>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">⚠️ AI-generated for reference only. Review with a qualified attorney before use.</p>
        </div>
      )}
    </div>
  );
}
