
'use client';
import React from "react";

import { auth } from "@/utils/firebase";
import { useAuth } from "../contexts/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Button from "@/components/Button";
import Loading from "@/components/Loading";


export default function HomeButton() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
      window.location.href = "/connections";
    } catch (error) {
      // Optionally handle error
      console.error("Google sign-in error:", error);
    }
  };

  return !user ? (
    <Button
      className="mt-4 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow hover:opacity-90 transition-colors"
      onClick={handleGoogleLogin}
    >
      Log In with Google
    </Button>
  ) : (
    <Button
      className="mt-4 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow hover:opacity-90 transition-colors"
    >
      <a href="/connections">
        Manage Connections
      </a>
    </Button>
  );
}

