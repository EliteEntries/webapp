
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from "next/image";

import { getIdToken } from '@/utils/getIdToken';

import logo from "../../public/logo.png";

export default function OAuthAuthorizePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const state = searchParams.get('state');
  const scope = searchParams.get('scope');
  const [appInfo, setAppInfo] = useState<{ name?: string; logo_url?: string; description?: string; website_url?: string } | null>(null);
  const [loadingApp, setLoadingApp] = useState(false);

  // Fetch app info by clientId
  useEffect(() => {
    if (!clientId) return;
    setLoadingApp(true);
    fetch(`/api/oauth/client?client_id=${encodeURIComponent(clientId)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setAppInfo(data))
      .catch(() => setAppInfo(null))
      .finally(() => setLoadingApp(false));
  }, [clientId]);

  const handleDecision = async (allow: boolean) => {
    setSubmitting(true);
    if (allow) {
      // Get Firebase ID token for the current user
      const idToken = await getIdToken();
      if (!idToken) {
        alert('You must be signed in to authorize.');
        setSubmitting(false);
        return;
      }
      // Set session cookie by calling session API
      const sessionRes = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });
      if (!sessionRes.ok) {
        alert('Failed to set session. Please try again.');
        setSubmitting(false);
        return;
      }
      // Pass state through as received (assume already base64-encoded JSON from client app)
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-stretch">
        <div className="flex items-center justify-center mb-6 gap-3">
          <Image
            src={logo.src}
            alt="Elite Entries Logo"
            className="w-10 h-10 rounded-lg shadow-sm object-contain"
            style={{ background: '#7b93df' }}
          />
          <h2 className="text-2xl font-bold text-gray-800">Authorize Application</h2>
        </div>
        {loadingApp ? (
          <div className="text-center text-gray-400 my-8">Loading app info...</div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-2">
              {appInfo?.logo_url && (
                <img src={appInfo.logo_url} alt="App logo" className="w-14 h-14 rounded-lg object-contain border border-gray-200 bg-gray-50" />
              )}
              <div>
                <div className="text-lg font-semibold text-gray-700">{appInfo?.name || clientId || 'Unknown App'}</div>
                {appInfo?.website_url && (
                  <a href={appInfo.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Visit website</a>
                )}
              </div>
            </div>
            {appInfo?.description && <div className="text-gray-500 text-base mb-4 mt-1">{appInfo.description}</div>}
          </>
        )}
        <div className="border-b border-gray-200 my-6" />
        <div className="flex gap-4 justify-center">
          <button
            className="min-w-[110px] px-4 py-2 rounded-md font-semibold text-white bg-primary hover:bg-primary/90 transition disabled:bg-primary/50 disabled:cursor-not-allowed"
            onClick={() => handleDecision(true)}
            disabled={submitting}
          >
            Allow
          </button>
          <button
            className="min-w-[110px] px-4 py-2 rounded-md font-semibold text-primary bg-gray-100 border border-primary/20 hover:bg-primary/5 transition disabled:bg-gray-200 disabled:text-primary/50 disabled:cursor-not-allowed"
            onClick={() => handleDecision(false)}
            disabled={submitting}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}
