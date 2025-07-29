import { cookies } from 'next/headers';
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
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) {
    console.log("No session cookie found");
    return null;
  }
  try {
    console.log("Verifying session:", session);
    const decoded = await getAuth().verifyIdToken(session);
    return decoded; // contains uid, email, etc.
  } catch {
    return null;
  }
}