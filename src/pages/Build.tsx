import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProjectCard } from "../components/Cards";
import { BuildEnquiry, NEED_FOR } from "../components/DoorTools";
import { FloorPlan, Icon, Slot } from "../components/Svg";
import { NotFound } from "./NotFound";
import { PROJECT_TYPES, SITE, type ProjectType } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

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
  return (
    <div className="door-build">
      <Seo title="Refurbishments and extensions in South London" path="/build" description="Realco Build: refurbishments and rear and side-return extensions across South London, for homeowners and landlords. Tell us the job, rough size and timing and we arrange a site visit and a written quote."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Build", path: "/build" }]), { "@context": "https://schema.org", "@type": "Service", name: "Refurbishments and extensions", serviceType: PROJECT_TYPES.join(", "), provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region }]} />

      <section className="bg-door-t">
        <div className="wrap grid gap-8 py-10 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-10">
          <div className="flex flex-col gap-4 sm:gap-5">
            <p className="label text-door">Build</p>
            <h1 className="text-[40px] sm:text-[60px]">Refurbishments and extensions.</h1>
            <p className="max-w-xl text-[18px]">For homeowners and landlords across {SITE.region}: a kitchen, a bathroom or a whole house brought back to life, or a rear or side-return extension. A site visit, a written quote, and a date you can plan around.</p>
          </div>
          <div className="card p-5 sm:p-6"><BuildEnquiry /></div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex max-w-2xl flex-col gap-3"><p className="label text-door">What we do</p><h2 className="text-[32px] sm:text-[44px]">Two kinds of job, done properly.</h2></div>
        <div className="grid gap-10 lg:grid-cols-2">
          {SERVICES.map((s) => {
            const k = s.type === "Extension" ? "extension" : "refurb";
            return (
              <div key={s.type} className="grid gap-5 sm:grid-cols-[1fr_1fr]">
                <div className="flex flex-col gap-3 border-t-2 border-ink pt-5">
                  <h3 className="text-2xl">{s.type}</h3>
                  <p className="text-[17px]">{s.line}</p>
                  <ul className="flex flex-col gap-1.5 text-base">{s.items.map((x) => <li key={x} className="flex gap-2"><span className="text-door"><Icon.Check /></span> {x}</li>)}</ul>
                </div>
                <Slot kind={`${k}-after`} label="After" line={s.type === "Extension" ? "A finished extension, from the garden" : "A finished kitchen, ready to use"} ratio="aspect-[4/3] sm:aspect-auto" />
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-3"><p className="label text-door">How it works</p><h2 className="text-[32px] sm:text-[44px]">Five steps, no surprises.</h2><p className="text-base text-mute">Insured to [INSURANCE COVER]. Accreditations: [ACCREDITATIONS]. Landlords whose homes we manage get repairs and refurbishments at [TRADE RATE TERMS].</p></div>
          <ol className="flex flex-col border-l-2 border-door">
            {STEPS.map(([t, d]) => <li key={t} className="flex flex-col gap-1 py-4 pl-6 first:pt-1 last:pb-1"><h3 className="text-lg">{t}</h3><p className="text-base text-mute">{d}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="label text-door">Projects</p><h2 className="text-[32px] sm:text-[40px]">Before and after</h2><p className="mt-2 text-base text-mute">Sample projects; photographs are on their way.</p></div>
          <p className="text-base text-mute" aria-live="polite">{list.length} sample {list.length === 1 ? "project" : "projects"}</p>
        </div>
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          <button type="button" aria-pressed={type === null} onClick={() => setType(null)} className={`chip ${type === null ? "" : "border-line"}`}>All</button>
          {PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={`chip ${type === t ? "" : "border-line"}`}>{t}</button>)}
        </div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">{list.map((p) => <ProjectCard key={p.handle} p={p} />)}</div>
      </section>
    </div>
  );
}

export function ProjectPage() {
  const { handle = "" } = useParams();
  const p = store.project(handle);
  const { openDrawer } = useEnquiry();
  if (!p) return <NotFound />;
  const path = `/build/${p.handle}`;
  const related = store.projects().filter((x) => x.handle !== p.handle).slice(0, 2);
  const k = p.type === "Extension" ? "extension" : "refurb";
  return (
    <div className="door-build">
      <Seo title={`${p.title}, ${p.area}`} path={path} description={`${p.type} in ${p.area} by Realco Build: ${p.summary}`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Build", path: "/build" }, { name: p.title, path }]), { "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: p.summary, genre: p.type, locationCreated: { "@type": "Place", name: `${p.area}, London` }, creator: { "@id": `${SITE.url}/#business` } }]} />

      <section className="wrap grid gap-8 pb-16 pt-4 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-6 lg:order-2">
          <nav aria-label="Breadcrumb" className="-my-2 text-base text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · <Link to="/build" className="inline-flex min-h-11 items-center underline">Build</Link></nav>
          <div className="flex flex-col gap-2">
            <p className="label text-door">Sample project · {p.type}</p>
            <h1 className="text-[36px] sm:text-[48px]">{p.title}</h1>
            <p className="text-base text-mute">{p.area} · {p.size} · {p.duration} on site</p>
          </div>
          <p className="text-[17px]">{p.summary}</p>
          <div>
            <h2 className="label mb-3 text-mute">Scope</h2>
            <ul className="grid gap-1 text-base sm:grid-cols-2">{p.scope.map((s) => <li key={s} className="flex gap-2"><span className="text-door"><Icon.Check /></span> {s}</li>)}</ul>
          </div>
          <dl className="grid grid-cols-2 gap-4 rounded-pill bg-door-t p-5 text-base">
            <div><dt className="label text-door">Cost</dt><dd>£[PROJECT COST]</dd></div>
            <div><dt className="label text-door">On site</dt><dd>{p.duration}</dd></div>
          </dl>
          <p className="text-base text-mute">Client review: [Client review, to come]</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => openDrawer({ door: "build", need: NEED_FOR[p.type], about: `Something like "${p.title}" in ${p.area}.` })} className="btn btn-door min-h-14">Quote for something like this</button>
            <a href={`tel:${SITE.phone}`} className="btn btn-ghost min-h-14">Call {SITE.phone}</a>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:order-1">
          <div className="grid grid-cols-2 gap-3">
            <Slot kind={`${k}-before`} label="Before" line={cap(p.before.replace(/^Before: /, ""))} tone="stone" ratio="aspect-[4/5]" />
            <Slot kind={`${k}-after`} label="After" line={cap(p.after.replace(/^After: /, ""))} ratio="aspect-[4/5]" />
          </div>
          <figure className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-pill border border-line"><FloorPlan plan={p.plan} title={`${p.title}, changed rooms shaded`} /></div>
            <figcaption className="text-[14px] text-mute">Plan: rooms we built or rebuilt are shaded gold.</figcaption>
          </figure>
        </div>
      </section>

      <section className="wrap pb-6">
        <h2 className="mb-6 text-[32px] sm:text-[36px]">More projects</h2>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">{related.map((x) => <ProjectCard key={x.handle} p={x} />)}</div>
      </section>
    </div>
  );
}
