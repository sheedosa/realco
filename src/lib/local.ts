import { useState } from "react";

// Small, safe localStorage wrapper. Everything the visitor types in the preview stays on their device.
export function readLocal<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
export function writeLocal<T>(key: string, value: T | null) {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}
export function useLocal<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [v, set] = useState<T>(() => readLocal(key, fallback));
  return [v, (x: T) => { set(x); writeLocal(key, x); }];
}
export const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
