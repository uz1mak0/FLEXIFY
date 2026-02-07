import { NextRequest, NextResponse } from 'next/server';

// Redirects the user to Google's OAuth 2.0 consent screen
export async function GET(req: NextRequest) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: 'Missing GOOGLE_CLIENT_ID environment variable' }, { status: 500 });
    }

    const redirectUri = `${base}/api/auth/google/callback`;
    const scope = encodeURIComponent('openid email profile');
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope,
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error('Google auth redirect error:', err);
    return NextResponse.json({ error: 'Failed to start Google OAuth' }, { status: 500 });
  }
}
