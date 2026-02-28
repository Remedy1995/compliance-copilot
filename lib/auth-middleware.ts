import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-in-production');

export function withAuth(
  handler: (req: Request, ctx: { params: Record<string, string> }, userId: string) => Promise<Response>
) {
  return async (req: Request, ctx: { params: Record<string, string> }): Promise<Response> => {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return handler(req, ctx, (payload.sub as string) ?? 'demo-user');
    } catch {
      // For demo: allow demo-token through
      if (token === 'demo-token-replace-with-real-jwt') {
        return handler(req, ctx, 'demo-user');
      }
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  };
}
