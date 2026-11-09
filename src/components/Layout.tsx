import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { DOORS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { Icon, Marque } from "./Svg";

const BASE = import.meta.env.BASE_URL;
export const NAV = [...DOORS.map((d) => ({ to: d.path, label: d.name, door: d.id })), { to: "/about", label: "About and contact", door: undefined }];

export function Logo({ paper = false, className = "" }: { paper?: boolean; className?: string }) {
  return <img src={`${BASE}img/logo/realco-horizontal-${paper ? "paper" : "doors"}.svg`} alt="Realco" className={className} width="362" height="87" />;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { openDrawer } = useEnquiry();
  const talk = () => { setOpen(false); openDrawer(); };
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      {SITE.preview && (
        <div className="bg-deep text-paper">
          <div className="wrap flex h-[34px] items-center justify-between gap-3 text-[13px]">
            <p className="truncate"><span className="sm:hidden">Sample homes and projects; nothing is sent</span><span className="hidden sm:inline">Managed homes, stays and projects are samples; enquiries stay on your device and are not sent</span></p>
            <span className="label shrink-0 rounded-pill border border-paper/70 px-2 py-0.5 text-[11px] leading-none">Preview</span>
          </div>
        </div>
      )}
      <div className="wrap flex min-h-14 items-center justify-between gap-3 sm:min-h-16">
        <button type="button" className="-ml-3 inline-flex h-12 w-12 items-center justify-center lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
        <Link to="/" className="mr-auto inline-flex min-h-11 shrink-0 items-center lg:mr-0" onClick={() => setOpen(false)}><Logo className="h-7 w-auto sm:h-8" /></Link>
        <nav aria-label="Main" className="hidden gap-7 text-[15px] font-medium lg:flex">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} className={({ isActive }) => `inline-flex min-h-11 items-center border-b-2 ${isActive ? "border-ink" : "border-transparent hover:border-line"}`}>{n.label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-2">
          <a href={`tel:${SITE.phone}`} className="hidden min-h-11 items-center gap-2 px-3 text-[15px] md:inline-flex"><Icon.Phone /> {SITE.phone}</a>
          <button type="button" onClick={() => openDrawer()} className="btn btn-ink min-h-11 px-3 text-xs sm:px-4">Talk to Realco</button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-line bg-paper lg:hidden">
          <div className="wrap flex flex-col py-2">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 border-b border-line text-lg">
                {n.door ? <Marque size={22} door={n.door} fill="#1c2534" /> : <span className="w-[22px]" aria-hidden="true" />}{n.label}
              </Link>
            ))}
            <a href={`tel:${SITE.phone}`} className="flex min-h-12 items-center gap-3 text-lg"><Icon.Phone /> {SITE.phone}</a>
            <button type="button" onClick={talk} className="btn btn-ink mb-2 mt-2">Talk to Realco</button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="on-ink mt-20 bg-deep text-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo paper className="h-8 w-auto self-start" />
          <p className="max-w-xs text-base text-fog">Property management for landlords, refurbishments and extensions, and short stays across {SITE.region}. One team, one number.</p>
          <p className="text-base text-fog">Areas: {SITE.areasServed}</p>
        </div>
        {DOORS.map((d) => (
          <div key={d.id}>
            <h2 className="label mb-3 text-fog">{d.name}</h2>
            <p className="mb-2 text-base text-fog">{d.strap}.</p>
            <Link to={d.path} className="inline-flex min-h-11 items-center text-base underline">Open {d.name}</Link>
          </div>
        ))}
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-paper/15 py-6 text-[13px] text-fog sm:flex-row sm:items-center sm:justify-between">
        <p>© {SITE.legalName}, a company in {SITE.group} · Company no. {SITE.companyNumber} · {SITE.address}</p>
        <p className="flex flex-wrap items-center gap-x-4"><a href={`tel:${SITE.phone}`} className="inline-flex min-h-11 items-center underline">{SITE.phone}</a><a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center underline">{SITE.email}</a><Link to="/about" className="inline-flex min-h-11 items-center underline">About and contact</Link></p>
      </div>
    </footer>
  );
}
