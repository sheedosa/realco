import { useEffect, useId, useState } from "react";
import { PROJECT_TYPES, SERVICE_LEVELS, SITE, type ProjectType, type ServiceLevelId } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { gbp, readLocal, useLocal } from "../lib/local";
import { plural } from "../lib/store";

/* ---------- Lettings: landlord calculator ---------- */
export type RentSaved = { rent: number; level: ServiceLevelId };
export const RENT_KEY = "realco-rent";
const levelName = (id: ServiceLevelId) => SERVICE_LEVELS.find((x) => x.id === id)!.name;

function RentInput({ id, value, onChange, describedBy }: { id: string; value: string; onChange: (v: string) => void; describedBy?: string }) {
  return (
    <div className="flex w-full max-w-[17rem]">
      <span className="inline-flex h-12 items-center rounded-l-[3px] border border-r-0 border-ink bg-stone px-3.5 text-ink" aria-hidden="true">£</span>
      <input id={id} inputMode="numeric" autoComplete="off" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder={String(EXAMPLE_RENT)} aria-describedby={describedBy} className="field rounded-l-none tabular-nums" />
    </div>
  );
}
const rentOk = (n: number) => n >= 300 && n <= 20000;
const EXAMPLE_RENT = 1800; // the rent shown as the field's hint; used for the worked example before anything is typed

/** Rent in, what the landlord keeps out, as large figures, for each management level. Each figure is the button that
    chooses that level. Sample fee percentages until confirmed. `onShown` tells the page what to put in its phone bar. */
export function LandlordCalculator({ onShown, quoteRef }: { onShown?: (keep: number | null, level: ServiceLevelId) => void; quoteRef?: React.Ref<HTMLButtonElement> }) {
  const [saved, setSaved] = useLocal<RentSaved | null>(RENT_KEY, null);
  const [rent, setRent] = useState(saved ? String(saved.rent) : "");
  const [level, setLevel] = useState<ServiceLevelId>(saved?.level ?? "managed");
  const { openDrawer } = useEnquiry();
  const n = Number(rent);
  const ok = rentOk(n);
  const type = (v: string) => { setRent(v); const x = Number(v); if (rentOk(x)) setSaved({ rent: x, level }); };
  const pick = (id: ServiceLevelId) => { setLevel(id); if (saved) setSaved({ ...saved, level: id }); };
  const shown = ok ? n : rent === "" ? saved?.rent ?? null : null;
  const pct = SERVICE_LEVELS.find((x) => x.id === level)!.pct;
  const keepNow = shown ? shown * (1 - pct / 100) : null;
  useEffect(() => { onShown?.(keepNow, level); }, [keepNow, level]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-1.5">
        <label htmlFor="lc-rent" className="flabel">Monthly rent on the home</label>
        <RentInput id="lc-rent" value={rent} onChange={type} describedBy="lc-help" />
        <p id="lc-help" className="help">{rent !== "" && !ok ? "Enter a monthly rent between £300 and £20,000." : shown ? `What you keep on ${gbp(shown)} a month, before VAT.` : "Enter the rent to see what you keep each month."}</p>
      </form>
      <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Management level">
        {SERVICE_LEVELS.map((s) => {
          const on = level === s.id;
          const keep = shown ? shown * (1 - s.pct / 100) : null;
          return (
            <button key={s.id} type="button" aria-pressed={on} onClick={() => pick(s.id)} className="level">
              <span className="t-sub">{s.name}</span>
              {keep !== null ? <span className="t-num mt-2">{gbp(keep)}</span> : <span className="mt-2 font-medium">{s.note}</span>}
              <span>{keep !== null ? `a month, or ${gbp(keep * 12)} a year, after a sample ${s.pct}% fee.` : `Sample ${s.pct}% fee.`}</span>
              <span className="small mt-1 font-semibold">{on ? "Chosen" : "Choose this level"}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" role="status">{keepNow !== null && shown ? `${levelName(level)}: you keep ${gbp(keepNow)} a month on ${gbp(shown)} rent.` : ""}</p>
      <div className="flex flex-col gap-2">
        <button ref={quoteRef} type="button" onClick={() => openDrawer({ door: "lettings", need: "A management quote", about: shown ? `Rent about ${gbp(shown)} pcm, interested in ${levelName(level)}.` : `Interested in ${levelName(level)}.` })} className="btn btn-key self-start">Ask for a management quote</button>
        <p className="small">Fees shown are samples until confirmed. Your figure is remembered on this device.</p>
      </div>
    </div>
  );
}

/** The Lettings board's tool on Home: rent in, one large figure out. */
export function RentQuick() {
  const saved = readLocal<RentSaved | null>(RENT_KEY, null);
  const [rent, setRent] = useState(saved ? String(saved.rent) : "");
  const n = Number(rent);
  const ok = rentOk(n);
  const managed = SERVICE_LEVELS.find((s) => s.id === "managed")!;
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flabel">Monthly rent on your home</label>
      <RentInput id={id} value={rent} onChange={(v) => { setRent(v); const x = Number(v); if (rentOk(x)) { try { localStorage.setItem(RENT_KEY, JSON.stringify({ rent: x, level: saved?.level ?? "managed" })); } catch { /* private mode */ } } }} />
      <p role="status" className="mt-2 flex min-h-[6.25rem] flex-col gap-1.5 lg:min-h-[7.25rem]">
        {ok ? <><span className="t-num">{gbp(n * (1 - managed.pct / 100))}</span><span>a month to you, fully managed (sample {managed.pct}% fee).</span></>
          : rent !== "" ? <span>Enter a monthly rent between £300 and £20,000.</span>
          : <><span className="t-num">{gbp(EXAMPLE_RENT * (1 - managed.pct / 100))}</span><span>An example: what you keep each month on {gbp(EXAMPLE_RENT)} rent, fully managed (sample {managed.pct}% fee). Type your own rent to change it.</span></>}
      </p>
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

export function DateField({ id, label, value, onChange, invalid, describedBy }: { id: string; label: string; value: string; onChange: (v: string) => void; invalid?: boolean; describedBy?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="flabel">{label}</label>
      <input id={id} type="text" inputMode="numeric" autoComplete="off" placeholder="dd/mm/yyyy" value={value} onChange={(e) => onChange(maskUk(e.target.value))} aria-invalid={invalid || undefined} aria-describedby={describedBy} className="field tabular-nums" />
    </div>
  );
}

/* ---------- Stays: book direct (dates + guests) ---------- */
export type StaySaved = { checkIn: string; checkOut: string; guests: number; stay?: string };
export const STAY_KEY = "realco-stay";
export const nightsBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
export const fmtDay = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

export function StayEnquiry({ stayTitle, minNights = 2, sleeps, compact = false, stacked = false, formRef }: { stayTitle?: string; minNights?: number; sleeps?: number; compact?: boolean; stacked?: boolean; formRef?: React.Ref<HTMLFormElement> }) {
  const [saved, setSaved] = useLocal<StaySaved | null>(STAY_KEY, null);
  const valid = saved && saved.checkIn >= todayIso() ? saved : null; // never show a saved stay that is already in the past
  const [checkIn, setIn] = useState(isoToUk(valid?.checkIn ?? ""));
  const [checkOut, setOut] = useState(isoToUk(valid?.checkOut ?? ""));
  const [guests, setGuests] = useState(valid?.guests ?? 2);
  const [msg, setMsg] = useState<{ text: string; field: "in" | "out" | "both" | "guests" } | null>(null);
  const { openDrawer } = useEnquiry();
  const uid = useId();
  const summary = valid && valid.checkIn && valid.checkOut ? valid : null;
  const sNights = summary ? nightsBetween(summary.checkIn, summary.checkOut) : 0;
  const maxGuests = sleeps ?? 6;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = ukToIso(checkIn), b = ukToIso(checkOut);
    if (!a || !b) { setMsg({ text: "Enter both dates as dd/mm/yyyy.", field: !a && !b ? "both" : !a ? "in" : "out" }); return; }
    if (a < todayIso()) { setMsg({ text: "Check-in is in the past. Choose today or a later date.", field: "in" }); return; }
    const nights = nightsBetween(a, b);
    if (nights < 1) { setMsg({ text: "Check-out needs to be after check-in.", field: "out" }); return; }
    if (nights < minNights) { setMsg({ text: `This stay has a ${minNights}-night minimum. Move check-out later.`, field: "out" }); return; }
    if (sleeps && guests > sleeps) { setMsg({ text: `This apartment sleeps ${sleeps}. Choose fewer guests.`, field: "guests" }); return; }
    setMsg(null); setSaved({ checkIn: a, checkOut: b, guests, stay: stayTitle });
  };
  const bad = (f: "in" | "out") => Boolean(msg && (msg.field === f || msg.field === "both"));

  return (
    <div className="flex flex-col gap-3">
      <form ref={formRef} onSubmit={submit} className={`grid items-end gap-3 ${stacked || compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-[1fr_1fr_7rem] xl:grid-cols-[1fr_1fr_7rem_auto]"}`} noValidate>
        <DateField id={`${uid}-in`} label="Check in" value={checkIn} onChange={setIn} invalid={bad("in")} describedBy={`${uid}-msg`} />
        <DateField id={`${uid}-out`} label="Check out" value={checkOut} onChange={setOut} invalid={bad("out")} describedBy={`${uid}-msg`} />
        <div className="flex flex-col gap-1.5"><label htmlFor={`${uid}-g`} className="flabel">Guests</label><select id={`${uid}-g`} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field">{Array.from({ length: maxGuests }, (_, i) => i + 1).map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
        <button type="submit" className={`btn btn-key ${stacked || compact ? "" : "col-span-2 sm:col-span-3 sm:justify-self-start xl:col-span-1"}`}>Check dates</button>
      </form>
      <p id={`${uid}-msg`} role={msg ? "alert" : "status"} className={msg ? "err" : summary ? "sr-only" : ""}>{msg?.text ?? (summary ? "Dates saved." : "Book direct with us: we confirm availability and the price by reply.")}</p>
      {summary && !msg && (
        <div className="panel flex flex-col gap-2 p-4 sm:p-5">
          <h3>{summary.stay ?? "Any apartment"}</h3>
          <p>{fmtDay(summary.checkIn)} to {fmtDay(summary.checkOut)}, {plural(sNights, "night")}, {plural(summary.guests, "guest")}.</p>
          <p className="help">£[PRICE] a night × {plural(sNights, "night")} = £[TOTAL], plus [CLEANING FEE]. Sample pricing; confirmed by reply.</p>
          <button type="button" onClick={() => openDrawer({ door: "stays", need: "Book direct: check dates and price", about: `${summary.stay ?? "Any apartment"}, ${fmtDay(summary.checkIn)} to ${fmtDay(summary.checkOut)} (${plural(sNights, "night")}), ${plural(summary.guests, "guest")}.` })} className="btn btn-key mt-1 self-start">Request to book direct</button>
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

export function BuildEnquiry({ startRef }: { startRef?: React.Ref<HTMLButtonElement> }) {
  const [saved, setSaved] = useLocal<BuildSaved | null>(BUILD_KEY, null);
  const [type, setType] = useState<ProjectType>(saved && PROJECT_TYPES.includes(saved.type) ? saved.type : "Extension");
  const [size, setSize] = useState(saved?.size ?? "");
  const [timing, setTiming] = useState(saved && TIMINGS.includes(saved.timing) ? saved.timing : TIMINGS[1]);
  const { openDrawer } = useEnquiry();
  const submit = (e: React.FormEvent) => { e.preventDefault(); setSaved({ type, size, timing }); };
  const shown = saved && PROJECT_TYPES.includes(saved.type) ? saved : null;

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <fieldset>
          <legend className="flabel mb-2">What's the job?</legend>
          <div className="grid grid-cols-2 gap-2">{PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className="chip chip-lg">{t}</button>)}</div>
        </fieldset>
        <div className="grid grid-cols-[7rem_minmax(0,1fr)] items-end gap-3">
          <div className="flex flex-col gap-1.5"><label htmlFor="bd-size" className="flabel">Size in m²</label><input id="bd-size" inputMode="numeric" autoComplete="off" value={size} onChange={(e) => setSize(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="25" className="field" /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="bd-when" className="flabel">Timing</label><select id="bd-when" value={timing} onChange={(e) => setTiming(e.target.value)} className="field">{TIMINGS.map((t) => <option key={t}>{t}</option>)}</select></div>
        </div>
        <button ref={startRef} type="submit" className="btn btn-key self-start">Start my quote</button>
      </form>
      {shown && (
        <div className="panel flex flex-col gap-2 p-4 sm:p-5" role="status">
          <h3>{shown.type}{shown.size ? `, about ${shown.size} m²` : ""}, {shown.timing.toLowerCase()}</h3>
          <p className="help">Next: a site visit and a written quote within [QUOTE TURNAROUND].</p>
          <button type="button" onClick={() => openDrawer({ door: "build", need: NEED_FOR[shown.type], about: `${shown.type}${shown.size ? `, about ${shown.size} m²` : ""}, ${shown.timing.toLowerCase()}.` })} className="btn btn-key mt-1 self-start">Request a site visit</button>
        </div>
      )}
    </div>
  );
}

/** The Build board's tool on Home: pick the job, go straight to the drawer. */
export function BuildQuick() {
  const { openDrawer } = useEnquiry();
  const [type, setType] = useState<ProjectType>("Extension");
  return (
    <div className="flex flex-col gap-3">
      <p className="flabel" id="bq-type">What's the job?</p>
      <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="bq-type">{PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className="chip">{t}</button>)}</div>
      <button type="button" onClick={() => openDrawer({ door: "build", need: NEED_FOR[type] })} className="btn btn-key">Ask for a site visit</button>
    </div>
  );
}

export const ALSO_ON = `Also listed on ${SITE.alsoListedOn.join(" and ")}.`;
