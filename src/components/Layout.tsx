import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { DOORS, SITE, type DoorId } from "../data/site";
import { CONTACT, CONTACT_TO_COME, hasContact, known } from "../lib/contact";
import { useEnquiry } from "../lib/enquiry";
import { Icon } from "./Svg";
import { VLink } from "./VLink";

const BASE = import.meta.env.BASE_URL;
export const NAV = [...DOORS.map((d) => ({ to: d.path, label: d.name, line: d.strap, door: d.id as DoorId | undefined })), { to: "/about", label: "About and contact", line: "The company, the areas and how to reach us", door: undefined }];

export function Logo({ paper = false, className = "" }: { paper?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/realco-horizontal-${paper ? "paper" : "ink"}.svg`} alt="Realco" className={className} width="343" height="83" />;
}

/** One strip and one header. The header is Ink; inside a door it takes the door's colour, so the board that was on
    the street becomes the whole top of the page. */
export function Header() {
  const [open, setOpen] = useState(false);
  const { openDrawer } = useEnquiry();
  const { pathname } = useLocation();
  const door = DOORS.find((d) => pathname === d.path || pathname.startsWith(`${d.path}/`))?.id;
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      const bar = document.querySelector<HTMLElement>("header");
      if (e.key === "Escape") { setOpen(false); bar?.querySelector<HTMLElement>("button[aria-controls]")?.focus(); return; }
      if (e.key !== "Tab" || !bar) return;
      // Keep Tab inside the header and its open panel.
      const stops = [...bar.querySelectorAll<HTMLElement>("a[href], button")].filter((el) => el.offsetParent !== null);
      const first = stops[0], last = stops[stops.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || !bar.contains(at))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (at === last || !bar.contains(at))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [open]);
  const talk = () => { setOpen(false); openDrawer(door ? { door } : {}); };
  return (
    <header style={{ viewTransitionName: "site-header" }} className={`on-ink sticky top-0 z-40 text-paper ${door ? `door-${door} bg-door` : "bg-ink"}`}>
      {SITE.preview && (
        <div className="bg-deep">
          <div className="wrap flex h-[34px] items-center justify-between gap-3 text-[13px]">
            <p className="truncate"><span className="sm:hidden">Sample homes and projects; nothing is sent</span><span className="hidden sm:inline">Managed homes, stays and projects are samples; enquiries stay on your device and are not sent</span></p>
            <span className="label shrink-0 rounded-pill border border-paper/70 px-2 py-0.5 text-[11px] leading-none">Preview</span>
          </div>
        </div>
      )}
      <div className="wrap flex min-h-14 items-center justify-between gap-2 sm:min-h-16 sm:gap-4">
        <Link to="/" className="mr-auto inline-flex min-h-11 shrink-0 items-center lg:mr-0"><Logo paper className="h-7 w-auto sm:h-8" /></Link>
        <nav aria-label="Main" className="hidden gap-8 lg:flex">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 font-medium ${isActive ? "border-paper" : "border-transparent hover:border-paper/50"}`}>{n.label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          {CONTACT.phone && <a href={`tel:${CONTACT.phone}`} className="hidden min-h-11 items-center gap-2 px-3 font-medium md:inline-flex"><Icon.Phone /> {CONTACT.phone}</a>}
          <button type="button" onClick={talk} className="btn btn-paper min-h-11 px-3.5 text-base sm:px-4 sm:text-[1.0625rem]">Talk to Realco</button>
          <button type="button" className="-mr-2 inline-flex h-12 w-12 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="absolute inset-x-0 top-full max-h-[calc(100dvh-90px)] overflow-y-auto border-t border-paper/25 bg-ink lg:hidden">
          <div className="wrap flex flex-col pb-6 pt-2">
            <ul>
              {NAV.map((n) => (
                <li key={n.to} className="border-b border-paper/20">
                  <NavLink to={n.to} onClick={() => setOpen(false)} className="flex min-h-16 flex-col justify-center py-2.5">
                    <span className="flex items-center gap-3"><span className={`h-4 w-4 shrink-0 rounded-[2px] ${n.door ? `door-${n.door} bg-door ring-1 ring-paper/60` : "bg-paper"}`} aria-hidden="true" /><span className="display text-[1.75rem] leading-none">{n.label}</span></span>
                    <span className="pl-7 text-fog">{n.line}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
            {hasContact || CONTACT.address || CONTACT.hours ? (
              <dl className="grid grid-cols-[auto_1fr] items-center gap-x-5 pt-3">
                {CONTACT.phone && <><dt className="text-fog">Phone</dt><dd><a href={`tel:${CONTACT.phone}`} className="link">{CONTACT.phone}</a></dd></>}
                {CONTACT.email && <><dt className="text-fog">Email</dt><dd><a href={`mailto:${CONTACT.email}`} className="link">{CONTACT.email}</a></dd></>}
                {CONTACT.address && <><dt className="py-2.5 text-fog">Office</dt><dd className="py-2.5">{CONTACT.address}</dd></>}
                {CONTACT.hours && <><dt className="py-2.5 text-fog">Hours</dt><dd className="py-2.5">{CONTACT.hours}</dd></>}
              </dl>
            ) : <p className="pt-4 text-fog">{CONTACT_TO_COME}</p>}
            <button type="button" onClick={talk} className="btn btn-paper mt-4">Talk to Realco</button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { openDrawer } = useEnquiry();
  return (
    <footer className="on-ink bg-deep text-paper">
      <div className="wrap grid gap-x-10 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.55fr_1fr_.9fr]">
        <div className="flex flex-col gap-4">
          <Logo paper className="h-9 w-auto self-start" />
          <p className="max-w-[22rem] text-fog">Property management for landlords, refurbishments and extensions, and short stays across {SITE.region}.</p>
        </div>
        <div>
          <h2 className="label mb-2 text-fog">The three doors</h2>
          <ul>
            {DOORS.map((d) => <li key={d.id} className="border-b border-paper/15"><VLink to={d.path} className="grid min-h-12 grid-cols-[5.25rem_minmax(0,1fr)] items-baseline gap-x-3 py-2.5"><span className="t-sub underline decoration-1 underline-offset-4">{d.name}</span><span className="text-fog">{d.strap}</span></VLink></li>)}
          </ul>
        </div>
        <div>
          <h2 className="label mb-2 text-fog">Company</h2>
          <ul>
            <li><Link to="/about" className="link">About and contact</Link></li>
            <li className="py-2.5 text-fog">{SITE.legalName}, a company in {SITE.group}</li>
            {known(SITE.areasServed) && <li className="py-2.5 text-fog">Areas: {SITE.areasServed}</li>}
          </ul>
        </div>
        <div>
          <h2 className="label mb-2 text-fog">Contact</h2>
          <ul>
            {CONTACT.phone && <li><a href={`tel:${CONTACT.phone}`} className="link">{CONTACT.phone}</a></li>}
            {CONTACT.email && <li><a href={`mailto:${CONTACT.email}`} className="link">{CONTACT.email}</a></li>}
            {CONTACT.hours && <li className="py-2.5 text-fog">{CONTACT.hours}</li>}
            {CONTACT.address && <li className="py-2.5 text-fog">{CONTACT.address}</li>}
            {!(hasContact && CONTACT.hours && CONTACT.address) && <li className="py-2.5 text-fog">{hasContact ? "Remaining contact details to come." : CONTACT_TO_COME}</li>}
            <li><button type="button" onClick={() => openDrawer()} className="link">Talk to Realco</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <p className="wrap small py-6 text-fog">© {SITE.legalName}.{known(SITE.companyNumber) ? ` Company no. ${SITE.companyNumber}.` : ""} Concept preview: managed homes, stays and projects are samples, and enquiries are not sent.</p>
      </div>
    </footer>
  );
}
