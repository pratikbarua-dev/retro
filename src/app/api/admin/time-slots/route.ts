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

  const slots = db.getTimeSlots();
  return NextResponse.json({ success: true, slots });
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { startTime, endTime, capacity, dayOfWeek } = body;

  const newSlot = db.createTimeSlot({
    startTime,
    endTime,
    capacity: capacity || 10,
    dayOfWeek: dayOfWeek || 0,
    isActive: true,
  });

  return NextResponse.json({ success: true, slot: newSlot });
}

export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, updates } = body;

  const updated = db.updateTimeSlot(id, updates);
  return NextResponse.json({ success: true, slot: updated });
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Slot ID required' }, { status: 400 });

  const success = db.deleteTimeSlot(id);
  return NextResponse.json({ success });
}
