import React from "react";
import { AuthGuard } from "../contexts/AuthContext";
import Connections from "./components/Connections";

export default function ConnectionsPage() {
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Connections</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">Aggregate your API keys for various exchanges and services below.</p>
        <Connections />
      </div>
    </AuthGuard>
  );
}
