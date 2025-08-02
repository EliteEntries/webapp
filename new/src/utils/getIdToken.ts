import { onAuthStateChanged, User } from "firebase/auth";

export async function getIdToken(): Promise<string | null> {
  try {
    const { getAuth } = await import("firebase/auth");
    const auth = getAuth();
    // If user is already available, return token immediately
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    // Otherwise, wait for auth state to be restored
    return await new Promise<string | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
        unsubscribe();
        if (user) {
          try {
            const token = await user.getIdToken();
            resolve(token);
          } catch (err) {
            console.error("Error getting ID token from user:", err);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}
