interface RateLimitEntry { count: number; resetAt: number; }
interface RateLimitResult { allowed: boolean; remaining: number; resetAt: number; retryAfter: number; }

const store = new Map<string, RateLimitEntry>();
const LIMITS: Record<string, { max: number; windowMs: number }> = {
  general: { max: 100, windowMs: 60 * 60 * 1000 },
  auth: { max: 5, windowMs: 15 * 60 * 1000 },
  toolGeneration: { max: 10, windowMs: 60 * 60 * 1000 },
};

export function checkRateLimit(identifier: string, type: string = 'general'): RateLimitResult {
  const config = LIMITS[type] ?? LIMITS.general;
  const key = `${type}:${identifier}`;
  const now = Date.now();
  let entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + config.windowMs };
    store.set(key, entry);
  }
  entry.count++;
  const remaining = Math.max(0, config.max - entry.count);
  const allowed = entry.count <= config.max;
  return { allowed, remaining, resetAt: entry.resetAt, retryAfter: allowed ? 0 : Math.ceil((entry.resetAt - now) / 1000) };
}

export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({ error: 'Too many requests. Please try again later.', retryAfter: result.retryAfter }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
      },
    },
  );
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000)),
  };
}
