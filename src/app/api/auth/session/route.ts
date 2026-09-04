import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('retrolab_session')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const freshUser = db.getUserById(payload.userId) || db.getUserByEmail(payload.email);

    return NextResponse.json({
      authenticated: true,
      user: freshUser || payload,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
