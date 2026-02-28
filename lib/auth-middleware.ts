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
