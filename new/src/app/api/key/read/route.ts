import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import crypto from "crypto";

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET as string;
if (!ENCRYPTION_SECRET) throw new Error("ENCRYPTION_SECRET not set in env");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

function decrypt(text: string): string {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_SECRET, "hex"), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function POST(req: NextRequest) {
  const { userId, keyName } = await req.json();
  if (!userId || !keyName) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const db = getFirestore();
  const doc = await db.collection("users").doc(userId).collection("keys").doc(keyName).get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }
  const { encryptedKey } = doc.data() || {};
  if (!encryptedKey) {
    return NextResponse.json({ error: "No encrypted key" }, { status: 500 });
  }
  const apiKey = decrypt(encryptedKey);
  return NextResponse.json({ apiKey });
}