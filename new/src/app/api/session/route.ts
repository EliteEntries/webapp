

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
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

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('Received body:', body);
  const { token } = body;
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 400 });
  }
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const response = NextResponse.json({ status: 'success', uid: decodedToken.uid });
    response.headers.set('Set-Cookie', `session=${token}; HttpOnly; Path=/; Secure; SameSite=Strict`);
    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
