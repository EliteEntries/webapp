
export interface KeyInfo {
  keyName: string;
  apiKey: string;
  createdAt?: string;
}

export async function getKeys(): Promise<KeyInfo[]> {
  const { getIdToken } = await import("@/utils/getIdToken");
  const idToken = await getIdToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 
    'http://localhost:3000'}/api/key/list`, {
    cache: 'no-store',
    headers: {
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.keys || [];
}
