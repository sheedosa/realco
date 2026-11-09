import { useId, useState } from "react";
import { PROJECT_TYPES, SERVICE_LEVELS, SITE, type ProjectType, type ServiceLevelId } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { gbp, readLocal, useLocal } from "../lib/local";
import { plural } from "../lib/store";

/* ---------- Lettings: landlord calculator ---------- */
export type RentSaved = { rent: number; level: ServiceLevelId };
export const RENT_KEY = "realco-rent";
const levelName = (id: ServiceLevelId) => SERVICE_LEVELS.find((x) => x.id === id)!.name;

function RentInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex w-full max-w-[280px]">
      <span className="inline-flex h-12 items-center rounded-l-[3px] border border-r-0 border-ink bg-stone px-3 text-base" aria-hidden="true">£</span>
      <input id={id} inputMode="numeric" autoComplete="off" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="1800" className="field rounded-l-none" />
    </div>
  );
}

/** Rent in, what the landlord keeps out, for each management level. Sample fee percentages until confirmed. */
export function LandlordCalculator() {
  const [saved, setSaved] = useLocal<RentSaved | null>(RENT_KEY, null);
  const [rent, setRent] = useState(saved ? String(saved.rent) : "");
  const [level, setLevel] = useState<ServiceLevelId>(saved?.level ?? "managed");
  const { openDrawer } = useEnquiry();
  const n = Number(rent);
  const ok = n >= 300 && n <= 20000;
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (ok) setSaved({ rent: n, level }); };
  const pick = (id: ServiceLevelId) => { setLevel(id); if (saved) setSaved({ ...saved, level: id }); };
  const shown = ok ? n : saved?.rent ?? null;

  return (
    <div className="door-lettings flex flex-col gap-5">
      <form onSubmit={submit} className="flex flex-col gap-1.5">
        <label htmlFor="lc-rent" className="label">Monthly rent on the home</label>
        <div className="flex flex-wrap gap-2"><RentInput id="lc-rent" value={rent} onChange={setRent} /><button type="submit" className="btn btn-door">Save</button></div>
        <p id="lc-help" role="status" className="text-base text-mute">{shown ? `On ${gbp(shown)} a month, before VAT. Fees are samples until confirmed.` : "Enter the rent to see what you keep."}</p>
      </form>
      <div className="grid gap-px overflow-hidden rounded-pill border border-line bg-line sm:grid-cols-2">
        {SERVICE_LEVELS.map((s) => {
          const on = level === s.id;
          const keep = shown ? shown * (1 - s.pct / 100) : null;
          return (
            <div key={s.id} className={`flex flex-col gap-2 p-4 ${on ? "bg-door-t" : "bg-paper"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-base font-semibold">{s.name}</p><span className="label text-door">Sample {s.pct}% fee</span></div>
              {keep !== null ? <p className="display text-[34px] leading-none">{gbp(keep)}<span className="font-sans text-base font-normal text-mute"> a month</span></p> : <p className="text-base font-semibold">What you keep appears here</p>}
              <p className="text-base text-mute">{keep !== null ? `${gbp(keep * 12)} a year after the fee.` : s.note}</p>
              <button type="button" aria-pressed={on} onClick={() => pick(s.id)} className={`btn mt-1 min-h-11 self-start px-4 ${on ? "btn-ink" : "btn-ghost"}`}>{on ? "Chosen" : "Choose"}</button>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => openDrawer({ door: "lettings", need: "A management quote", about: shown ? `Rent about ${gbp(shown)} pcm, interested in ${levelName(level)}.` : `Interested in ${levelName(level)}.` })} className="btn btn-ink self-start">Ask for a management quote</button>
    </div>
  );
}

/** The home page's inline version: rent in, one figure out, then on to Lettings. */
export function RentQuick() {
  const saved = readLocal<RentSaved | null>(RENT_KEY, null);
  const [rent, setRent] = useState(saved ? String(saved.rent) : "");
  const n = Number(rent);
  const ok = n >= 300 && n <= 20000;
  const managed = SERVICE_LEVELS.find((s) => s.id === "managed")!;
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label">Monthly rent on your home</label>
      <RentInput id={id} value={rent} onChange={(v) => { setRent(v); const x = Number(v); if (x >= 300 && x <= 20000) { try { localStorage.setItem(RENT_KEY, JSON.stringify({ rent: x, level: saved?.level ?? "managed" })); } catch { /* private mode */ } } }} />
      <p role="status" className="min-h-[3rem] text-base text-mute">{ok ? <>Fully managed, you keep <b className="text-ink">{gbp(n * (1 - managed.pct / 100))}</b> a month (sample {managed.pct}% fee).</> : "Enter a rent to see what you keep, fully managed."}</p>
    </div>
  );
}

/* ---------- UK date field: dd/mm/yyyy, typed, no native picker ---------- */
export const todayIso = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10); };
const pad2 = (n: number) => String(n).padStart(2, "0");
export const isoToUk = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : "");
export function ukToIso(uk: string): string | null {
  const m = uk.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${pad2(mo)}-${pad2(d)}`;
}
const maskUk = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
};

export function DateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} type="text" inputMode="numeric" autoComplete="off" placeholder="dd/mm/yyyy" value={value} onChange={(e) => onChange(maskUk(e.target.value))} className="field tabular-nums" />
    </div>
  );
}

/* ---------- Stays: book direct (dates + guests) ---------- */
export type StaySaved = { checkIn: string; checkOut: string; guests: number; stay?: string };
export const STAY_KEY = "realco-stay";
export const nightsBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
export const fmtDay = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export function StayEnquiry({ stayTitle, minNights = 2, sleeps, compact = false, stacked = false }: { stayTitle?: string; minNights?: number; sleeps?: number; compact?: boolean; stacked?: boolean }) {
  const [saved, setSaved] = useLocal<StaySaved | null>(STAY_KEY, null);
  const valid = saved && saved.checkIn >= todayIso() ? saved : null; // never show a saved stay that is already in the past
  const [checkIn, setIn] = useState(isoToUk(valid?.checkIn ?? ""));
  const [checkOut, setOut] = useState(isoToUk(valid?.checkOut ?? ""));
  const [guests, setGuests] = useState(valid?.guests ?? 2);
  const [msg, setMsg] = useState<string | null>(null);
  const { openDrawer } = useEnquiry();
  const uid = useId();
  const summary = valid && valid.checkIn && valid.checkOut ? valid : null;
  const sNights = summary ? nightsBetween(summary.checkIn, summary.checkOut) : 0;
  const maxGuests = sleeps ?? 6;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = ukToIso(checkIn), b = ukToIso(checkOut);
    if (!a || !b) { setMsg("Enter both dates as dd/mm/yyyy."); return; }
    if (a < todayIso()) { setMsg("Check-in can't be in the past."); return; }
    const nights = nightsBetween(a, b);
    if (nights < 1) { setMsg("Check-out needs to be after check-in."); return; }
    if (nights < minNights) { setMsg(`This stay has a ${minNights}-night minimum.`); return; }
    if (sleeps && guests > sleeps) { setMsg(`This apartment sleeps ${sleeps}.`); return; }
    setMsg(null); setSaved({ checkIn: a, checkOut: b, guests, stay: stayTitle });
  };

  return (
    <div className="door-stays flex flex-col gap-4">
      <form onSubmit={submit} className={`grid items-end gap-3 ${stacked ? "grid-cols-2" : compact ? "grid-cols-2 lg:grid-cols-[1fr_1fr_8rem_auto]" : "grid-cols-2 sm:grid-cols-[1fr_1fr_8rem_auto]"}`} noValidate>
        <DateField id={`${uid}-in`} label="Check in" value={checkIn} onChange={setIn} />
        <DateField id={`${uid}-out`} label="Check out" value={checkOut} onChange={setOut} />
        <div className="flex flex-col gap-1.5"><label htmlFor={`${uid}-g`} className="label">Guests</label><select id={`${uid}-g`} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field">{Array.from({ length: maxGuests }, (_, i) => i + 1).map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
        <button type="submit" className="btn btn-door">Check dates</button>
      </form>
      <p role="status" className="min-h-6 text-base text-mute">{msg ?? (summary ? "" : "Book direct with us: we confirm availability and the price by reply.")}</p>
      {summary && !msg && (
        <div className="card flex flex-col gap-3 bg-door-t p-5">
          <p className="label text-door">Your stay</p>
          <p className="text-lg"><b>{summary.stay ?? "Any apartment"}</b> · {fmtDay(summary.checkIn)} to {fmtDay(summary.checkOut)} · {plural(sNights, "night")} · {plural(summary.guests, "guest")}</p>
          <p className="text-base text-mute">£[PRICE] a night × {plural(sNights, "night")} = £[TOTAL], plus [CLEANING FEE]. Sample pricing; confirmed by reply.</p>
          <button type="button" onClick={() => openDrawer({ door: "stays", need: "Book direct: check dates and price", about: `${summary.stay ?? "Any apartment"}, ${fmtDay(summary.checkIn)} to ${fmtDay(summary.checkOut)} (${plural(sNights, "night")}), ${plural(summary.guests, "guest")}.` })} className="btn btn-door self-start">Request to book direct</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Build: project enquiry ---------- */
export type BuildSaved = { type: ProjectType; size: string; timing: string };
export const BUILD_KEY = "realco-build";
const TIMINGS = ["As soon as possible", "Within 3 months", "In 3 to 6 months", "Just planning"];
export const NEED_FOR: Record<ProjectType, string> = { Refurbishment: "A quote for a refurbishment", Extension: "A quote for an extension" };

export function BuildEnquiry() {
  const [saved, setSaved] = useLocal<BuildSaved | null>(BUILD_KEY, null);
  const [type, setType] = useState<ProjectType>(saved && PROJECT_TYPES.includes(saved.type) ? saved.type : "Extension");
  const [size, setSize] = useState(saved?.size ?? "");
  const [timing, setTiming] = useState(saved && TIMINGS.includes(saved.timing) ? saved.timing : TIMINGS[1]);
  const { openDrawer } = useEnquiry();
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSaved({ type, size, timing }); };
  const shown = saved && PROJECT_TYPES.includes(saved.type) ? saved : null;

  return (
    <div className="door-build flex flex-col gap-4">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <fieldset>
          <legend className="label mb-2">Project type</legend>
          <div className="grid grid-cols-2 gap-2">{PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={`chip justify-center ${type === t ? "" : "border-line"}`}>{t}</button>)}</div>
        </fieldset>
        <div className="grid gap-3 sm:grid-cols-[8rem_minmax(13rem,1fr)] sm:items-end">
          <div className="flex flex-col gap-1.5"><label htmlFor="bd-size" className="label">Size (m²)</label><input id="bd-size" inputMode="numeric" value={size} onChange={(e) => setSize(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="25" className="field" /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="bd-when" className="label">Timing</label><select id="bd-when" value={timing} onChange={(e) => setTiming(e.target.value)} className="field">{TIMINGS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
        <button type="submit" className="btn btn-door self-start">Start my quote</button>
      </form>
      {shown && (
        <div className="card flex flex-col gap-3 bg-door-t p-5" role="status">
          <p className="label text-door">Project summary</p>
          <p className="text-lg"><b>{shown.type}</b>{shown.size ? ` · about ${shown.size} m²` : ""} · {shown.timing.toLowerCase()}</p>
          <p className="text-base text-mute">Next: a site visit and a written quote within [QUOTE TURNAROUND].</p>
          <button type="button" onClick={() => openDrawer({ door: "build", need: NEED_FOR[shown.type], about: `${shown.type}${shown.size ? `, about ${shown.size} m²` : ""}, ${shown.timing.toLowerCase()}.` })} className="btn btn-door self-start">Request a site visit</button>
        </div>
      )}
    </div>
  );
}

/** The home page's inline version: pick the job, go straight to the drawer. */
export function BuildQuick() {
  const { openDrawer } = useEnquiry();
  const [type, setType] = useState<ProjectType>("Extension");
  return (
    <div className="flex flex-col gap-3">
      <p className="label" id="bq-type">What's the job?</p>
      <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="bq-type">{PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={`chip justify-center ${type === t ? "" : "border-line"}`}>{t}</button>)}</div>
      <button type="button" onClick={() => openDrawer({ door: "build", need: NEED_FOR[type] })} className="btn btn-door">Ask for a site visit</button>
    </div>
  );
}

export const ALSO_ON = `Also listed on ${SITE.alsoListedOn.join(" and ")}.`;
