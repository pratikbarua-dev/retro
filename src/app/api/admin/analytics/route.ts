import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

function checkAdmin(req: NextRequest) {
  const token = req.cookies.get('retrolab_session')?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload?.role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary = db.getAnalyticsSummary();
  return NextResponse.json({ success: true, summary });
}
