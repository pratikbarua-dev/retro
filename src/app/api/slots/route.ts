import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || '2025-08-30';

  const slots = db.getSlotsWithAvailability(date);
  return NextResponse.json({ success: true, date, slots });
}
