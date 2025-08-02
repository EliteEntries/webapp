import { NextRequest, NextResponse } from 'next/server';

// Dummy in-memory stores (replace with DB in production)
const authCodes = new Map<string, { clientId: string; userId: string; redirectUri: string }>();
const accessTokens = new Map<string, { userId: string; clientId: string }>();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, client_id, client_secret, redirect_uri, grant_type } = body;

  // TODO: Validate client_id/client_secret
  if (grant_type !== 'authorization_code' || !code || !client_id || !redirect_uri) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const codeData = authCodes.get(code);
  if (!codeData || codeData.clientId !== client_id || codeData.redirectUri !== redirect_uri) {
    return NextResponse.json({ error: 'invalid_grant' }, { status: 400 });
  }

  // Generate access token
  const accessToken = Math.random().toString(36).substring(2, 15);
  accessTokens.set(accessToken, { userId: codeData.userId, clientId: client_id });

  // Remove used code
  authCodes.delete(code);

  return NextResponse.json({
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 3600,
    scope: 'read:keys',
  });
}
