import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const slots = db.getTimeSlots();
  return NextResponse.json({ success: true, slots });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startTime, endTime, capacity } = body;

    if (!startTime || !endTime) {
      return NextResponse.json({ success: false, error: 'Start time and end time are required' }, { status: 400 });
    }

    const newSlot = db.createTimeSlot({
      startTime,
      endTime,
      capacity: capacity ? parseInt(capacity, 10) : 10,
      isActive: true,
    });

    return NextResponse.json({ success: true, slot: newSlot });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Slot ID is required' }, { status: 400 });
    }

    const updated = db.updateTimeSlot(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Slot not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, slot: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ success: false, error: 'Slot ID is required' }, { status: 400 });
  }

  const deleted = db.deleteTimeSlot(id);
  return NextResponse.json({ success: deleted });
}
