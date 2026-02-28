export interface CompleteDevAgent {
  id: string;
  name: string;
  emoji: string;
  agentTag: string;
  systemPrompt: string;
}

export interface AgentResult {
  agentId: string;
  agentName: string;
  emoji: string;
  output: string;
}

async function callCompleteDevAgent({
  agentTag, systemPrompt, userPrompt, spaceId, channelId,
}: {
  agentTag: string;
  systemPrompt: string;
  userPrompt: string;
  spaceId: string;
  channelId: string;
}): Promise<string> {
  const apiKey = process.env.COMPLETE_DEV_API_KEY;
  const baseUrl = process.env.COMPLETE_DEV_BASE_URL || 'https://core-api.deploy.ai';
  if (!apiKey) throw new Error('COMPLETE_DEV_API_KEY is not set');

  const response = await fetch(
    `${baseUrl}/spaces/${spaceId}/channels/${channelId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        content: `${agentTag} ${userPrompt}`,
        systemContext: systemPrompt,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('[complete.dev API error]', errText);
    throw new Error('Agent call failed. Please try again.');
  }

  const data = await response.json();
  return data?.reply?.content ?? data?.message?.content ?? '';
}

function buildUserPrompt(inputs: Record<string, string>): string {
  return Object.entries(inputs)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
}

export async function runAgentChain(
  agents: CompleteDevAgent[],
  userInputs: Record<string, string>,
  onAgentStart: (agent: CompleteDevAgent) => void,
  onAgentComplete: (result: AgentResult) => void,
): Promise<string> {
  const spaceId = process.env.COMPLETE_DEV_SPACE_ID;
  const channelId = process.env.COMPLETE_DEV_CHANNEL_ID;
  if (!spaceId || !channelId) {
    throw new Error('COMPLETE_DEV_SPACE_ID or COMPLETE_DEV_CHANNEL_ID is not set');
  }

  const priorOutputs: AgentResult[] = [];

  for (const agent of agents) {
    onAgentStart(agent);
    const contextBlock =
      priorOutputs.length > 0
        ? `\n\nPrevious agent contributions:\n${priorOutputs
            .map((r) => `[${r.agentName}]:\n${r.output}`)
            .join('\n\n---\n\n')}`
        : '';
    const userPrompt = buildUserPrompt(userInputs) + contextBlock;
    const output = await callCompleteDevAgent({
      agentTag: agent.agentTag,
      systemPrompt: agent.systemPrompt,
      userPrompt,
      spaceId,
      channelId,
    });
    const result: AgentResult = {
      agentId: agent.id,
      agentName: agent.name,
      emoji: agent.emoji,
      output,
    };
    priorOutputs.push(result);
    onAgentComplete(result);
  }

  return priorOutputs
    .map((r) => `## ${r.emoji} ${r.agentName}\n\n${r.output}`)
    .join('\n\n---\n\n');
}
