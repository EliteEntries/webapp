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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const client_id = searchParams.get('client_id');
  if (!client_id) {
    return NextResponse.json({ error: 'Missing client_id' }, { status: 400 });
  }
  const db = getFirestore();
  const doc = await db.collection('clients').doc(client_id).get();
  if (!doc.exists) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }
  const { name, logo_url, description, website_url } = doc.data() || {};
  return NextResponse.json({ name, logo_url, description, website_url });
}
