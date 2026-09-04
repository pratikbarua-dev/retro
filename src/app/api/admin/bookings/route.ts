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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase();
  const status = searchParams.get('status');

  let bookings = db.getBookings();

  if (search) {
    bookings = bookings.filter(
      (b) =>
        b.bookingCode.toLowerCase().includes(search) ||
        b.customerName.toLowerCase().includes(search) ||
        b.customerPhone.includes(search)
    );
  }

  if (status && status !== 'ALL') {
    bookings = bookings.filter((b) => b.status === status);
  }

  return NextResponse.json({ success: true, bookings });
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = db.createBooking(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, booking: result.booking });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid booking data' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { id, status } = body;

  const updated = db.updateBookingStatus(id, status);
  if (!updated) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, booking: updated });
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
  }

  const success = db.deleteBooking(id);
  return NextResponse.json({ success });
}
