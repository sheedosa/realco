import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { DoorBand, StickyBar } from "../components/Board";
import { BeforeAfter, ProjectRow } from "../components/Cards";
import { BuildEnquiry, NEED_FOR } from "../components/DoorTools";
import { FloorPlan, Icon } from "../components/Svg";
import { VLink } from "../components/VLink";
import { NotFound } from "./NotFound";
import { PROJECT_TYPES, SITE, type ProjectType } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { plural, store } from "../lib/store";

const STEPS = [
  ["Site visit", "We walk the property with you, measure up and talk through what you want and what the building will allow."],
  ["Written quote", "An itemised quote within [QUOTE TURNAROUND]: [QUOTE CONTENTS, e.g. what is included, what is provisional, a programme]."],
  ["Design and permissions", "Drawings, planning or permitted development, party wall and building control: [WHO HANDLES DESIGN AND PERMISSIONS]."],
  ["Build", "[SITE MANAGEMENT MODEL]: who runs the site and how often you hear from them. [PAYMENT TERMS]."],
  ["Handover", "Snagging walked together, certificates handed over, and [GUARANTEE TERMS] in writing."],
];

const SERVICES: { type: ProjectType; line: string; items: string[] }[] = [
  { type: "Refurbishment", line: "Single rooms to whole houses, often to a letting deadline.", items: ["Kitchens and bathrooms", "Rewires and replumbs", "Flooring and decoration", "Safety and compliance work"] },
  { type: "Extension", line: "More room on the ground floor, built and finished.", items: ["Rear extensions", "Side-return infills", "Structural steel and glazing", "Kitchen fit-out to finish"] },
];

export function Build() {
  const [type, setType] = useState<ProjectType | null>(null);
  const list = store.projects(type);
  const start = useRef<HTMLButtonElement>(null);
  const { openDrawer } = useEnquiry();
  return (
    <div className="door-build">
      <Seo title="Refurbishments and extensions in South London" path="/build" description="Realco Build: refurbishments and rear and side-return extensions across South London, for homeowners and landlords. Tell us the job, rough size and timing and we arrange a site visit and a written quote."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Build", path: "/build" }]), { "@context": "https://schema.org", "@type": "Service", name: "Refurbishments and extensions", serviceType: PROJECT_TYPES.join(", "), provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region }]} />

      <DoorBand door="build" lede={<>For homeowners and landlords across {SITE.region}: a kitchen, a bathroom or a whole house brought back to life, or a rear or side-return extension. A site visit, a written quote, and a date you can plan around.</>}>
        <BuildEnquiry startRef={start} />
      </DoorBand>

      <section className="wrap grid gap-x-14 gap-y-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)]">
        <h2 className="max-w-[12ch]">Two kinds of job, done properly.</h2>
        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.type} className="flex flex-col gap-3 border-t-4 border-door pt-5">
              <h3>{s.type}</h3>
              <p className="lede">{s.line}</p>
              <ul className="mt-1 flex flex-col gap-2">{s.items.map((x) => <li key={x} className="flex gap-2"><span className="text-door"><Icon.Check /></span> {x}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* A real sequence, so it is numbered. */}
      <section className="on-ink bg-ink py-14 text-paper sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
          <div className="flex flex-col gap-4">
            <h2>Five steps, no surprises.</h2>
            <p className="text-fog">Insured to [INSURANCE COVER]. Accreditations: [ACCREDITATIONS]. Landlords whose homes we manage get repairs and refurbishments at [TRADE RATE TERMS].</p>
          </div>
          <ol>
            {STEPS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-t border-paper/25 py-5 sm:grid-cols-[4.5rem_minmax(0,1fr)]">
                <span className="t-num" aria-hidden="true">{i + 1}</span>
                <div className="flex flex-col gap-1.5"><h3>{t}</h3><p className="text-fog">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap py-14 sm:py-20">
        <div className="mb-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2"><h2>Before and after</h2><p className="help">Sample projects; photographs are on their way.</p></div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by type">
              <button type="button" aria-pressed={type === null} onClick={() => setType(null)} className="chip">All</button>
              {PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className="chip">{t}s</button>)}
            </div>
            <p aria-live="polite">Showing {type ? `${plural(list.length, `sample ${type.toLowerCase()}`)}` : `all ${plural(list.length, "sample project")}`}.</p>
          </div>
        </div>
        {list.length ? (
          <ul className="flex flex-col">{list.map((p) => <li key={p.handle} className="border-t border-ink py-8 first:pt-6 last:pb-0"><ProjectRow p={p} /></li>)}</ul>
        ) : (
          <p className="border-t border-ink pt-6">No sample {type?.toLowerCase()}s yet. <button type="button" onClick={() => setType(null)} className="link">Show all projects</button></p>
        )}
      </section>

      <StickyBar watch={start}>
        <p className="min-w-0 leading-tight">A site visit, then a written quote</p>
        <button type="button" onClick={() => openDrawer({ door: "build" })} className="btn btn-paper shrink-0 px-4">Ask for a visit</button>
      </StickyBar>
    </div>
  );
}

export function ProjectPage() {
  const { handle = "" } = useParams();
  const p = store.project(handle);
  const { openDrawer } = useEnquiry();
  const cta = useRef<HTMLButtonElement>(null);
  if (!p) return <NotFound />;
  const path = `/build/${p.handle}`;
  const related = store.projects().filter((x) => x.handle !== p.handle);
  const ask = () => openDrawer({ door: "build", need: NEED_FOR[p.type], about: `Something like "${p.title}" in ${p.area}.` });
  return (
    <div className="door-build">
      <Seo title={`${p.title}, ${p.area}`} path={path} description={`${p.type} in ${p.area} by Realco Build: ${p.summary}`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Build", path: "/build" }, { name: p.title, path }]), { "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: p.summary, genre: p.type, locationCreated: { "@type": "Place", name: `${p.area}, London` }, creator: { "@id": `${SITE.url}/#business` } }]} />

      <section className="wrap pb-14 pt-2 sm:pb-20 lg:pt-6">
        <nav aria-label="Breadcrumb" className="help"><VLink to="/build" className="link">Build</VLink>, sample {p.type.toLowerCase()}</nav>
        <div className="mt-2 grid gap-x-14 gap-y-4 lg:mt-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <h1>{p.title}</h1>
          <p className="lede">{p.type} in {p.area}, {p.size}, {p.duration} on site.</p>
        </div>

        {/* Before and after across the full width, with the floor plan beside. */}
        <div className="mt-7 grid gap-5 lg:mt-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8">
          <BeforeAfter p={p} lines />
          <figure className="flex flex-col gap-2 lg:justify-between">
            <div className="overflow-hidden rounded-pill bg-stone p-2"><FloorPlan plan={p.plan} title={`${p.title}, changed rooms shaded`} /></div>
            <figcaption className="small help">Plan: rooms we built or rebuilt are shaded gold.</figcaption>
          </figure>
        </div>

        <div className="mt-10 grid gap-x-14 gap-y-8 lg:mt-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <p className="lede">{p.summary}</p>
            <div>
              <h2 className="t-sub mb-3">What we did</h2>
              <ul className="grid gap-x-8 border-t border-ink sm:grid-cols-2">{p.scope.map((s) => <li key={s} className="flex gap-2 border-b border-line py-2.5"><span className="text-door"><Icon.Check /></span> {s}</li>)}</ul>
            </div>
            <p className="help">Client review: [Client review, to come]</p>
          </div>
          <div className="flex flex-col gap-5">
            <dl className="border-t-4 border-door">
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt className="help">Cost</dt><dd>£[PROJECT COST]</dd></div>
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt className="help">On site</dt><dd>{p.duration}</dd></div>
              <div className="flex items-baseline justify-between gap-4 border-b border-line py-3"><dt className="help">Size</dt><dd>{p.size}</dd></div>
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <button ref={cta} type="button" onClick={ask} className="btn btn-key">Quote for something like this</button>
              <a href={`tel:${SITE.phone}`} className="btn btn-line">Call {SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-stone py-14 sm:py-16">
        <div className="wrap">
          <h2 className="mb-6">More projects</h2>
          <ul className="grid border-t border-ink sm:grid-cols-3 sm:gap-x-8">
            {related.map((x) => <li key={x.handle} className="border-b border-line py-2 sm:border-b-0"><VLink to={`/build/${x.handle}`} className="tlink">{x.title}</VLink><p className="help">{x.type} in {x.area}</p></li>)}
          </ul>
        </div>
      </section>

      <StickyBar watch={cta} early>
        <p className="min-w-0 leading-tight"><span className="block font-semibold">{p.type}</span><span className="small">£[PROJECT COST], sample</span></p>
        <button type="button" onClick={ask} className="btn btn-paper shrink-0 px-4">Quote like this</button>
      </StickyBar>
    </div>
  );
}
