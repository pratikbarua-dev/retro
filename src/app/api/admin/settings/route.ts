import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const settings = db.getSettings();
  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reset') {
      db.resetToSeedData();
      return NextResponse.json({ success: true, message: 'Database reset to initial seed data successfully' });
    }

    const updated = db.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 400 });
  }
}
