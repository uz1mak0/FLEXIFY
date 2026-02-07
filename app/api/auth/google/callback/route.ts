import { NextRequest, NextResponse } from 'next/server';

async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Missing Google client credentials');

  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Token exchange failed: ${text}`);
  }

  return resp.json();
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect('/');
    }
    if (!code) {
      return NextResponse.json({ error: 'Missing code' }, { status: 400 });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUri = `${base}/api/auth/google/callback`;

    const tokenData: any = await exchangeCodeForTokens(code, redirectUri);
    // tokenData contains access_token, id_token, refresh_token, expires_in

    // Fetch user info
    const userResp = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userInfo = await userResp.json();

    // Create a simple session payload (for demo purposes)
    const session = {
      provider: 'google',
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      tokens: {
        access_token: tokenData.access_token,
        id_token: tokenData.id_token,
        refresh_token: tokenData.refresh_token
      }
    };

    const sessionStr = Buffer.from(JSON.stringify(session)).toString('base64');

    const res = NextResponse.redirect('/home');
    // Simple cookie for demo; remove Secure for localhost
    res.headers.append('Set-Cookie', `session=${encodeURIComponent(sessionStr)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`);
    return res;
  } catch (err) {
    console.error('Google callback error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
