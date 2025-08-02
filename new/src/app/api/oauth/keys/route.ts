import { NextRequest, NextResponse } from 'next/server';

// Dummy in-memory store for access tokens (replace with DB in production)
const accessTokens = new Map<string, { userId: string; clientId: string }>();

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }
  const token = auth.slice('Bearer '.length);
  const tokenData = accessTokens.get(token);
  if (!tokenData) {
    return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
  }

  // TODO: Fetch real keys for user
  const keys = [{ id: 'key1', value: 'demo-key-value' }];
  return NextResponse.json({ keys });
}
