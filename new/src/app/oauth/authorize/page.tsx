
"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getIdToken } from '@/utils/getIdToken';

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
    <div className="ee-oauth-container">
      <div className="ee-oauth-card">
        <h2 className="ee-oauth-title">Authorize Application</h2>
        {loadingApp ? (
          <div className="ee-oauth-loading">Loading app info...</div>
        ) : (
          <>
            <div className="ee-oauth-appinfo">
              {appInfo?.logo_url && (
                <img src={appInfo.logo_url} alt="App logo" className="ee-oauth-logo" />
              )}
              <div>
                <div className="ee-oauth-appname">{appInfo?.name || clientId || 'Unknown App'}</div>
                {appInfo?.website_url && (
                  <a href={appInfo.website_url} target="_blank" rel="noopener noreferrer" className="ee-oauth-website">Visit website</a>
                )}
              </div>
            </div>
            {appInfo?.description && <div className="ee-oauth-desc">{appInfo.description}</div>}
          </>
        )}
        <div className="ee-oauth-divider" />
        <div className="ee-oauth-actions">
          <button
            className="ee-oauth-btn ee-oauth-btn-allow"
            onClick={() => handleDecision(true)}
            disabled={submitting}
          >
            Allow
          </button>
          <button
            className="ee-oauth-btn ee-oauth-btn-deny"
            onClick={() => handleDecision(false)}
            disabled={submitting}
          >
            Deny
          </button>
        </div>
      </div>
      <style jsx>{`
        .ee-oauth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f6fa;
        }
        .ee-oauth-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 2.5rem 2rem 2rem 2rem;
          max-width: 420px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .ee-oauth-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #3b4252;
          text-align: center;
        }
        .ee-oauth-loading {
          text-align: center;
          color: #888;
          margin: 2rem 0;
        }
        .ee-oauth-appinfo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        .ee-oauth-logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          object-fit: contain;
          background: #f3f6fa;
          border: 1px solid #e5e7eb;
        }
        .ee-oauth-appname {
          font-size: 1.15rem;
          font-weight: 600;
          color: #2d3748;
        }
        .ee-oauth-website {
          font-size: 0.95rem;
          color: #4f8cff;
          text-decoration: none;
          margin-top: 0.1rem;
          display: inline-block;
        }
        .ee-oauth-desc {
          color: #5a6270;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          margin-top: 0.5rem;
        }
        .ee-oauth-divider {
          border-bottom: 1px solid #e5e7eb;
          margin: 1.5rem 0 1.25rem 0;
        }
        .ee-oauth-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .ee-oauth-btn {
          min-width: 110px;
          padding: 0.7rem 0;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .ee-oauth-btn-allow {
          background: #4f8cff;
          color: #fff;
        }
        .ee-oauth-btn-allow:disabled {
          background: #bcd6fa;
          color: #fff;
          cursor: not-allowed;
        }
        .ee-oauth-btn-deny {
          background: #f3f6fa;
          color: #4f8cff;
          border: 1px solid #bcd6fa;
        }
        .ee-oauth-btn-deny:disabled {
          background: #f3f6fa;
          color: #bcd6fa;
          border: 1px solid #bcd6fa;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
