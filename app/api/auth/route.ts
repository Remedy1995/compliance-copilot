import { NextResponse } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { sanitizeInput } from '@/lib/sanitize';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const body = await req.json();
  const { action } = body;

  if (action === 'register') {
    const rateLimit = checkRateLimit(`register:${ip}`, 'auth');
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);
    const { companyName, email, password } = body;
    if (!companyName || !email || !password) return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    if (!PASSWORD_REGEX.test(password)) return NextResponse.json({ error: 'Password must be 12+ chars with uppercase, lowercase, number, and symbol' }, { status: 400 });
    console.log('Register:', sanitizeInput(companyName, 100), sanitizeInput(email, 254));
    return NextResponse.json({ success: true, message: 'Account created' }, { status: 201 });
  }

  if (action === 'login') {
    const rateLimit = checkRateLimit(`login:${ip}`, 'auth');
    if (!rateLimit.allowed) return rateLimitResponse(rateLimit);
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    return NextResponse.json({ success: true, token: 'demo-token-replace-with-real-jwt' }, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
