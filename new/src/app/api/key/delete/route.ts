import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function POST(req: NextRequest) {
  const { keyName } = await req.json();
  if (!keyName) {
    return NextResponse.json({ error: "Missing keyName" }, { status: 400 });
  }
  const { getServerAuthUser } = await import("@/utils/serverAuth");
  const authUser = await getServerAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = authUser.uid;
  const db = getFirestore();
  await db.collection("users").doc(userId).collection("keys").doc(keyName).delete();
  return NextResponse.json({ success: true });
}
