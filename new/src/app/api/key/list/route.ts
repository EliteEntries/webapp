import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getServerAuthUser } from "@/utils/serverAuth";
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

function decrypt(text: string): string {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function maskKey(key: string) {
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "-xxxx-xxxx-" + key.slice(-4);
}

export async function GET() {
  const authUser = await getServerAuthUser();
  
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = authUser.uid;
  const db = getFirestore();
  const keysSnap = await db.collection("users").doc(userId).collection("keys").get();
  const keys = keysSnap.docs.map(doc => {
    const { encryptedKey, createdAt } = doc.data();
    let apiKey = "";
    if (encryptedKey) {
      try {
        apiKey = maskKey(decrypt(encryptedKey));
      } catch {
        apiKey = "****";
      }
    }
    return {
      keyName: doc.id,
      apiKey,
      createdAt,
    };
  });
  return NextResponse.json({ keys });
}
