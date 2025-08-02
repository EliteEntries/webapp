
"use client";
import React from "react";
import Accordian from "../../../components/Accordian";
import Connection from "./Connection";
import { deleteKey } from "../lib/deleteKey";
import Modal from "../../../components/Modal";

interface KeyInfo {
  keyName: string;
  apiKey: string;
  createdAt?: string;
}

const keyDescriptions: Record<string, string> = {
  Binance: "Connect your Binance API key to aggregate your trading data.",
  Coinbase: "Connect your Coinbase API key for portfolio tracking.",
  Kraken: "Connect your Kraken API key for trade automation.",
};

type KeysProps = {
  keys: KeyInfo[];
};


type KeysWithRefreshProps = KeysProps & { onDelete?: () => void };

const Keys: React.FC<KeysWithRefreshProps> = ({ keys, onDelete }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [confirmKey, setConfirmKey] = React.useState<string | null>(null);

  const handleDelete = async (keyName: string) => {
    setDeleting(keyName);
    const result = await deleteKey(keyName);
    setDeleting(null);
    setConfirmKey(null);
    if (result.success) {
      if (onDelete) onDelete();
    } else {
      alert(result.error || "Failed to delete key");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {keys.length === 0 ? (
        <div className="text-muted-foreground">No API keys found.</div>
      ) : (
        keys.map((conn, idx) => (
          <Accordian
            key={conn.keyName}
            title={conn.keyName}
            open={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            styles=""
          >
            <Connection
              name={conn.keyName}
              description={keyDescriptions[conn.keyName] || "API key for " + conn.keyName}
              apiKey={conn.apiKey}
            />
            <div className="flex justify-end mt-2">
              <button
                className="text-xs text-red-600 px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900 border border-red-200 dark:border-red-800 disabled:opacity-50"
                onClick={() => setConfirmKey(conn.keyName)}
                disabled={deleting === conn.keyName}
              >
                {deleting === conn.keyName ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Accordian>
        ))
      )}
      {/* Delete confirmation modal */}
      <Modal
        open={!!confirmKey}
        onClose={() => setConfirmKey(null)}
        title="Delete API Key?"
        description={`Are you sure you want to delete the key "${confirmKey}"? This cannot be undone.`}
        buttons={
          <>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={() => confirmKey && handleDelete(confirmKey)}
              disabled={!!deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button
              className="text-muted-foreground px-4 py-2 rounded"
              onClick={() => setConfirmKey(null)}
              disabled={!!deleting}
            >
              Cancel
            </button>
          </>
        }
      />
    </div>
  );
};

export default Keys;
