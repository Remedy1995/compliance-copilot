import { useState, useEffect } from 'react';

const TOOLS_LIST = ['privacy-policy', 'soc2-checklist', 'gdpr-docs', 'security-arch', 'vendor-risk'];
const STORAGE_KEY = 'compliance_copilot_completed_tools';

export function useComplianceScore() {
  const [completedTools, setCompletedTools] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompletedTools(JSON.parse(stored));
    } catch {}
  }, []);

  const markToolComplete = (toolId: string) => {
    setCompletedTools((prev) => {
      if (prev.includes(toolId)) return prev;
      const updated = [...prev, toolId];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const score = Math.round((completedTools.length / TOOLS_LIST.length) * 100);
  const isToolComplete = (toolId: string) => completedTools.includes(toolId);
  const reset = () => {
    setCompletedTools([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return { score, completedTools, markToolComplete, isToolComplete, reset };
}
