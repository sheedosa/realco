import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { DoorId } from "../data/site";
import { readLocal, writeLocal } from "./local";

// One enquiry layer for all three doors. Pages open the drawer with a door and an optional prefilled summary
// (a property, a stay with dates, a build project); the drawer keeps a draft and the last sent enquiry on this device.
export type Prefill = { door?: DoorId; role?: string; about?: string; need?: string };
export type Enquiry = { door: DoorId; role: string; need: string; about: string; name: string; contact: string; when: string; days: string; sentAt: string };

type Ctx = { open: boolean; prefill: Prefill; openDrawer: (p?: Prefill) => void; closeDrawer: () => void; last: Enquiry | null; setLast: (e: Enquiry | null) => void };
const C = createContext<Ctx>({ open: false, prefill: {}, openDrawer: () => {}, closeDrawer: () => {}, last: null, setLast: () => {} });
const KEY = "realco-enquiry";

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<Prefill>({});
  const [last, set] = useState<Enquiry | null>(() => readLocal<Enquiry | null>(KEY, null));
  const setLast = useCallback((e: Enquiry | null) => { set(e); writeLocal(KEY, e); }, []);
  const openDrawer = useCallback((p: Prefill = {}) => { setPrefill(p); setOpen(true); }, []);
  const closeDrawer = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, prefill, openDrawer, closeDrawer, last, setLast }), [open, prefill, openDrawer, closeDrawer, last, setLast]);
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useEnquiry = () => useContext(C);
