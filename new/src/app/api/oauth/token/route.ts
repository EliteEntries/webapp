
import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, client_id, client_secret, redirect_uri, grant_type } = body;

  if (grant_type !== 'authorization_code' || !code || !client_id || !client_secret || !redirect_uri) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const db = getFirestore();
  // Validate client_id and client_secret
  const clientDoc = await db.collection('clients').doc(client_id).get();
  if (!clientDoc.exists) {
    return NextResponse.json({ error: 'invalid_client' }, { status: 400 });
  }
  const clientData = clientDoc.data();
  if (!clientData || clientData.client_secret !== client_secret) {
    return NextResponse.json({ error: 'invalid_client' }, { status: 400 });
  }

  // Lookup auth code in Firestore
  const codeDoc = await db.collection('authCodes').doc(code).get();
  if (!codeDoc.exists) {
    return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
  }
  const codeData = codeDoc.data();
  if (!codeData || codeData.clientId !== client_id || codeData.redirectUri !== redirect_uri || codeData.used) {
    return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
  }

  // Generate access token
  const accessToken = Math.random().toString(36).substring(2, 15);
  await db.collection('accessTokens').doc(accessToken).set({
    userId: codeData.userId,
    clientId: client_id,
    createdAt: new Date().toISOString(),
  });

  // Mark code as used
  await db.collection('authCodes').doc(code).update({ used: true });

  return NextResponse.json({
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 3600,
    scope: 'read:keys',
  });
}
