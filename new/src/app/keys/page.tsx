// Convert to client component for modal state
'use client';


import { useState } from "react";
import { AuthGuard } from "../contexts/AuthContext";
import Keys from "./components/Keys";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useKeys } from "./hooks/useKeys";
import { createKey } from "./lib/createKey";

export default function KeysPage() {
  const { keys, loading } = useKeys();
  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const result = await createKey(keyName, apiKey);
      if (result.success) {
        setModalOpen(false);
        setKeyName("");
        setApiKey("");
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
    setSaving(false);
  };


  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto p-8 mt-12">
        <h1 className="text-2xl font-bold mb-6">Keys</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">Aggregate your API keys for various exchanges and services below.</p>
        <Button className="mb-6 px-4 py-2 bg-primary text-white rounded" onClick={() => setModalOpen(true)}>
          Create Key
        </Button>
        {loading ? (
          <div className="text-center text-muted-foreground my-8">Loading keys...</div>
        ) : (
          <Keys keys={keys} />
        )}
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New API Key"
          description="Enter a name and API key to save."
          buttons={
            <>
              <Button
                className={`bg-primary text-white px-4 py-2 rounded${saving || !keyName || !apiKey ? ' opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (!saving && keyName && apiKey) handleCreate();
                }}
              >
                {saving ? "Saving..." : "Save"}
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
              disabled={saving}
            />
            <input
              type="text"
              placeholder="API Key"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="border px-3 py-2 rounded w-full font-mono"
              disabled={saving}
            />
          </div>
        </Modal>
      </div>
    </AuthGuard>
  );
}
