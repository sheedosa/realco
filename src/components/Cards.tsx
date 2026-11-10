import { useEffect, useRef, useState } from "react";
import { SERVICE_LEVELS } from "../data/site";
import { plural, type ManagedHome, type Project, type Stay } from "../lib/store";
import { FloorPlan, Icon, Slot } from "./Svg";
import { VLink, vt } from "./VLink";

const bedsLabel = (n: number) => (n === 0 ? "Studio" : plural(n, "bedroom"));
const levelName = (id: string) => SERVICE_LEVELS.find((s) => s.id === id)?.name ?? "";
const lower = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);

export function Facts({ items }: { items: [React.ReactNode, string][] }) {
  return <ul className="help flex flex-wrap gap-x-5 gap-y-1">{items.map(([ic, t]) => <li key={t} className="flex items-center gap-1.5">{ic} {t}</li>)}</ul>;
}

/** Homes Realco manages, as a ledger: evidence of the work, never listings. No links, no prices.
    `expandable` adds a Plan button that opens the floor plan and a line about the home under its row. */
export function Ledger({ homes, expandable = false }: { homes: ManagedHome[]; expandable?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div role="table" aria-label="Sample homes we manage" className={`ledger door-lettings ${expandable ? "ledger-x" : ""}`}>
      <div role="row" className="ledger-head label">
        <span role="columnheader">Home</span><span role="columnheader">Area</span><span role="columnheader">Service</span><span role="columnheader">Managed since</span>
        {expandable && <span role="columnheader"><span className="sr-only">Floor plan</span></span>}
      </div>
      {homes.map((p) => {
        const on = open === p.handle;
        return (
          <div key={p.handle} role="rowgroup">
            <div role="row" className="ledger-row">
              <span role="cell" className="c-home">{p.title}</span>
              <span role="cell" className="c-area">{p.area} {p.postcode}</span>
              <span role="cell" className="c-level">{levelName(p.level)}</span>
              <span role="cell" className="c-since help"><span className="md:hidden">Managed since </span>[MANAGED SINCE]</span>
              {expandable && <span role="cell" className="c-act"><button type="button" aria-expanded={on} aria-controls={`plan-${p.handle}`} onClick={() => setOpen(on ? null : p.handle)} className="link">{on ? "Close" : "Plan"}</button></span>}
            </div>
            {expandable && (
              <div id={`plan-${p.handle}`} className="fold" data-open={on} inert={!on}>
                <div>
                  <div className="grid gap-5 border-b border-line py-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
                    <div className="overflow-hidden rounded-pill bg-stone p-2"><FloorPlan compact plan={p.plan} title={p.title} /></div>
                    <div className="flex flex-col gap-2">
                      <p className="measure">{p.summary}</p>
                      <p className="help">{bedsLabel(p.beds)}, {plural(p.baths, "bathroom")}. A sample home; the plan is drawn to scale.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** A stay on the rail. The whole card is one link; the photo slot carries over to the stay's page. */
export function StayCard({ p }: { p: Stay }) {
  return (
    <article className="door-stays relative flex flex-col gap-3">
      <Slot kind="room" line={p.photo} label="Sample apartment" style={vt(`stay-${p.handle}`)} />
      <div className="flex flex-col gap-1">
        <h3><VLink to={`/stays/${p.handle}`} className="stretch hover:underline">{p.title}</VLink></h3>
        <p>{p.area} {p.postcode}. Sleeps {p.sleeps}, {lower(bedsLabel(p.beds))}, from {plural(p.minNights, "night")}.</p>
        <p className="help"><b className="text-ink">£[PRICE]</b> a night</p>
      </div>
    </article>
  );
}

/** Stays as a rail that runs off the right edge; the buttons move it one card at a time. */
export function StayRail({ stays }: { stays: Stay[] }) {
  const rail = useRef<HTMLUListElement>(null);
  const [scrolls, setScrolls] = useState(false);
  useEffect(() => {
    const el = rail.current; if (!el) return;
    const check = () => setScrolls(el.scrollWidth > el.clientWidth + 4);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [stays.length]);
  const move = (dir: 1 | -1) => { const el = rail.current; if (!el) return; const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 320; el.scrollBy({ left: dir * (step + 20), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); };
  return (
    <div className="flex flex-col gap-4">
      <ul ref={rail} className="rail" tabIndex={scrolls ? 0 : undefined} aria-label={`${plural(stays.length, "sample stay")}, scroll sideways`}>
        {stays.map((p) => <li key={p.handle}><StayCard p={p} /></li>)}
      </ul>
      {scrolls && <div className="wrap hidden gap-2 md:flex">
        <button type="button" onClick={() => move(-1)} aria-label="Earlier stays" className="btn btn-line min-h-11 px-3"><Icon.Prev /></button>
        <button type="button" onClick={() => move(1)} aria-label="More stays" className="btn btn-line min-h-11 px-3"><Icon.Next /></button>
      </div>}
    </div>
  );
}

const kindOf = (p: Project) => (p.type === "Extension" ? "extension" : "refurb");
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** The before and after pair for a project. Shared between the row and the project's page. */
export function BeforeAfter({ p, lines = false }: { p: Project; lines?: boolean }) {
  const k = kindOf(p);
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:gap-3" style={vt(`project-${p.handle}`)}>
      <Slot kind={`${k}-before`} label="Before" line={cap(p.before.replace(/^Before: /, ""))} tone="stone" compact={!lines} ratio={lines ? "aspect-[4/5] sm:aspect-[4/3]" : "aspect-square sm:aspect-[4/3]"} />
      <Slot kind={`${k}-after`} label="After" line={cap(p.after.replace(/^After: /, ""))} compact={!lines} ratio={lines ? "aspect-[4/5] sm:aspect-[4/3]" : "aspect-square sm:aspect-[4/3]"} />
    </div>
  );
}

/** A build project across the full width: the before and after pair, with the floor plan and the facts beside. */
export function ProjectRow({ p }: { p: Project }) {
  return (
    <article className="door-build relative grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
      <BeforeAfter p={p} />
      <div className="flex flex-col gap-3 lg:justify-between">
        <div className="flex flex-col gap-1">
          <h3><VLink to={`/build/${p.handle}`} className="stretch hover:underline">{p.title}</VLink></h3>
          <p className="help">{p.type} in {p.area}, {p.size}, {p.duration} on site. A sample project.</p>
        </div>
        <div className="overflow-hidden rounded-pill bg-stone p-2 sm:max-w-sm lg:max-w-none"><FloorPlan compact plan={p.plan} title={`${p.title}, changed rooms shaded`} /></div>
      </div>
    </article>
  );
}
