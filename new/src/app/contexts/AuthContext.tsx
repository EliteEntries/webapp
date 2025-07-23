'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";

// AuthContext type
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth,
      (firebaseUser) => {
        if (isMounted) {
          setUser(firebaseUser ?? null);
          setLoading(false);
        }
      },
      (error) => {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    );
    // Fallback: ensure loading is false after a timeout (in case onAuthStateChanged never fires)
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);
    return () => {
      isMounted = false;
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useRouter } from "next/navigation";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  return <>{children}</>;
};
