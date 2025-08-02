import { useEffect, useState } from "react";
import { KeyInfo } from "../lib/getKeys";

export function useKeys(): KeyInfo[] {
  const [keys, setKeys] = useState<KeyInfo[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;
    (async () => {
      const { getAuth } = await import("firebase/auth");
      const { getFirestore, collection, onSnapshot } = await import("firebase/firestore");
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;
      if (!user) return;
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
      });
    })();
    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return keys;
}
