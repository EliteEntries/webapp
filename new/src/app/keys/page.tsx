// Convert to client component for modal state
'use client';

import { AuthGuard } from "../contexts/AuthContext";
import Keys from "./components/Keys";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useState } from "react";

import { getKeys, KeyInfo } from "./lib/getKeys";
import { createKey } from "./lib/createKey";

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
      const result = await createKey(keyName, apiKey);
      if (result.success) {
        setModalOpen(false);
        setKeyName("");
        setApiKey("");
        getKeys().then(setKeys);
      } else {
        alert(result.error || "Failed to save API key");
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
        <Keys keys={keys} onDelete={() => getKeys().then(setKeys)} />
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
