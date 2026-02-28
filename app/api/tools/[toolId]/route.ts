import { COMPLETE_DEV_AGENTS } from '@/lib/agents/complete-dev-definitions';
import { TOOLS } from '@/lib/tools/config';
import { runAgentChain, CompleteDevAgent } from '@/lib/complete-dev-client';
import { withAuth } from '@/lib/auth-middleware';
import { checkRateLimit, rateLimitResponse, getRateLimitHeaders } from '@/lib/rate-limit';
import { sanitizeToolInputs } from '@/lib/sanitize';

export const runtime = 'edge';

export const POST = withAuth(async (req: Request, { params }: { params: { toolId: string } }, userId: string) => {
  const rateLimit = checkRateLimit(userId, 'toolGeneration');
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

  const { toolId } = params;
  const tool = TOOLS[toolId];
  if (!tool) return new Response(JSON.stringify({ error: 'Tool not found' }), { status: 404 });

  const rawInputs: Record<string, string> = await req.json();
  for (const field of tool.inputFields) {
    if (field.required && !rawInputs[field.id]) {
      return new Response(JSON.stringify({ error: `Missing required field: ${field.label}` }), { status: 400 });
    }
  }

  const inputs = sanitizeToolInputs(rawInputs);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const agents: CompleteDevAgent[] = tool.agentChain.map(id => COMPLETE_DEV_AGENTS[id]);
        const finalDocument = await runAgentChain(agents, inputs,
          (agent) => controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'agent_start', agent: { id: agent.id, name: agent.name, emoji: agent.emoji } })}\n\n`)),
          (result) => controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'agent_complete', agentId: result.agentId, agentName: result.agentName, emoji: result.emoji, output: result.output })}\n\n`))
        );
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', document: finalDocument })}\n\n`));
      } catch (error) {
        console.error('[Agent Chain Error]', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Document generation failed. Please try again.' })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', ...getRateLimitHeaders(rateLimit) },
  });
});
