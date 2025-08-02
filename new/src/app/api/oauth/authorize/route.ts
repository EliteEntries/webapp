import { NextRequest, NextResponse } from 'next/server';

// Dummy in-memory store for auth codes (replace with DB in production)
const authCodes = new Map<string, { clientId: string; userId: string; redirectUri: string }>();

export async function GET(req: NextRequest) {
  // Parse query params: client_id, redirect_uri, response_type, state, scope
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const responseType = searchParams.get('response_type');
  const state = searchParams.get('state');
  const scope = searchParams.get('scope');

  // TODO: Authenticate user session here
  const userId = 'demo-user'; // Replace with real user ID

  if (!clientId || !redirectUri || responseType !== 'code') {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  // Generate auth code
  const code = Math.random().toString(36).substring(2, 15);
  authCodes.set(code, { clientId, userId, redirectUri });

  // Redirect back to client with code
  const redirect = new URL(redirectUri);
  redirect.searchParams.set('code', code);
  if (state) redirect.searchParams.set('state', state);

  return NextResponse.redirect(redirect.toString());
}
