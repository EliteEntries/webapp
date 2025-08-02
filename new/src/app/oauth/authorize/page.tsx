"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OAuthAuthorizePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');
  const scope = searchParams.get('scope');

  const handleDecision = async (allow: boolean) => {
    setSubmitting(true);
    if (allow) {
      // Redirect to API authorize endpoint to issue code
      const url = new URL('/api/oauth/authorize', window.location.origin);
      url.searchParams.set('client_id', clientId || '');
      url.searchParams.set('redirect_uri', redirectUri || '');
      url.searchParams.set('response_type', 'code');
      if (state) url.searchParams.set('state', state);
      if (scope) url.searchParams.set('scope', scope);
      window.location.href = url.toString();
    } else {
      // Redirect back to client with error
      if (redirectUri) {
        const url = new URL(redirectUri);
        url.searchParams.set('error', 'access_denied');
        if (state) url.searchParams.set('state', state);
        window.location.href = url.toString();
      } else {
        router.replace('/');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Authorize Application</h2>
      <p><b>App:</b> {clientId || 'Unknown App'}</p>
      <p><b>Requested access:</b> {scope || 'None'}</p>
      <div style={{ marginTop: 24 }}>
        <button onClick={() => handleDecision(true)} disabled={submitting} style={{ marginRight: 12 }}>Allow</button>
        <button onClick={() => handleDecision(false)} disabled={submitting}>Deny</button>
      </div>
    </div>
  );
}
