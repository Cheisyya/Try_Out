// src/lib/kv.ts
/**
 * Simple wrapper around Vercel KV for overlay status.
 * In development (NODE_ENV !== "production") it falls back to the file‑based
 * storage implementation in `status-paket.ts`.
 */
import { get, set } from "@vercel/kv";

export async function getOverlay(key: string): Promise<any> {
  try {
    const raw = await get(key);
    return raw ? JSON.parse(raw as string) : null;
  } catch {
    // If KV is not available, return null so caller can fallback.
    return null;
  }
}

export async function setOverlay(key: string, value: any): Promise<boolean> {
  try {
    await set(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
