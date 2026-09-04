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
  const users = db.getUsers();
  return NextResponse.json({ success: true, users });
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const newUser = db.createUser(body);
    return NextResponse.json({ success: true, user: newUser });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid user data' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, role, ...otherUpdates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const updated = db.updateUser(id, { role, ...otherUpdates });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const success = db.deleteUser(id);
  return NextResponse.json({ success });
}
