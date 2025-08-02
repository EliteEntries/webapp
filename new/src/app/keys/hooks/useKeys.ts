import { useEffect, useState } from "react";
import { KeyInfo } from "../lib/getKeys";

export function useKeys(): { keys: KeyInfo[]; loading: boolean } {
  const [keys, setKeys] = useState<KeyInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let authUnsub: (() => void) | undefined;
    (async () => {
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");
      const auth = getAuth();
      authUnsub = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setKeys([]);
          setLoading(false);
          return;
        }
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
      });
    })();
    return () => {
      isMounted = false;
      if (authUnsub) authUnsub();
    };
  }, []);

  return { keys, loading };
}
