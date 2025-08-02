// Convert to client component for modal state
'use client';

import { AuthGuard } from "../contexts/AuthContext";
import Keys from "./components/Connections";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useState } from "react";


interface KeyInfo {
  keyName: string;
  apiKey: string;
  createdAt?: string;
}


async function getKeys(): Promise<KeyInfo[]> {
  const { getIdToken } = await import("../../utils/getIdToken");
  console.log("Fetching keys...");
  const idToken = await getIdToken();
  console.log("Fetching keys with ID token:", idToken);
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

import React from "react";

export default function KeysPage() {
  const [keys, setKeys] = useState<KeyInfo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    getKeys().then(setKeys);
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { getIdToken } = await import("../../utils/getIdToken");
      const idToken = await getIdToken();
      console.log(`Creating key with name "${keyName}" and API key:`, apiKey);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/key/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ keyName, apiKey }),
      });
      if (res.ok) {
        setModalOpen(false);
        setKeyName("");
        setApiKey("");
        getKeys().then(setKeys);
      } else {
        let errorMsg = res.statusText;
        try {
          const data = await res.json();
          if (data?.error) errorMsg = data.error;
        } catch {}
        alert(errorMsg);
      }
    } catch (err) {
      let errorMsg = "Failed to save API key";
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === "string") {
        errorMsg = err;
      }
      alert(errorMsg);
    }
    setLoading(false);
  };

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto p-8 mt-12">
        <h1 className="text-2xl font-bold mb-6">Keys</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">Aggregate your API keys for various exchanges and services below.</p>
        <Button className="mb-6 px-4 py-2 bg-primary text-white rounded" onClick={() => setModalOpen(true)}>
          Create Key
        </Button>
        <Keys keys={keys} />
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New API Key"
          description="Enter a name and API key to save."
          buttons={
            <>
              <Button
                className={`bg-primary text-white px-4 py-2 rounded${loading || !keyName || !apiKey ? ' opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!loading && keyName && apiKey) handleCreate();
                }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button className="text-muted-foreground px-4 py-2 rounded" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4 mt-2">
            <input
              type="text"
              placeholder="Key Name"
              value={keyName}
              onChange={e => setKeyName(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="border px-3 py-2 rounded w-full font-mono"
              disabled={loading}
            />
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
