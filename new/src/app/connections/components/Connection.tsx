'use client';

import React, { useState } from "react";
import Button from "../../../components/Button";

interface ConnectionProps {
  name: string;
  description: string;
  apiKey: string;
}

function maskKey(key: string) {
  if (key.length <= 8) return "****";
  return key.slice(0, 4) + "-xxxx-xxxx-" + key.slice(-4);
}

const Connection: React.FC<ConnectionProps> = ({ name, description, apiKey }) => {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(apiKey);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setInput(apiKey);
  };
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/key/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyName: name, apiKey: input }),
      });
      if (!res.ok) {
        // Optionally handle error
        alert("Failed to save API key");
      }
    } catch {
      alert("Failed to save API key");
    }
    setEditing(false);
    setSaving(false);
  };

  return (
    <div>
      <p className="mb-2">{description}</p>
      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono flex items-center justify-between">
        <span>{editing ? (
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="bg-transparent border-b border-primary px-2 py-1 w-32 md:w-48 font-mono outline-none"
              style={{ fontSize: '16px' }}
              autoFocus
            />
        ) : (
          maskKey(apiKey)
        )}</span>
        {editing ? (
          <span className="flex gap-2">
            <Button className="text-primary text-xs px-2 py-1 rounded hover:bg-primary/10" onClick={handleSave}>Save</Button>
            <Button className="text-muted-foreground text-xs px-2 py-1 rounded hover:bg-muted/10" onClick={handleCancel}>Cancel</Button>
          </span>
        ) : (
          <Button className="text-primary text-xs px-2 py-1 rounded hover:bg-primary/10" onClick={handleEdit}>Edit</Button>
        )}
      </div>
    </div>
  );
};

export default Connection;
