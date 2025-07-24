import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    res.status(401).json({ error: 'Invalid token' });
    // Handle error
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; Secure; SameSite=Strict`);
    res.status(200).json({ status: 'success', uid: decodedToken.uid });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
