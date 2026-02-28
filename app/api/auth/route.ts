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
