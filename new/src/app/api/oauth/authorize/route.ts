
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function GET(req: NextRequest) {
  // Parse query params: client_id, redirect_uri, response_type, state
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const responseType = searchParams.get('response_type');
  const state = searchParams.get('state');

  if (!clientId || !redirectUri || responseType !== 'code') {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  // Authenticate user via session cookie
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )session=([^;]+)/);
  if (!match) {
    return NextResponse.json({ error: 'Missing session cookie' }, { status: 401 });
  }
  const idToken = decodeURIComponent(match[1]);
  let userId: string;
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    userId = decoded.uid;
  } catch {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }

  // Generate auth code
  const code = Math.random().toString(36).substring(2, 15);
  // Store code in Firestore (collection: authCodes)
  const db = getFirestore();
  await db.collection('authCodes').doc(code).set({
    clientId,
    userId,
    redirectUri,
    createdAt: new Date().toISOString(),
    used: false,
  });

  // Redirect back to client with code
  const redirect = new URL(redirectUri);
  redirect.searchParams.set('code', code);
  if (state) redirect.searchParams.set('state', state);

  return NextResponse.redirect(redirect.toString());
}
