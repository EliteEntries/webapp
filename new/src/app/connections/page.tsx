import { AuthGuard } from "../contexts/AuthContext";
import Connections from "./components/Connections";

interface KeyInfo {
  keyName: string;
  apiKey: string;
  createdAt?: string;
}

async function getKeys(): Promise<KeyInfo[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 
    'http://localhost:3000'}/api/key/list`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.keys || [];
}

export default async function ConnectionsPage() {
  const keys = await getKeys();

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto p-8 mt-12">
        <h1 className="text-2xl font-bold mb-6">Connections</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">Aggregate your API keys for various exchanges and services below.</p>
        <Connections keys={keys} />
      </div>
    </AuthGuard>
  );
}
