import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

const bookingSchema = z.object({
  bookingDate: z.string().min(1, 'Booking date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  duration: z.number().min(1).max(14),
  packageId: z.string().min(1, 'Package selection is required'),
  packageName: z.string().min(1),
  members: z.number().min(1).max(10),
  purpose: z.string().min(3, 'Purpose must be at least 3 characters'),
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(6, 'Phone number is required'),
  institution: z.string().min(2, 'Institution is required'),
  departmentBatch: z.string().min(2, 'Department / Batch is required'),
});


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = result.data;

    // Check if authenticated
    let userId = 'usr_guest';
    const token = req.cookies.get('retrolab_session')?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        userId = payload.userId;
      }
    }

    // Atomic creation with seat capacity check
    const bookingResult = db.createBooking({
      ...data,
      userId,
    });

    if (!bookingResult.success) {
      return NextResponse.json(
        { error: bookingResult.error || 'Failed to create booking' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed!',
      booking: bookingResult.booking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Server error creating booking' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('retrolab_session')?.value;
  if (!token) {
    return NextResponse.json({ bookings: [] });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ bookings: [] });
  }

  if (payload.role === 'ADMIN') {
    return NextResponse.json({ bookings: db.getBookings() });
  } else {
    return NextResponse.json({ bookings: db.getUserBookings(payload.userId) });
  }
}
