import { useState } from "react";
import { PROJECT_TYPES, SERVICE_LEVELS, type ProjectType, type ServiceLevelId } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { gbp, useLocal } from "../lib/local";
import { Icon } from "./Svg";

/* ---------- Lettings: landlord calculator ---------- */
export type RentSaved = { rent: number; level: ServiceLevelId };
export const RENT_KEY = "realco-rent";

export function LandlordCalculator({ compact = false }: { compact?: boolean }) {
  const [saved, setSaved] = useLocal<RentSaved | null>(RENT_KEY, null);
  const [rent, setRent] = useState(saved ? String(saved.rent) : "");
  const [level, setLevel] = useState<ServiceLevelId>(saved?.level ?? "managed");
  const { openDrawer } = useEnquiry();
  const n = Number(rent);
  const ok = n >= 300 && n <= 20000;
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (ok) setSaved({ rent: n, level }); };
  const pick = (id: ServiceLevelId) => { setLevel(id); if (saved) setSaved({ ...saved, level: id }); };
  const shown = saved?.rent ?? (ok ? n : null);

  return (
    <div className="door-lettings flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="lc-rent" className="label">Monthly rent you expect</label>
          <div className="flex"><span className="inline-flex h-12 items-center rounded-l-[3px] border border-r-0 border-ink bg-stone px-3 text-base" aria-hidden="true">£</span><input id="lc-rent" inputMode="numeric" value={rent} onChange={(e) => setRent(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="1800" className="field rounded-l-none" aria-describedby="lc-help" /></div>
        </div>
        <button type="submit" className="btn btn-door">Show what I'd keep</button>
      </form>
      <p id="lc-help" role="status" className="text-sm text-mute">{shown ? `Based on ${gbp(shown)} a month, before VAT, saved on this device.` : "Enter a rent to see the three figures."}</p>
      <p className="label text-mute">Three service levels · sample fee percentages until the client confirms</p>
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-3" : "md:grid-cols-3"}`}>
        {SERVICE_LEVELS.map((s) => {
          const on = level === s.id;
          const keep = shown ? shown * (1 - s.pct / 100) : null;
          return (
            <div key={s.id} className={`flex flex-col gap-3 rounded-pill border p-4 ${on ? "border-door bg-door-t" : "border-line bg-paper"}`}>
              <div className="flex items-start justify-between gap-2"><h3 className="text-base">{s.name}</h3><span className="label rounded-pill bg-paper px-2 py-1 text-[11px] text-door">[FEE %] · {s.pct}%</span></div>
              <p className="display text-[32px] leading-none">{keep !== null ? gbp(keep) : "£—"}<span className="font-sans text-sm font-normal text-mute"> /month</span></p>
              <p className="text-sm text-mute">{keep !== null ? `${gbp(keep * 12)} a year, after a fee of ${gbp(shown! - keep)} a month.` : "Enter a rent to see the figure."}</p>
              {!compact && <ul className="flex flex-col gap-1 text-sm">{s.includes.map((x) => <li key={x} className="flex gap-2"><Icon.Check /> {x}</li>)}</ul>}
              <button type="button" aria-pressed={on} onClick={() => pick(s.id)} className={`chip justify-center ${on ? "" : "border-line"}`}>{on ? "Selected" : "Choose"}</button>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => openDrawer({ door: "lettings", role: "I'm a landlord", need: level === "managed" ? "Fully managed service" : "Let only or rent collection", about: shown ? `Rent about ${gbp(shown)} pcm, interested in ${SERVICE_LEVELS.find((x) => x.id === level)!.name}.` : "" })} className="btn btn-ink self-start">Ask for a rental valuation</button>
    </div>
  );
}

/* ---------- Stays: dates + guests enquiry ---------- */
export type StaySaved = { checkIn: string; checkOut: string; guests: number; stay?: string };
export const STAY_KEY = "realco-stay";
export const nightsBetween = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);

export function StayEnquiry({ stayTitle, minNights = 2, sleeps }: { stayTitle?: string; minNights?: number; sleeps?: number }) {
  const [saved, setSaved] = useLocal<StaySaved | null>(STAY_KEY, null);
  const [checkIn, setIn] = useState(saved?.checkIn ?? "");
  const [checkOut, setOut] = useState(saved?.checkOut ?? "");
  const [guests, setGuests] = useState(saved?.guests ?? 2);
  const [msg, setMsg] = useState<string | null>(null);
  const { openDrawer } = useEnquiry();
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const summary = saved && saved.checkIn && saved.checkOut ? saved : null;
  const sNights = summary ? nightsBetween(summary.checkIn, summary.checkOut) : 0;
  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights < 1) { setMsg("Choose a check-in and a later check-out date."); return; }
    if (nights < minNights) { setMsg(`This stay has a ${minNights}-night minimum.`); return; }
    if (sleeps && guests > sleeps) { setMsg(`This apartment sleeps ${sleeps}.`); return; }
    setMsg(null); setSaved({ checkIn, checkOut, guests, stay: stayTitle });
  };

  return (
    <div className="door-stays flex flex-col gap-4">
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
        <div className="flex flex-col gap-1.5"><label htmlFor="st-in" className="label">Check in</label><input id="st-in" type="date" value={checkIn} onChange={(e) => setIn(e.target.value)} className="field" /></div>
        <div className="flex flex-col gap-1.5"><label htmlFor="st-out" className="label">Check out</label><input id="st-out" type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => setOut(e.target.value)} className="field" /></div>
        <div className="flex flex-col gap-1.5"><label htmlFor="st-g" className="label">Guests</label><select id="st-g" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field sm:w-24">{[1, 2, 3, 4, 5, 6].map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
        <button type="submit" className="btn btn-door">Check dates</button>
      </form>
      <p role="status" className="min-h-6 text-sm text-mute">{msg ?? (summary ? "" : "An enquiry, not a booking: we confirm availability and the exact price by reply.")}</p>
      {summary && !msg && (
        <div className="card flex flex-col gap-3 bg-door-t p-5">
          <p className="label text-door">Enquiry summary</p>
          <p className="text-lg"><b>{summary.stay ?? "Any apartment"}</b> · {fmt(summary.checkIn)} to {fmt(summary.checkOut)} · {sNights} {sNights === 1 ? "night" : "nights"} · {summary.guests} {summary.guests === 1 ? "guest" : "guests"}</p>
          <p className="text-sm text-mute">£[PRICE] per night × {sNights} nights = £[TOTAL], plus [CLEANING FEE]. Sample pricing; confirmed by reply. Saved on this device.</p>
          <button type="button" onClick={() => openDrawer({ door: "stays", need: "Check availability and price", about: `${summary.stay ?? "Any apartment"}, ${fmt(summary.checkIn)} to ${fmt(summary.checkOut)} (${sNights} nights), ${summary.guests} guests.` })} className="btn btn-door self-start">Send this enquiry</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Build: project enquiry ---------- */
export type BuildSaved = { type: ProjectType; size: string; timing: string };
export const BUILD_KEY = "realco-build";
const TIMINGS = ["As soon as possible", "In the next 3 months", "In 3 to 6 months", "Later, just planning"];

export function BuildEnquiry() {
  const [saved, setSaved] = useLocal<BuildSaved | null>(BUILD_KEY, null);
  const [type, setType] = useState<ProjectType>(saved?.type ?? "Extension");
  const [size, setSize] = useState(saved?.size ?? "");
  const [timing, setTiming] = useState(saved?.timing ?? TIMINGS[1]);
  const { openDrawer } = useEnquiry();
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSaved({ type, size, timing }); };
  const needFor: Record<ProjectType, string> = { Refurbishment: "A quote for a refurbishment", Extension: "A quote for an extension", "Loft conversion": "A quote for a loft conversion", "New build": "A new build" };

  return (
    <div className="door-build flex flex-col gap-4">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <fieldset>
          <legend className="label mb-2">Project type</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={`chip justify-center ${type === t ? "" : "border-line"}`}>{t}</button>)}</div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
          <div className="flex flex-col gap-1.5"><label htmlFor="bd-size" className="label">Rough size (m²)</label><input id="bd-size" inputMode="numeric" value={size} onChange={(e) => setSize(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="25" className="field" /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="bd-when" className="label">Timing</label><select id="bd-when" value={timing} onChange={(e) => setTiming(e.target.value)} className="field">{TIMINGS.map((t) => <option key={t}>{t}</option>)}</select></div>
          <button type="submit" className="btn btn-door">Start my quote</button>
        </div>
      </form>
      {saved && (
        <div className="card flex flex-col gap-3 bg-door-t p-5" role="status">
          <p className="label text-door">Project summary</p>
          <p className="text-lg"><b>{saved.type}</b>{saved.size ? ` · about ${saved.size} m²` : ""} · {saved.timing.toLowerCase()}</p>
          <p className="text-sm text-mute">Next: a site visit and a written quote within [QUOTE TURNAROUND]. Saved on this device.</p>
          <button type="button" onClick={() => openDrawer({ door: "build", need: needFor[saved.type], about: `${saved.type}${saved.size ? `, about ${saved.size} m²` : ""}, ${saved.timing.toLowerCase()}.` })} className="btn btn-door self-start">Request a site visit</button>
        </div>
      )}
    </div>
  );
}
