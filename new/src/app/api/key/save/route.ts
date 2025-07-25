import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY not set in env");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export async function POST(req: NextRequest) {
  const { keyName, apiKey } = await req.json();
  if (!keyName || !apiKey) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const { getServerAuthUser } = await import("@/utils/serverAuth");
  const authUser = await getServerAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = authUser.uid;
  const db = getFirestore();
  const encryptedKey = encrypt(apiKey);
  await db.collection("users").doc(userId).collection("keys").doc(keyName).set({
    encryptedKey,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ success: true });
}