import { useEffect, useState } from "react";
import { KeyInfo } from "../lib/getKeys";

export function useKeys(): { keys: KeyInfo[]; loading: boolean } {
  const [keys, setKeys] = useState<KeyInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;
    let authUnsub: (() => void) | undefined;
    (async () => {
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");
      const { getFirestore, collection, onSnapshot } = await import("firebase/firestore");
      const auth = getAuth();
      const db = getFirestore();
      authUnsub = onAuthStateChanged(auth, (user) => {
        if (!user) {
          setKeys([]);
          setLoading(false);
          if (unsubscribe) unsubscribe();
          return;
        }
        setLoading(true);
        if (unsubscribe) unsubscribe();
        const keysCol = collection(db, "users", user.uid, "keys");
        unsubscribe = onSnapshot(keysCol, (snapshot) => {
          if (!isMounted) return;
          const keys: KeyInfo[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              keyName: doc.id,
              apiKey: data.apiKey || "",
              createdAt: data.createdAt || undefined,
            };
          });
          setKeys(keys);
          setLoading(false);
        });
      });
    })();
    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      if (authUnsub) authUnsub();
    };
  }, []);

  return { keys, loading };
}
