import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth/jwt';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=${encodeURIComponent(error || 'oauth_cancelled')}`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange auth code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId || '',
        client_secret: clientSecret || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`);
    }

    // Fetch user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_user_email`);
    }

    let user = db.getUserByEmail(googleUser.email);

    if (!user) {
      user = db.createUser({
        email: googleUser.email,
        name: googleUser.name || googleUser.email.split('@')[0],
        avatar: googleUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: googleUser.email.includes('admin') ? 'ADMIN' : 'USER',
        institution: 'Daffodil International University',
        department: 'Robotics & Automation',
        batch: '2025',
      });
    }

    const token = signToken(user);

    let targetPath = '/dashboard';
    const stateStr = searchParams.get('state');
    if (stateStr) {
      try {
        const stateObj = JSON.parse(decodeURIComponent(stateStr));
        if (stateObj.redirect) targetPath = stateObj.redirect;
      } catch {
        // fallback
      }
    }

    if (user.role === 'ADMIN') {
      if (!targetPath.startsWith('/admin')) {
        targetPath = '/admin';
      }
    } else {
      if (targetPath.startsWith('/admin')) {
        targetPath = '/dashboard';
      }
    }

    const response = NextResponse.redirect(`${baseUrl}${targetPath}`);


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
  } catch (err) {
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}
