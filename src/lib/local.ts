import { useEffect, useRef, useState } from "react";

// Small, safe localStorage wrapper. Everything the visitor types in the preview stays on their device.
export function readLocal<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
export function writeLocal<T>(key: string, value: T | null) {
  try { if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ }
}

// The prerendered page knows nothing about this device, so the first render must not either: while a prerendered
// page is being taken over (`live` is false) saved values read as the fallback and arrive just after mount. Once the
// site is running, a page change reads them straight away, so nothing flickers between pages.
let live = false;
export const goLive = () => { live = true; };

/** A value kept on the device. `onLate` is called once with the saved value when it arrives after mount (a
    prerendered first page), so a component can fill the fields it derives from it. */
export function useLocal<T>(key: string, fallback: T, onLate?: (v: T) => void): [T, (v: T) => void] {
  const [v, set] = useState<T>(() => (live ? readLocal(key, fallback) : fallback));
  const early = useRef(live);
  useEffect(() => {
    goLive();
    if (early.current) return;
    early.current = true;
    const x = readLocal(key, fallback);
    set(x); onLate?.(x);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return [v, (x: T) => { set(x); writeLocal(key, x); }];
}
export const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
