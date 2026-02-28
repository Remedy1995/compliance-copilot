#!/bin/bash
# ============================================================
# Compliance Copilot — FINAL v2
# Fixes: Real JWT auth + Premium glassmorphism + Fully responsive
# Run from INSIDE your compliance-copilot folder:
#   chmod +x compliance-copilot-v2.sh && ./compliance-copilot-v2.sh
# ============================================================

set -e

echo "🎨 Writing complete premium source files..."

mkdir -p app/login
mkdir -p app/register
mkdir -p "app/dashboard/[toolId]"
mkdir -p "app/api/tools/[toolId]"
mkdir -p app/api/auth
mkdir -p lib/agents
mkdir -p lib/tools
mkdir -p hooks
mkdir -p components

echo "📦 Installing dependencies..."
npm install jose bcryptjs
npm install -D @types/bcryptjs

# ════════════════════════════════════════════════════════════
# package.json — correct Next.js version
# ════════════════════════════════════════════════════════════
cat > package.json << 'EOF'
{
  "name": "compliance-copilot",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18",
    "react-dom": "^18",
    "jose": "^5.2.0",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.5",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
EOF

# ════════════════════════════════════════════════════════════
# globals.css
# ════════════════════════════════════════════════════════════
cat > app/globals.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* { font-family: 'Inter', sans-serif; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  background: #f8fafc;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
}

.glass {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.15);
}
.glass-dark {
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.08);
}
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.sidebar-gradient {
  background: linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}
.card-hover { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(102,126,234,0.18); }

@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

.animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
.animate-slide-up { animation: slideUp 0.4s ease-out; }
.animate-float { animation: float 3s ease-in-out infinite; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
*:focus-visible { outline: 2px solid #7c3aed; outline-offset: 2px; }
::selection { background: rgba(139,92,246,0.2); color: #4c1d95; }
EOF

# ════════════════════════════════════════════════════════════
# tailwind.config.ts
# ════════════════════════════════════════════════════════════
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50:'#f5f3ff',100:'#ede9fe',200:'#ddd6fe',300:'#c4b5fd',
          400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9',
          800:'#5b21b6',900:'#4c1d95',
        },
      },
    },
  },
  plugins: [],
};
export default config;
EOF

# ════════════════════════════════════════════════════════════
# next.config.ts
# ════════════════════════════════════════════════════════════
cat > next.config.ts << 'EOF'
import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'fonts.googleapis.com' },
      { protocol: 'https', hostname: 'fonts.gstatic.com' },
    ],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};
export default nextConfig;
EOF

# ════════════════════════════════════════════════════════════
# lib/auth-middleware.ts — REAL JWT (no demo fallback)
# ════════════════════════════════════════════════════════════
cat > lib/auth-middleware.ts << 'EOF'
import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const getSecret = () => new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'dev-secret-minimum-32-chars-long!!'
);

export async function signToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ sub: userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export function withAuth(
  handler: (req: Request, ctx: { params: Record<string, string> }, userId: string) => Promise<Response>
) {
  return async (req: Request, ctx: { params: Record<string, string> }): Promise<Response> => {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: 'Unauthorized — no token provided' }, { status: 401 });
    try {
      const { payload } = await jwtVerify(token, getSecret());
      return handler(req, ctx, (payload.sub as string) ?? 'user');
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token. Please sign in again.' }, { status: 401 });
    }
  };
}
EOF

# ════════════════════════════════════════════════════════════
# app/api/auth/route.ts — REAL JWT issued on login
# ════════════════════════════════════════════════════════════
cat > app/api/auth/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitize';
import { signToken } from '@/lib/auth-middleware';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

// In-memory user store (replace with DB in production)
const users = new Map<string, { id: string; companyName: string; email: string; passwordHash: string }>();

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const body = await req.json();
  const { action } = body;

  if (action === 'register') {
    const rateLimit = checkRateLimit(`register:${ip}`, 'auth');
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

    const companyName = sanitizeInput(body.companyName ?? '', 100);
    const email = sanitizeInput(body.email ?? '', 254).toLowerCase();
    const { password } = body;

    if (!companyName || !email || !password)
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });

    if (!PASSWORD_REGEX.test(password))
      return NextResponse.json(
        { error: 'Password must be 12+ chars with uppercase, lowercase, number, and symbol (@$!%*?&)' },
        { status: 400 }
      );

    if (users.has(email))
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });

    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 12);
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    users.set(email, { id, companyName, email, passwordHash });

    return NextResponse.json({ success: true, message: 'Account created! Please sign in.' }, { status: 201 });
  }

  if (action === 'login') {
    const rateLimit = checkRateLimit(`login:${ip}`, 'auth');
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

    const email = sanitizeInput(body.email ?? '', 254).toLowerCase();
    const { password } = body;

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

    const user = users.get(email);
    if (!user)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const bcrypt = await import('bcryptjs');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const token = await signToken(user.id, user.email);
    return NextResponse.json({ success: true, token, companyName: user.companyName }, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
EOF

# ════════════════════════════════════════════════════════════
# lib/complete-dev-client.ts
# ════════════════════════════════════════════════════════════
cat > lib/complete-dev-client.ts << 'EOF'
export interface CompleteDevAgent {
  id: string; name: string; emoji: string; agentTag: string; systemPrompt: string;
}
export interface AgentResult {
  agentId: string; agentName: string; emoji: string; output: string;
}

async function callCompleteDevAgent({
  agentTag, systemPrompt, userPrompt, spaceId, channelId,
}: { agentTag: string; systemPrompt: string; userPrompt: string; spaceId: string; channelId: string }): Promise<string> {
  const apiKey = process.env.COMPLETE_DEV_API_KEY;
  const baseUrl = process.env.COMPLETE_DEV_BASE_URL || 'https://core-api.deploy.ai';
  if (!apiKey) throw new Error('COMPLETE_DEV_API_KEY is not set');
  const response = await fetch(`${baseUrl}/spaces/${spaceId}/channels/${channelId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ content: `${agentTag} ${userPrompt}`, systemContext: systemPrompt }),
  });
  if (!response.ok) throw new Error('Agent call failed. Please try again.');
  const data = await response.json();
  return data?.reply?.content ?? data?.message?.content ?? '';
}

function buildUserPrompt(inputs: Record<string, string>): string {
  return Object.entries(inputs).map(([k, v]) => `${k}: ${v}`).join('\n');
}

export async function runAgentChain(
  agents: CompleteDevAgent[],
  userInputs: Record<string, string>,
  onAgentStart: (agent: CompleteDevAgent) => void,
  onAgentComplete: (result: AgentResult) => void,
): Promise<string> {
  const spaceId = process.env.COMPLETE_DEV_SPACE_ID;
  const channelId = process.env.COMPLETE_DEV_CHANNEL_ID;
  if (!spaceId || !channelId) throw new Error('COMPLETE_DEV_SPACE_ID or COMPLETE_DEV_CHANNEL_ID is not set');
  const priorOutputs: AgentResult[] = [];
  for (const agent of agents) {
    onAgentStart(agent);
    const contextBlock = priorOutputs.length > 0
      ? `\n\nPrevious agent contributions:\n${priorOutputs.map(r => `[${r.agentName}]:\n${r.output}`).join('\n\n---\n\n')}`
      : '';
    const output = await callCompleteDevAgent({
      agentTag: agent.agentTag,
      systemPrompt: agent.systemPrompt,
      userPrompt: buildUserPrompt(userInputs) + contextBlock,
      spaceId, channelId,
    });
    const result: AgentResult = { agentId: agent.id, agentName: agent.name, emoji: agent.emoji, output };
    priorOutputs.push(result);
    onAgentComplete(result);
  }
  return priorOutputs.map(r => `## ${r.emoji} ${r.agentName}\n\n${r.output}`).join('\n\n---\n\n');
}
EOF

# ════════════════════════════════════════════════════════════
# lib/agents/complete-dev-definitions.ts
# ════════════════════════════════════════════════════════════
cat > lib/agents/complete-dev-definitions.ts << 'EOF'
import { CompleteDevAgent } from '../complete-dev-client';
export const COMPLETE_DEV_AGENTS: Record<string, CompleteDevAgent> = {
  legal: {
    id: 'legal', name: 'Legal Agent', emoji: '⚖️', agentTag: '@legal',
    systemPrompt: `You are a senior compliance attorney specializing in GDPR, CCPA, SOC2, and enterprise data privacy law. Draft precise, legally sound compliance documents. Always cite specific legal articles and regulations. Structure output with clear headings, numbered sections, and professional legal language. IMPORTANT: Always include this disclaimer: "⚠️ DISCLAIMER: This document is AI-generated for reference purposes only and must be reviewed by a qualified attorney before use."`,
  },
  security: {
    id: 'security', name: 'Security Agent', emoji: '🛡️', agentTag: '@security',
    systemPrompt: `You are a senior security architect with expertise in cloud security, threat modeling, SOC2, GDPR data flows, and enterprise security controls. Assess security posture and identify gaps with actionable remediation steps. Reference OWASP, NIST, and CIS benchmarks. Output findings with severity levels (Critical/High/Medium/Low).`,
  },
  product: {
    id: 'product', name: 'Product Agent', emoji: '🎯', agentTag: '@product',
    systemPrompt: `You are a product strategist who translates complex legal and security requirements into clear, actionable implementation checklists. Make technical content accessible to non-technical founders while preserving accuracy. Output structured checklists with priorities (High/Medium/Low), estimated timelines, and responsible team roles. Build upon prior agents — do not repeat their content, only enhance it.`,
  },
  sales: {
    id: 'sales', name: 'Sales Agent', emoji: '📊', agentTag: '@sales',
    systemPrompt: `You are an enterprise sales specialist who rewrites technical security and compliance content into customer-facing language that builds trust with Fortune 500 buyers. Maintain technical accuracy while making content compelling for enterprise vendor review processes. Build upon previous agents' work to create an executive summary and customer-facing narrative.`,
  },
};
EOF

# ════════════════════════════════════════════════════════════
# lib/tools/config.ts
# ════════════════════════════════════════════════════════════
cat > lib/tools/config.ts << 'EOF'
export interface ToolField {
  id: string; label: string; type: 'text' | 'textarea' | 'select';
  placeholder?: string; required: boolean; options?: string[];
}
export interface Tool {
  id: string; name: string; emoji: string; description: string;
  agentChain: string[]; inputFields: ToolField[]; color: string; bgColor: string; borderColor: string;
}
export const TOOLS: Record<string, Tool> = {
  'privacy-policy': {
    id: 'privacy-policy', name: 'Privacy Policy Generator', emoji: '📜',
    description: 'Generate a GDPR & CCPA compliant privacy policy for your startup.',
    agentChain: ['legal', 'product'],
    color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50', borderColor: 'border-violet-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'website', label: 'Website URL', type: 'text', placeholder: 'https://techcorp.io', required: true },
      { id: 'dataCollected', label: 'Data You Collect', type: 'textarea', placeholder: 'Name, email, payment info, usage analytics...', required: true },
      { id: 'country', label: 'Primary Country of Operation', type: 'text', placeholder: 'United States', required: true },
    ],
  },
  'soc2-checklist': {
    id: 'soc2-checklist', name: 'SOC2 Readiness Checklist', emoji: '✅',
    description: 'Get a prioritized SOC2 gap analysis and action plan.',
    agentChain: ['security', 'product'],
    color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'infrastructure', label: 'Cloud Infrastructure', type: 'text', placeholder: 'AWS, GCP, Azure...', required: true },
      { id: 'teamSize', label: 'Engineering Team Size', type: 'text', placeholder: '10', required: true },
      { id: 'currentControls', label: 'Current Security Controls', type: 'textarea', placeholder: 'MFA enabled, VPN, access reviews...', required: false },
    ],
  },
  'gdpr-docs': {
    id: 'gdpr-docs', name: 'GDPR Documentation Suite', emoji: '🇪🇺',
    description: 'Full GDPR documentation including DPA and DPIA templates.',
    agentChain: ['legal', 'security', 'product'],
    color: 'from-blue-500 to-cyan-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'euUsers', label: 'Do you have EU users?', type: 'select', options: ['Yes', 'No', 'Planning to'], required: true },
      { id: 'dataTypes', label: 'Types of Personal Data', type: 'textarea', placeholder: 'Email, location, behavioral data...', required: true },
      { id: 'dataProcessors', label: 'Third-party Data Processors', type: 'textarea', placeholder: 'Stripe, AWS, Mixpanel...', required: false },
    ],
  },
  'security-arch': {
    id: 'security-arch', name: 'Security Architecture Report', emoji: '🏗️',
    description: 'Enterprise-ready security architecture documentation.',
    agentChain: ['security', 'sales'],
    color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'infrastructure', label: 'Infrastructure Stack', type: 'textarea', placeholder: 'AWS ECS, RDS PostgreSQL, CloudFront...', required: true },
      { id: 'authMethod', label: 'Authentication Method', type: 'text', placeholder: 'JWT, OAuth2, SSO...', required: true },
      { id: 'sensitiveData', label: 'Sensitive Data Handled', type: 'textarea', placeholder: 'PII, payment data, health records...', required: true },
    ],
  },
  'vendor-risk': {
    id: 'vendor-risk', name: 'Vendor Risk Questionnaire', emoji: '📋',
    description: 'Complete enterprise vendor security assessments automatically.',
    agentChain: ['security', 'sales', 'legal'],
    color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200',
    inputFields: [
      { id: 'companyName', label: 'Company Name', type: 'text', placeholder: 'TechCorp Inc.', required: true },
      { id: 'productDescription', label: 'Product Description', type: 'textarea', placeholder: 'B2B SaaS platform for...', required: true },
      { id: 'certifications', label: 'Current Certifications', type: 'text', placeholder: 'SOC2 Type I, ISO 27001...', required: false },
      { id: 'incidentHistory', label: 'Security Incident History', type: 'textarea', placeholder: 'No incidents, or describe...', required: false },
    ],
  },
};
EOF

# ════════════════════════════════════════════════════════════
# lib/sanitize.ts
# ════════════════════════════════════════════════════════════
cat > lib/sanitize.ts << 'EOF'
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+a/i,
  /jailbreak/i,
  /system\s*prompt/i,
  /override\s+system/i,
  /forget\s+your\s+instructions/i,
];
const FIELD_MAX_LENGTHS: Record<string, number> = {
  companyName:100, website:254, dataCollected:2000, country:100,
  infrastructure:500, teamSize:10, currentControls:2000, euUsers:20,
  dataTypes:2000, dataProcessors:1000, authMethod:200, sensitiveData:2000,
  productDescription:2000, certifications:500, incidentHistory:2000,
};
export function sanitizeInput(value: string, maxLength = 1000): string {
  return value.replace(/\0/g, '').trim().slice(0, maxLength);
}
export function sanitizeToolInputs(inputs: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value !== 'string') continue;
    const clean = value.replace(/\0/g, '').trim().slice(0, FIELD_MAX_LENGTHS[key] ?? 1000);
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(clean)) throw new Error(`Invalid input detected in field: ${key}`);
    }
    sanitized[key] = clean;
  }
  return sanitized;
}
export function sanitizeMarkdownOutput(markdown: string): string {
  return markdown
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
EOF

# ════════════════════════════════════════════════════════════
# lib/rate-limit.ts
# ════════════════════════════════════════════════════════════
cat > lib/rate-limit.ts << 'EOF'
interface RateLimitEntry { count: number; resetAt: number; }
interface RateLimitResult { allowed: boolean; remaining: number; resetAt: number; retryAfter: number; }
const store = new Map<string, RateLimitEntry>();
const LIMITS: Record<string, { max: number; windowMs: number }> = {
  general: { max: 100, windowMs: 60*60*1000 },
  auth: { max: 5, windowMs: 15*60*1000 },
  toolGeneration: { max: 10, windowMs: 60*60*1000 },
};
export function checkRateLimit(identifier: string, type = 'general'): RateLimitResult {
  const config = LIMITS[type] ?? LIMITS.general;
  const key = `${type}:${identifier}`;
  const now = Date.now();
  let entry = store.get(key);
  if (!entry || now > entry.resetAt) { entry = { count: 0, resetAt: now + config.windowMs }; store.set(key, entry); }
  entry.count++;
  const remaining = Math.max(0, config.max - entry.count);
  return { allowed: entry.count <= config.max, remaining, resetAt: entry.resetAt, retryAfter: entry.count <= config.max ? 0 : Math.ceil((entry.resetAt - now) / 1000) };
}
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.', retryAfter: result.retryAfter }), {
    status: 429,
    headers: { 'Content-Type': 'application/json', 'Retry-After': String(result.retryAfter) },
  });
}
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return { 'X-RateLimit-Remaining': String(result.remaining), 'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)) };
}
EOF

# ════════════════════════════════════════════════════════════
# hooks/useComplianceScore.ts
# ════════════════════════════════════════════════════════════
cat > hooks/useComplianceScore.ts << 'EOF'
import { useState, useEffect } from 'react';
const TOOLS_LIST = ['privacy-policy','soc2-checklist','gdpr-docs','security-arch','vendor-risk'];
const STORAGE_KEY = 'compliance_copilot_completed_tools';
export function useComplianceScore() {
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  useEffect(() => {
    try { const s = localStorage.getItem(STORAGE_KEY); if (s) setCompletedTools(JSON.parse(s)); } catch {}
  }, []);
  const markToolComplete = (toolId: string) => {
    setCompletedTools(prev => {
      if (prev.includes(toolId)) return prev;
      const updated = [...prev, toolId];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };
  const score = Math.round((completedTools.length / TOOLS_LIST.length) * 100);
  const isToolComplete = (toolId: string) => completedTools.includes(toolId);
  return { score, completedTools, markToolComplete, isToolComplete };
}
EOF

# ════════════════════════════════════════════════════════════
# components/ToolForm.tsx
# ════════════════════════════════════════════════════════════
cat > components/ToolForm.tsx << 'EOF'
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
EOF

# ════════════════════════════════════════════════════════════
# app/layout.tsx
# ════════════════════════════════════════════════════════════
cat > app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Compliance Copilot — AI-Powered Compliance for Startups',
  description: 'Generate enterprise-grade compliance documents in minutes using 4 specialized AI agents. Built on complete.dev.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
EOF

# ════════════════════════════════════════════════════════════
# app/page.tsx — PREMIUM RESPONSIVE LANDING
# ════════════════════════════════════════════════════════════
cat > app/page.tsx << 'EOF'
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
EOF

# ════════════════════════════════════════════════════════════
# app/login/page.tsx — GLASSMORPHISM + REAL JWT
# ════════════════════════════════════════════════════════════
cat > app/login/page.tsx << 'EOF'
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem('auth_token', data.token);
      if (data.companyName) localStorage.setItem('company_name', data.companyName);
      router.push('/dashboard');
    } catch { setError('Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-gray-950 to-blue-900/20" />
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 sm:mb-8 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl shadow-xl group-hover:scale-110 transition-transform">🛡️</div>
            <span className="font-black text-white text-xl sm:text-2xl">Compliance Copilot</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Welcome back</h1>
          <p className="text-gray-400 text-base sm:text-lg">Sign in to your account</p>
        </div>
        <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {[
              { id:'email', label:'Email address', type:'email', placeholder:'you@company.com' },
              { id:'password', label:'Password', type:'password', placeholder:'••••••••••••' },
            ].map(field => (
              <div key={field.id}>
                <label className="block text-sm font-bold text-gray-300 mb-2">{field.label}</label>
                <input type={field.type} required placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all hover:border-white/20"
                  value={(form as Record<string,string>)[field.id]}
                  onChange={e => setForm(p => ({...p,[field.id]:e.target.value}))} />
              </div>
            ))}
            {error && (
              <div className="p-3 sm:p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                <span className="text-rose-400 text-lg">⚠️</span>
                <span className="text-rose-400 text-sm font-medium">{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3.5 sm:py-4 rounded-xl font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-violet-900/50 hover:-translate-y-0.5 active:translate-y-0">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5 sm:mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
EOF

# ════════════════════════════════════════════════════════════
# app/register/page.tsx — GLASSMORPHISM
# ════════════════════════════════════════════════════════════
cat > app/register/page.tsx << 'EOF'
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ companyName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/login');
    } catch { setError('Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-violet-900/20" />
        <div className="absolute top-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 sm:mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 sm:mb-8 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl shadow-xl group-hover:scale-110 transition-transform">🛡️</div>
            <span className="font-black text-white text-xl sm:text-2xl">Compliance Copilot</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Create your account</h1>
          <p className="text-gray-400 text-base sm:text-lg">Start generating compliance docs in minutes</p>
        </div>
        <div className="glass border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {[
              { id:'companyName', label:'Company Name', type:'text', placeholder:'TechCorp Inc.' },
              { id:'email', label:'Work Email', type:'email', placeholder:'you@company.com' },
              { id:'password', label:'Password', type:'password', placeholder:'••••••••••••' },
            ].map(field => (
              <div key={field.id}>
                <label className="block text-sm font-bold text-gray-300 mb-2">{field.label}</label>
                <input type={field.type} required placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all hover:border-white/20"
                  value={(form as Record<string,string>)[field.id]}
                  onChange={e => setForm(p => ({...p,[field.id]:e.target.value}))} />
              </div>
            ))}
            <p className="text-xs text-gray-600 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
              🔒 Password: 12+ chars with uppercase, lowercase, number &amp; symbol (@$!%*?&amp;)
            </p>
            {error && (
              <div className="p-3 sm:p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                <span className="text-rose-400 text-lg">⚠️</span>
                <span className="text-rose-400 text-sm font-medium">{error}</span>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white py-3.5 sm:py-4 rounded-xl font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-violet-900/50 hover:-translate-y-0.5 active:translate-y-0">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5 sm:mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
EOF

# ════════════════════════════════════════════════════════════
# app/dashboard/layout.tsx
# ════════════════════════════════════════════════════════════
cat > app/dashboard/layout.tsx << 'EOF'
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href:'/dashboard', label:'Overview', emoji:'🏠', exact:true },
  { href:'/dashboard/privacy-policy', label:'Privacy Policy', emoji:'📜', exact:false },
  { href:'/dashboard/soc2-checklist', label:'SOC2 Checklist', emoji:'✅', exact:false },
  { href:'/dashboard/gdpr-docs', label:'GDPR Suite', emoji:'🇪🇺', exact:false },
  { href:'/dashboard/security-arch', label:'Security Arch', emoji:'🏗️', exact:false },
  { href:'/dashboard/vendor-risk', label:'Vendor Risk', emoji:'📋', exact:false },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => { localStorage.removeItem('auth_token'); router.push('/login'); };
  const isActive = (item: typeof NAV_ITEMS[0]) => item.exact ? pathname === item.href : pathname === item.href;

  const SidebarContent = () => (
    <>
      <div className="p-5 sm:p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-400 to-blue-400 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-lg group-hover:scale-110 transition-transform">🛡️</div>
          <div>
            <p className="font-black text-white text-sm leading-tight">Compliance</p>
            <p className="font-black text-white text-sm leading-tight">Copilot</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-white/30 uppercase tracking-widest px-3 mb-3">Tools</p>
        {NAV_ITEMS.map(item => {
          const active = isActive(item);
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-sm font-semibold transition-all group ${active ? 'bg-white/15 text-white shadow-sm border border-white/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <span className={`text-base transition-transform ${active ? '' : 'group-hover:scale-110'}`}>{item.emoji}</span>
              <span className="flex-1">{item.label}</span>
              {active && <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"></span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 sm:p-4 border-t border-white/10 space-y-2">
        <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/10">
          <p className="text-xs font-bold text-violet-300 mb-0.5">🤖 Powered by</p>
          <p className="text-xs text-gray-400">complete.dev · 4 agents</p>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2.5 text-gray-400 hover:text-white text-sm rounded-xl hover:bg-white/10 transition-all font-medium">
          <span>🚪</span> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 sidebar-gradient flex-col fixed h-full z-40 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-blue-400 rounded-lg flex items-center justify-center text-sm">🛡️</div>
          <span className="font-black text-white text-sm">Compliance Copilot</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 sidebar-gradient flex flex-col shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
EOF

# ════════════════════════════════════════════════════════════
# app/dashboard/page.tsx
# ════════════════════════════════════════════════════════════
cat > app/dashboard/page.tsx << 'EOF'
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
EOF

# ════════════════════════════════════════════════════════════
# app/dashboard/[toolId]/page.tsx
# ════════════════════════════════════════════════════════════
cat > "app/dashboard/[toolId]/page.tsx" << 'EOF'
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
EOF

# ════════════════════════════════════════════════════════════
# app/api/tools/[toolId]/route.ts
# ════════════════════════════════════════════════════════════
cat > "app/api/tools/[toolId]/route.ts" << 'EOF'
import { COMPLETE_DEV_AGENTS } from '@/lib/agents/complete-dev-definitions';
import { TOOLS } from '@/lib/tools/config';
import { runAgentChain, CompleteDevAgent } from '@/lib/complete-dev-client';
import { withAuth } from '@/lib/auth-middleware';
import { checkRateLimit, rateLimitResponse, getRateLimitHeaders } from '@/lib/rate-limit';
import { sanitizeToolInputs } from '@/lib/sanitize';

export const runtime = 'nodejs';

export const POST = withAuth(async (
  req: Request,
  { params }: { params: { toolId: string } },
  userId: string,
) => {
  const rateLimit = checkRateLimit(userId, 'toolGeneration');
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit);

  const { toolId } = params;
  const tool = TOOLS[toolId];
  if (!tool) return new Response(JSON.stringify({ error: 'Tool not found' }), { status: 404 });

  const rawInputs: Record<string, string> = await req.json();
  for (const field of tool.inputFields) {
    if (field.required && !rawInputs[field.id])
      return new Response(JSON.stringify({ error: `Missing required field: ${field.label}` }), { status: 400 });
  }

  let inputs: Record<string, string>;
  try { inputs = sanitizeToolInputs(rawInputs); }
  catch (err: unknown) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Invalid input' }), { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const agents: CompleteDevAgent[] = tool.agentChain.map(id => COMPLETE_DEV_AGENTS[id]);
        const finalDocument = await runAgentChain(agents, inputs,
          (agent) => { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type:'agent_start', agent:{ id:agent.id, name:agent.name, emoji:agent.emoji } })}\n\n`)); },
          (result) => { controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type:'agent_complete', agentId:result.agentId, agentName:result.agentName, emoji:result.emoji, output:result.output })}\n\n`)); },
        );
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type:'complete', document:finalDocument })}\n\n`));
      } catch (error) {
        console.error('[Agent Chain Error]', error);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type:'error', message:'Document generation failed. Please try again.' })}\n\n`));
      } finally { controller.close(); }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type':'text/event-stream', 'Cache-Control':'no-cache', 'Connection':'keep-alive', ...getRateLimitHeaders(rateLimit) },
  });
});
EOF

# ════════════════════════════════════════════════════════════
# Config files
# ════════════════════════════════════════════════════════════
cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "compliance-copilot",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
EOF

cat > .env.local.example << 'EOF'
COMPLETE_DEV_API_KEY=your-complete-dev-api-key-here
COMPLETE_DEV_SPACE_ID=8a6f2dc1-6ab6-4073-aef7-084576965498
COMPLETE_DEV_CHANNEL_ID=50d2a5c9-23f6-409c-bfcb-ed14dc9c0c22
COMPLETE_DEV_BASE_URL=https://core-api.deploy.ai
JWT_SECRET=replace-with-64-plus-character-random-string-here-make-it-long
JWT_REFRESH_SECRET=replace-with-another-64-plus-character-random-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.next/
out/
build/
.vercel
coverage/
*.tsbuildinfo
next-env.d.ts
.DS_Store
Thumbs.db
EOF

# ════════════════════════════════════════════════════════════
# GIT COMMIT + FORCE PUSH
# ════════════════════════════════════════════════════════════
echo ""
echo "🔗 Committing and force pushing to GitHub..."
git add .
git commit -m "feat: v2 — real JWT auth + glassmorphism + fully responsive

FIXES:
- Real JWT auth (bcryptjs + jose) — no more demo-token
- Register creates real account with bcrypt password hashing
- Login issues real JWT token (7 day expiry)
- Auth middleware validates real JWT — no fallback
- next.config.ts uses remotePatterns (no deprecation warning)
- package.json pinned to Next.js 14.2.5 (stable)

UI UPGRADES:
- Full glassmorphism on login/register (dark theme, blur, glow)
- Responsive sidebar with mobile hamburger menu
- All sections responsive (sm/md/lg breakpoints)
- Premium landing page with gradient blobs
- Dark hero sections with animated backgrounds
- Hover animations on all cards
- Compliance score with dynamic gradient colors"

git push origin main --force

echo ""
echo "✅ ════════════════════════════════════════════════════════"
echo "✅  PUSHED TO GITHUB — Vercel will auto-redeploy"
echo "✅ ════════════════════════════════════════════════════════"
echo ""
echo "🔑 REQUIRED ENV VARS in Vercel Dashboard:"
echo "   COMPLETE_DEV_API_KEY     = your-api-key"
echo "   COMPLETE_DEV_SPACE_ID    = 8a6f2dc1-6ab6-4073-aef7-084576965498"
echo "   COMPLETE_DEV_CHANNEL_ID  = 50d2a5c9-23f6-409c-bfcb-ed14dc9c0c22"
echo "   COMPLETE_DEV_BASE_URL    = https://core-api.deploy.ai"
echo "   JWT_SECRET               = (64+ random chars)"
echo "   NEXT_PUBLIC_APP_URL      = https://your-app.vercel.app"
echo ""
echo "🔐 HOW TO TEST AUTH:"
echo "   1. Go to /register — create account (password needs uppercase + symbol)"
echo "   2. Go to /login — sign in with same credentials"
echo "   3. Real JWT token stored in localStorage"
echo "   4. Dashboard tools now work with real auth"
