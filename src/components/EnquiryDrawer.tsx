import { useEffect, useRef, useState } from "react";
import { DOORS, SITE, doorById, type DoorId } from "../data/site";
import { useEnquiry, type Enquiry } from "../lib/enquiry";
import { readLocal, writeLocal } from "../lib/local";
import { Icon, Marque } from "./Svg";

// "Three doors, one team, one number." The one enquiry flow for the whole site: which door, what you need, when
// suits you. Pages prefill it (a rent, a stay with dates, a build project). Preview: saved on the device, not sent.
// On phones it is a full-height sheet; the action row is pinned to the bottom so the next step is always in reach.
const NEEDS: Record<DoorId, string[]> = {
  lettings: ["A management quote", "Switching from another agent", "A question about a home we manage", "Something else"],
  build: ["A quote for a refurbishment", "A quote for an extension", "Repairs for a let home", "Something else"],
  stays: ["Book direct: check dates and price", "A month or longer", "A corporate or relocation stay", "Something else"],
};
const DRAFT = "realco-enquiry-draft";
type Draft = { door: DoorId | null; role: string; need: string; about: string; name: string; phone: string; email: string; days: string; when: string };
const empty: Draft = { door: null, role: "", need: "", about: "", name: "", phone: "", email: "", days: "Any day", when: "Any time" };
const STEPS = ["Which door", "What you need", "When suits you"];
type Errors = Partial<Record<"need" | "name" | "phone" | "email", string>>;

function check(d: Draft, needs: string[]): Errors {
  const e: Errors = {};
  const phone = d.phone.replace(/\D/g, ""), email = d.email.trim();
  if (!d.need || !needs.includes(d.need)) e.need = "Choose what you need from the list.";
  if (!d.name.trim()) e.name = "Enter your name.";
  if (!phone && !email) e.phone = "Enter a phone number or an email address so we can reply.";
  else {
    if (d.phone.trim() && (phone.length < 10 || phone.length > 13)) e.phone = "Enter the full phone number, including the area code.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "Enter the email address in full, like name@example.com.";
  }
  return e;
}

const Opt = ({ on, onClick, children, className = "" }: { on: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
  <button type="button" aria-pressed={on} onClick={onClick} className={`opt ${className}`}>{children}</button>
);

export function EnquiryDrawer() {
  const { open, prefill, closeDrawer, setLast } = useEnquiry();
  const [d, setD] = useState<Draft>(() => ({ ...empty, ...readLocal<Partial<Draft>>(DRAFT, {}) }));
  const [step, setStep] = useState(1);
  const [errs, setErrs] = useState<Errors>({});
  const [done, setDone] = useState<Enquiry | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const pre = useRef(prefill); pre.current = prefill;
  useEffect(() => {
    if (!open) return;
    const prefill = pre.current; // read once per opening so later provider renders do not reset the flow
    const opener = document.activeElement as HTMLElement | null;
    setDone(null); setErrs({});
    setD((x) => ({ ...x, ...(prefill.door ? { door: prefill.door } : {}), ...(prefill.role ? { role: prefill.role } : {}), ...(prefill.about ? { about: prefill.about } : {}), ...(prefill.need ? { need: prefill.need } : {}) }));
    setStep(prefill.door ? 2 : 1);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeDrawer(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].filter((x) => !x.hasAttribute("disabled") && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = ""; opener?.focus?.(); };
  }, [open, closeDrawer]);

  // Each step (and the thank-you) starts at its heading, at the top of the sheet.
  useEffect(() => { if (open) { body.current?.scrollTo(0, 0); heading.current?.focus(); } }, [open, step, done]);

  const up = (p: Partial<Draft>) => setD((x) => { const n = { ...x, ...p }; writeLocal(DRAFT, n); return n; });
  if (!open) return null;

  const needs = d.door ? NEEDS[d.door] : [];
  const toStep3 = () => {
    const e = check(d, needs); setErrs(e);
    if (Object.keys(e).length) { requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>(e.need ? ".opt" : "[aria-invalid='true']")?.focus()); return; }
    setStep(3);
  };
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 2) { toStep3(); return; }
    if (!d.door || step !== 3 || Object.keys(check(d, needs)).length) return;
    const contact = [d.phone.trim(), d.email.trim()].filter(Boolean).join(", ");
    const enq: Enquiry = { door: d.door, role: d.role, need: d.need, about: d.about, name: d.name.trim(), contact, when: d.when, days: d.days, sentAt: new Date().toISOString() };
    setLast(enq); setDone(enq);
    const n = { ...empty, name: d.name, phone: d.phone, email: d.email }; setD(n); writeLocal(DRAFT, n);
  };
  const clear = (k: keyof Errors) => setErrs((x) => { if (!x[k]) return x; const n = { ...x }; delete n[k]; return n; });

  return (
    <aside aria-label="Enquiry" className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={closeDrawer} className="scrim absolute inset-0 bg-deep/70" />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="enq-title" className={`sheet relative flex h-dvh w-full max-w-[520px] flex-col bg-paper ${d.door ? `door-${d.door}` : ""}`}>
        <div className="on-ink flex shrink-0 items-center justify-between gap-3 bg-ink py-2 pl-4 pr-2 text-paper sm:pl-7 sm:pr-4" style={{ borderBottom: "4px solid var(--door, var(--color-ink))" }}>
          <div className="flex items-center gap-3"><Marque size={28} fill="#f5f0e6" /><h2 id="enq-title" className="t-sub">Talk to Realco</h2></div>
          <button type="button" onClick={closeDrawer} aria-label="Close enquiry" className="inline-flex h-12 w-12 items-center justify-center rounded-pill"><Icon.Close /></button>
        </div>

        {done ? (
          <>
            <div ref={body} className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-7 sm:px-7">
              <h3 ref={heading} tabIndex={-1} className="t-section outline-none">Thanks, {done.name.split(" ")[0]}. One team will pick this up.</h3>
              <dl className="grid grid-cols-[auto_1fr] gap-x-5 border-t-2 border-ink">
                {([["Door", doorById(done.door).name], ["Need", done.need], ...(done.about ? [["About", done.about]] : []), ["Contact", done.contact], ["When", `${done.days}, ${done.when.toLowerCase()}`]] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="col-span-2 grid grid-cols-subgrid border-b border-line py-2.5"><dt className="help">{k}</dt><dd className="break-words">{v}</dd></div>
                ))}
              </dl>
              <p role="status" className="help">Concept preview: nothing has been sent. At launch this goes to one shared inbox, with a reply target of [RESPONSE TIME]. Your summary is saved on this device.</p>
            </div>
            <div className="shrink-0 border-t border-line px-4 py-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] sm:px-7"><button type="button" onClick={closeDrawer} className="btn btn-ink w-full sm:w-auto">Done</button></div>
          </>
        ) : (
          <form onSubmit={send} noValidate className="flex min-h-0 flex-1 flex-col">
            <div ref={body} className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-5 sm:px-7">
              <ol className="small flex gap-2" aria-label="Steps">
                {STEPS.map((s, i) => <li key={s} aria-current={step === i + 1 ? "step" : undefined} className={`flex-1 border-t-[3px] pt-2 ${step > i ? "border-ink font-semibold" : "border-line text-mute"}`}>{i + 1}. {s}</li>)}
              </ol>

              {step === 1 && (
                <fieldset className="flex flex-col gap-3">
                  <legend className="contents"><h3 ref={heading} tabIndex={-1} className="t-section mb-1 outline-none">Which door?</h3></legend>
                  {DOORS.map((x) => (
                    <button key={x.id} type="button" aria-pressed={d.door === x.id} onClick={() => { up(d.door === x.id ? {} : { door: x.id, need: "", role: "" }); setErrs({}); setStep(2); }} className={`door-opt door-${x.id}`}>
                      <span className="display text-[2.5rem] leading-[.9]">{x.name}</span>
                      <span>{x.strap}</span>
                    </button>
                  ))}
                </fieldset>
              )}

              {step === 2 && d.door && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <h3 ref={heading} tabIndex={-1} className="t-section outline-none">What do you need?</h3>
                    <p className="help">{doorById(d.door).name}, {doorById(d.door).who.toLowerCase()}. <button type="button" onClick={() => setStep(1)} className="link">Change door</button></p>
                  </div>
                  <fieldset className="flex flex-col gap-2" aria-describedby={errs.need ? "err-need" : undefined}>
                    <legend className="sr-only">What you need</legend>
                    {needs.map((n) => <Opt key={n} on={d.need === n} onClick={() => { up({ need: n }); clear("need"); }}>{n}</Opt>)}
                    {errs.need && <p id="err-need" role="alert" className="err">{errs.need}</p>}
                  </fieldset>
                  <div className="flex flex-col gap-1.5"><label htmlFor="enq-about" className="flabel">Anything to add <span className="font-normal text-mute">(optional)</span></label><textarea id="enq-about" value={d.about} onChange={(e) => up({ about: e.target.value })} rows={3} className="field" aria-describedby="enq-about-h" /><p id="enq-about-h" className="small help">A property, dates, an address or a rough budget.</p></div>
                  <div className="flex flex-col gap-1.5"><label htmlFor="enq-name" className="flabel">Your name</label><input id="enq-name" value={d.name} onChange={(e) => { up({ name: e.target.value }); clear("name"); }} autoComplete="name" autoCapitalize="words" aria-invalid={errs.name ? true : undefined} aria-describedby={errs.name ? "err-name" : undefined} className="field" />{errs.name && <p id="err-name" role="alert" className="err">{errs.name}</p>}</div>
                  <fieldset className="flex flex-col gap-3">
                    <legend className="flabel mb-1">How we reach you <span className="font-normal text-mute">(phone, email or both)</span></legend>
                    <div className="flex flex-col gap-1.5"><label htmlFor="enq-phone" className="flabel">Phone</label><input id="enq-phone" type="tel" inputMode="tel" autoComplete="tel" value={d.phone} onChange={(e) => { up({ phone: e.target.value.replace(/[^\d+ ()-]/g, "").slice(0, 20) }); clear("phone"); }} aria-invalid={errs.phone ? true : undefined} aria-describedby={errs.phone ? "err-phone" : undefined} className="field" />{errs.phone && <p id="err-phone" role="alert" className="err">{errs.phone}</p>}</div>
                    <div className="flex flex-col gap-1.5"><label htmlFor="enq-email" className="flabel">Email</label><input id="enq-email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={d.email} onChange={(e) => { up({ email: e.target.value }); clear("email"); clear("phone"); }} aria-invalid={errs.email ? true : undefined} aria-describedby={errs.email ? "err-email" : undefined} className="field" />{errs.email && <p id="err-email" role="alert" className="err">{errs.email}</p>}</div>
                  </fieldset>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1"><h3 ref={heading} tabIndex={-1} className="t-section outline-none">When suits you?</h3><p className="help">We call or message back; tell us when that works.</p></div>
                  <fieldset><legend className="flabel mb-2">Days</legend><div className="grid grid-cols-3 gap-2">{["Weekdays", "Weekend", "Any day"].map((x) => <Opt key={x} on={d.days === x} onClick={() => up({ days: x })} className="justify-center px-2 text-center">{x}</Opt>)}</div></fieldset>
                  <fieldset><legend className="flabel mb-2">Time</legend><div className="grid grid-cols-2 gap-2">{["Morning", "Afternoon", "Evening", "Any time"].map((x) => <Opt key={x} on={d.when === x} onClick={() => up({ when: x })} className="justify-center">{x}</Opt>)}</div></fieldset>
                  <p className="help">{d.need}, for {d.name.trim()}. We reply to {[d.phone.trim(), d.email.trim()].filter(Boolean).join(" or ")}.</p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-line bg-paper px-4 py-3 pb-[calc(.75rem+env(safe-area-inset-bottom))] sm:px-7">
              {step === 1 && <p className="help">Or call <a href={`tel:${SITE.phone}`} className="link">{SITE.phone}</a>: one number for all three.</p>}
              {step === 2 && <><button type="button" onClick={() => setStep(1)} className="btn btn-line">Back</button><button type="submit" className="btn btn-ink flex-1 sm:flex-none">Next: when suits you</button></>}
              {step === 3 && <><button type="button" onClick={() => setStep(2)} className="btn btn-line">Back</button><button type="submit" className="btn btn-key flex-1 sm:flex-none">Send to Realco</button></>}
            </div>
          </form>
        )}
      </div>
    </aside>
  );
}
