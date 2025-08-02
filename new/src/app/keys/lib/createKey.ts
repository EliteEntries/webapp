export async function createKey(keyName: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { getIdToken } = await import("@/utils/getIdToken");
    const idToken = await getIdToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/key/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
      },
      body: JSON.stringify({ keyName, apiKey }),
    });
    if (res.ok) {
      return { success: true };
    } else {
      let errorMsg = res.statusText;
      try {
        const data = await res.json();
        if (data?.error) errorMsg = data.error;
      } catch {}
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    let errorMsg = "Failed to save API key";
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === "string") {
      errorMsg = err;
    }
    return { success: false, error: errorMsg };
  }
}
