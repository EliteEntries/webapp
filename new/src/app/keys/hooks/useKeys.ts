
import { useEffect, useState } from "react";
import { KeyInfo } from "../lib/getKeys";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

export function useKeys(): { keys: KeyInfo[]; loading: boolean } {
  const [keys, setKeys] = useState<KeyInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let authUnsub: (() => void) | undefined;
    let firestoreUnsub: (() => void) | undefined;

    const fetchKeys = async (user: User) => {
      setLoading(true);
      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/key/list", {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          setKeys(data.keys || []);
        } else {
          setKeys([]);
        }
      } catch {
        setKeys([]);
      }
      setLoading(false);
    };

    const setupFirestoreListener = (user: User) => {
      try {
        const db = getFirestore();
        // Listen to the user's keys subcollection (adjust path as needed)
        const keysCol = collection(db, "users", user.uid, "keys");
        firestoreUnsub = onSnapshot(keysCol, () => {
          fetchKeys(user);
        });
      } catch {
        // Firestore not available or not initialized
      }
    };

    const unsub = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        setKeys([]);
        setLoading(false);
        if (firestoreUnsub) firestoreUnsub();
        return;
      }
      fetchKeys(user);
      setupFirestoreListener(user);
    });

    return () => {
      isMounted = false;
      unsub();
      if (firestoreUnsub) firestoreUnsub();
    };
  }, []);

  return { keys, loading };
}
