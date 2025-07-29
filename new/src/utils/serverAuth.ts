import { cookies, headers } from 'next/headers';
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

export async function getServerAuthUser() {
  // Try Authorization header first
  const reqHeaders = await headers();
  let idToken: string | undefined;
  const authHeader = reqHeaders.get('authorization') || reqHeaders.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    idToken = authHeader.slice(7);
  } else {
    // Fallback to session cookie
    const cookieStore = await cookies();
    idToken = cookieStore.get('session')?.value;
  }
  if (!idToken) {
    console.log("No ID token found in Authorization header or session cookie");
    return null;
  }
  try {
    console.log("Verifying ID token:", idToken);
    const decoded = await getAuth().verifyIdToken(idToken);
    return decoded; // contains uid, email, etc.
  } catch (err) {
    console.error("Token verification failed", err);
    return null;
  }
}