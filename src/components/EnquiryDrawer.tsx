import { useEffect, useRef, useState } from "react";
import { DOORS, SITE, doorById, type DoorId } from "../data/site";
import { useEnquiry, type Enquiry } from "../lib/enquiry";
import { readLocal, writeLocal } from "../lib/local";
import { Icon, Marque } from "./Svg";

// "Three doors, one team, one number." The one enquiry flow for the whole site: which door, what you need, when
// suits you. Pages prefill it (a property, a stay with dates, a build project). Preview: saved on the device, not sent.
const NEEDS: Record<string, string[]> = {
  "lettings:landlord": ["A rental valuation", "Fully managed service", "Let only or rent collection", "Switching from another agent", "Something else"],
  "lettings:tenant": ["Book a viewing", "Register for new listings", "Ask about a property", "Something else"],
  stays: ["Check availability and price", "A monthly or longer stay", "A corporate or relocation stay", "Something else"],
  build: ["A quote for a refurbishment", "A quote for an extension", "A quote for a loft conversion", "A new build", "Something else"],
};
const DRAFT = "realco-enquiry-draft";
type Draft = { door: DoorId | null; role: string; need: string; about: string; name: string; contact: string; days: string; when: string };
const empty: Draft = { door: null, role: "", need: "", about: "", name: "", contact: "", days: "Any day", when: "Any time" };

const Opt = ({ on, onClick, children, className = "" }: { on: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
  <button type="button" aria-pressed={on} onClick={onClick} className={`flex min-h-12 items-center gap-3 rounded-pill border px-4 text-left text-base ${on ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink"} ${className}`}>{children}</button>
);

export function EnquiryDrawer() {
  const { open, prefill, closeDrawer, setLast } = useEnquiry();
  const [d, setD] = useState<Draft>(() => readLocal(DRAFT, empty));
  const [step, setStep] = useState(1);
  const [done, setDone] = useState<Enquiry | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLButtonElement>(null);

  const pre = useRef(prefill); pre.current = prefill;
  useEffect(() => {
    if (!open) return;
    const prefill = pre.current; // read once per opening so later provider renders do not reset the flow
    setDone(null);
    setD((x) => ({ ...x, ...(prefill.door ? { door: prefill.door } : {}), ...(prefill.role ? { role: prefill.role } : {}), ...(prefill.about ? { about: prefill.about } : {}), ...(prefill.need ? { need: prefill.need } : {}) }));
    setStep(prefill.door ? 2 : 1);
    const t = setTimeout(() => first.current?.focus(), 30);
    const key = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [open, closeDrawer]);

  const up = (p: Partial<Draft>) => setD((x) => { const n = { ...x, ...p }; writeLocal(DRAFT, n); return n; });
  if (!open) return null;

  const needKey = d.door === "lettings" ? `lettings:${d.role === "I'm looking to rent" ? "tenant" : "landlord"}` : d.door ?? "";
  const needs = NEEDS[needKey] ?? [];
  const canNext2 = Boolean(d.door) && (d.door !== "lettings" || Boolean(d.role));
  const canSend = Boolean(d.need && d.name.trim() && d.contact.trim());
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.door || !canSend) return;
    const enq: Enquiry = { door: d.door, role: d.role, need: d.need, about: d.about, name: d.name, contact: d.contact, when: d.when, days: d.days, sentAt: new Date().toISOString() };
    setLast(enq); setDone(enq);
    const n = { ...empty, name: d.name, contact: d.contact }; setD(n); writeLocal(DRAFT, n);
  };

  return (
    <aside aria-label="Enquiry drawer" className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" onClick={closeDrawer} className="absolute inset-0 bg-deep/60" />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="enq-title" className={`relative flex h-full w-full max-w-[520px] flex-col overflow-y-auto bg-paper shadow-2xl ${d.door ? `door-${d.door}` : ""}`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3"><Marque size={28} door={d.door ?? undefined} /><h2 id="enq-title" className="font-sans text-base font-semibold tracking-normal">Talk to Realco</h2></div>
          <button ref={first} type="button" onClick={closeDrawer} aria-label="Close enquiry drawer" className="inline-flex h-11 w-11 items-center justify-center rounded-pill hover:bg-stone"><Icon.Close /></button>
        </div>

        {done ? (
          <div className="flex flex-col gap-5 px-5 py-8 sm:px-7">
            <p className="label text-door">Enquiry ready</p>
            <h3 className="display text-[30px]">Thanks, {done.name.split(" ")[0]}. One team will pick this up.</h3>
            <dl className="card grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 p-5 text-sm">
              <dt className="text-mute">Door</dt><dd>{doorById(done.door).name}{done.role ? ` · ${done.role}` : ""}</dd>
              <dt className="text-mute">Need</dt><dd>{done.need}</dd>
              {done.about && <><dt className="text-mute">About</dt><dd>{done.about}</dd></>}
              <dt className="text-mute">Contact</dt><dd>{done.contact}</dd>
              <dt className="text-mute">When</dt><dd>{done.days}, {done.when.toLowerCase()}</dd>
            </dl>
            <p role="status" className="text-sm text-mute">Concept preview: nothing has been sent. At launch this goes to one shared inbox, with a reply target of [RESPONSE TIME]. Your summary is saved on this device.</p>
            <button type="button" onClick={closeDrawer} className="btn btn-ink self-start">Done</button>
          </div>
        ) : (
          <form onSubmit={send} className="flex flex-1 flex-col gap-6 px-5 py-6 sm:px-7">
            <ol className="flex gap-2 text-xs" aria-label="Steps">
              {["Which door", "What you need", "When suits you"].map((s, i) => <li key={s} aria-current={step === i + 1 ? "step" : undefined} className={`flex-1 border-t-2 pt-2 ${step > i ? "border-ink" : "border-line text-mute"}`}>{i + 1}. {s}</li>)}
            </ol>

            {step === 1 && (
              <fieldset className="flex flex-col gap-3">
                <legend className="display mb-3 text-[26px]">Which door?</legend>
                {DOORS.map((x) => <Opt key={x.id} on={d.door === x.id} onClick={() => up({ door: x.id, need: "", role: x.id === "lettings" ? d.role : "" })}><Marque size={24} door={x.id} fill={d.door === x.id ? "#f5f0e6" : "#1c2534"} /><span><span className="block font-semibold">{x.name}</span><span className={`block text-sm ${d.door === x.id ? "text-fog" : "text-mute"}`}>{x.strap}</span></span></Opt>)}
                {d.door === "lettings" && (
                  <div className="mt-2 grid grid-cols-2 gap-2">{["I'm a landlord", "I'm looking to rent"].map((r) => <Opt key={r} on={d.role === r} onClick={() => up({ role: r, need: "" })} className="justify-center text-sm">{r}</Opt>)}</div>
                )}
                <button type="button" disabled={!canNext2} onClick={() => setStep(2)} className="btn btn-ink mt-2 self-start disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </fieldset>
            )}

            {step === 2 && d.door && (
              <div className="flex flex-col gap-4">
                <h3 className="display text-[26px]">What do you need?</h3>
                <p className="text-sm text-mute">{doorById(d.door).name}{d.role ? ` · ${d.role}` : ""} · <button type="button" onClick={() => setStep(1)} className="underline">change</button></p>
                <div className="flex flex-col gap-2">{needs.map((n) => <Opt key={n} on={d.need === n} onClick={() => up({ need: n })}>{n}</Opt>)}</div>
                <div className="flex flex-col gap-1.5"><label htmlFor="enq-about" className="label">Anything to add <span className="normal-case tracking-normal text-mute">(optional)</span></label><textarea id="enq-about" value={d.about} onChange={(e) => up({ about: e.target.value })} rows={3} className="field h-auto py-2.5" placeholder="A property, dates, an address, a rough budget" /></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5"><label htmlFor="enq-name" className="label">Your name</label><input id="enq-name" value={d.name} onChange={(e) => up({ name: e.target.value })} autoComplete="name" className="field" /></div>
                  <div className="flex flex-col gap-1.5"><label htmlFor="enq-contact" className="label">Phone or email</label><input id="enq-contact" value={d.contact} onChange={(e) => up({ contact: e.target.value })} autoComplete="tel" className="field" /></div>
                </div>
                <div className="flex gap-2"><button type="button" onClick={() => setStep(1)} className="btn btn-ghost">Back</button><button type="button" disabled={!canSend} onClick={() => setStep(3)} className="btn btn-ink disabled:cursor-not-allowed disabled:opacity-50">Next</button></div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="display text-[26px]">When suits you?</h3>
                <p className="text-sm text-mute">We call or message back; tell us when that works.</p>
                <fieldset><legend className="label mb-2">Days</legend><div className="grid grid-cols-3 gap-2">{["Weekdays", "Weekend", "Any day"].map((x) => <Opt key={x} on={d.days === x} onClick={() => up({ days: x })} className="justify-center text-sm">{x}</Opt>)}</div></fieldset>
                <fieldset><legend className="label mb-2">Time</legend><div className="grid grid-cols-2 gap-2">{["Morning", "Afternoon", "Evening", "Any time"].map((x) => <Opt key={x} on={d.when === x} onClick={() => up({ when: x })} className="justify-center text-sm">{x}</Opt>)}</div></fieldset>
                <div className="flex gap-2"><button type="button" onClick={() => setStep(2)} className="btn btn-ghost">Back</button><button type="submit" className="btn btn-door">Send to Realco</button></div>
                <p className="text-sm text-mute">Or call {SITE.phone}. One number for lettings, stays and build.</p>
              </div>
            )}
          </form>
        )}
      </div>
    </aside>
  );
}

/** Fixed "Talk to Realco" button, present on every page. */
export function TalkButton() {
  const { openDrawer, open } = useEnquiry();
  if (open) return null;
  return (
    <aside aria-label="Enquiries" className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      <button type="button" onClick={() => openDrawer()} className="btn btn-ink min-h-14 shadow-lg"><Icon.Chat /> Talk to Realco</button>
    </aside>
  );
}
