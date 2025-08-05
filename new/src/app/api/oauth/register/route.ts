
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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

function generateId(length = 24) {
  return crypto.randomBytes(length).toString('hex');
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, description, redirect_uris, website_url, contact_email, logo_url } = body;
  if (!name || !redirect_uris || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Generate client_id and client_secret
  const client_id = generateId(12);
  const client_secret = generateId(24);
  const client = {
    client_id,
    client_secret,
    name,
    description: description || '',
    redirect_uris,
    website_url: website_url || '',
    contact_email: contact_email || '',
    logo_url: logo_url || '',
    created_at: new Date().toISOString(),
    status: 'active',
  };
  // Store client in Firestore 'clients' collection
  const db = getFirestore();
  await db.collection('clients').doc(client_id).set(client);
  return NextResponse.json({ client_id, client_secret });
}
