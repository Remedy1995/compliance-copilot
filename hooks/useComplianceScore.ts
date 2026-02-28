import { useState, useEffect } from 'react';

const TOOLS_LIST = ['privacy-policy','soc2-checklist','gdpr-docs','security-arch','vendor-risk'];
const STORAGE_KEY = 'compliance_copilot_completed_tools';

export function useComplianceScore() {
  const [completedTools, setCompletedTools] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCompletedTools(JSON.parse(stored));
  }, []);

  const markToolComplete = (toolId: string) => {
    setCompletedTools((prev) => {
      if (prev.includes(toolId)) return prev;
      const updated = [...prev, toolId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const score = Math.round((completedTools.length / TOOLS_LIST.length) * 100);
  const isToolComplete = (toolId: string) => completedTools.includes(toolId);
  const reset = () => { setCompletedTools([]); localStorage.removeItem(STORAGE_KEY); };

  return { score, completedTools, markToolComplete, isToolComplete, reset };
}
