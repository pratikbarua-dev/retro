import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, loginType, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user = db.getUserByEmail(email);

    // If user does not exist, auto register as normal USER (or requested role)
    if (!user) {
      const nameFromEmail = email.split('@')[0].replace(/\./g, ' ');
      const capitalizedName = nameFromEmail
        .split(' ')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      user = db.createUser({
        email,
        name: capitalizedName || 'Lab Member',
        role: role === 'ADMIN' || email.includes('admin') ? 'ADMIN' : 'USER',
        institution: 'Daffodil International University',
        department: 'Software Engineering',
        batch: '45th',
      });
    }

    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        institution: user.institution,
        department: user.department,
        batch: user.batch,
      },
      token,
    });

    response.cookies.set({
      name: 'retrolab_session',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
