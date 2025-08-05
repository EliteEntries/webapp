"use client";
import { useState } from "react";

export default function RegisterAppPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    redirect_uris: "",
    website_url: "",
    contact_email: "",
    logo_url: "",
  });
  const [result, setResult] = useState<{ client_id: string; client_secret: string } | { error: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/oauth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          redirect_uris: form.redirect_uris.split(/\s*,\s*/).filter(Boolean),
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Failed to register app" });
    }
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Register a New OAuth App</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <label>
          App Name*<br />
          <input name="name" value={form.name} onChange={handleChange} required style={{ width: "100%" }} />
        </label>
        <br /><br />
        <label>
          Description<br />
          <textarea name="description" value={form.description} onChange={handleChange} style={{ width: "100%" }} />
        </label>
        <br /><br />
        <label>
          Redirect URIs* (comma separated)<br />
          <input name="redirect_uris" value={form.redirect_uris} onChange={handleChange} required style={{ width: "100%" }} />
        </label>
        <br /><br />
        <label>
          Website URL<br />
          <input name="website_url" value={form.website_url} onChange={handleChange} style={{ width: "100%" }} />
        </label>
        <br /><br />
        <label>
          Contact Email<br />
          <input name="contact_email" value={form.contact_email} onChange={handleChange} style={{ width: "100%" }} />
        </label>
        <br /><br />
        <label>
          Logo URL<br />
          <input name="logo_url" value={form.logo_url} onChange={handleChange} style={{ width: "100%" }} />
        </label>
        <br /><br />
        <button type="submit" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Registering..." : "Register App"}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 24 }}>
          {"client_id" in result ? (
            <>
              <b>Registration successful!</b>
              <br />
              <b>Client ID:</b> <code>{result.client_id}</code>
              <br />
              <b>Client Secret:</b> <code>{result.client_secret}</code>
              <br />
              <span style={{ color: "red" }}><b>Save these values securely. You will not be able to view the client secret again.</b></span>
            </>
          ) : (
            <span style={{ color: "red" }}>{result.error}</span>
          )}
        </div>
      )}
    </div>
  );
}
