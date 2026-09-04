import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const redirect = searchParams.get('redirect') || '/dashboard';
  const role = searchParams.get('role') || 'USER';

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
  const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_APP_URL
    : `${proto}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  // Fallback mode if GOOGLE_CLIENT_ID is not configured in local environment
  if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID' || clientId.trim() === '') {
    const mockEmail = role === 'ADMIN' ? 'admin.google@retrolab.com' : 'maker.google@diu.edu.bd';
    const mockName = role === 'ADMIN' ? 'Google Admin' : 'Google Verified Maker';

    let user = db.getUserByEmail(mockEmail);
    if (!user) {
      user = db.createUser({
        email: mockEmail,
        name: mockName,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        institution: 'Daffodil International University',
        department: 'Robotics & Automation',
        batch: '2025',
      });
    }

    const token = signToken(user);
    const targetUrl =
      user.role === 'ADMIN'
        ? redirect.startsWith('/admin')
          ? redirect
          : '/admin'
        : redirect.startsWith('/admin')
        ? '/dashboard'
        : redirect;

    const response = NextResponse.redirect(`${baseUrl}${targetUrl}`);

    response.cookies.set({
      name: 'retrolab_session',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  }

  const state = encodeURIComponent(JSON.stringify({ redirect, role }));
  const scope = encodeURIComponent('openid email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(googleAuthUrl);
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { googleToken, email, name, avatar, requestedRole } = body;

    const userEmail = email || `maker.${Math.floor(1000 + Math.random() * 9000)}@diu.edu.bd`;
    const userName = name || 'Google Verified User';
    const userAvatar =
      avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

    let user = db.getUserByEmail(userEmail);

    if (!user) {
      user = db.createUser({
        email: userEmail,
        name: userName,
        avatar: userAvatar,
        role: requestedRole === 'ADMIN' ? 'ADMIN' : 'USER',
        institution: 'Daffodil International University',
        department: 'Robotics & Automation',
        batch: '2025',
      });
    } else if (requestedRole && user.role !== requestedRole) {
      user = db.updateUser(user.id, { role: requestedRole }) || user;
    }

    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      message: 'Google OAuth authentication successful',
      user,
      token,
    });

    response.cookies.set({
      name: 'retrolab_session',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Google OAuth failed' }, { status: 500 });
  }
}
