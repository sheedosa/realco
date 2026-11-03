import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ProjectCard } from "../components/Cards";
import { BuildEnquiry } from "../components/DoorTools";
import { FloorPlan, Icon, PhotoSlot } from "../components/Svg";
import { NotFound } from "./NotFound";
import { PROJECT_TYPES, SITE, type ProjectType } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

const STEPS = [
  ["Site visit", "We walk the property with you, measure up and talk through what you want and what the building will allow."],
  ["Written quote", "An itemised quote within [QUOTE TURNAROUND]: [QUOTE CONTENTS, e.g. what is included, what is provisional, a programme]."],
  ["Design and permissions", "Drawings, planning or permitted development, party wall and building control: [WHO HANDLES DESIGN AND PERMISSIONS]."],
  ["Build", "[SITE MANAGEMENT MODEL]: who runs the site and how often you hear from them. [PAYMENT TERMS]."],
  ["Handover", "Snagging walked together, certificates handed over, and [GUARANTEE TERMS] in writing."],
];

export function Build() {
  const [type, setType] = useState<ProjectType | null>(null);
  const list = store.projects(type);
  return (
    <div className="door-build">
      <Seo title="Refurbishments, extensions, lofts and new builds in South London" path="/build" description="Realco Build: refurbishments, rear and side-return extensions, loft conversions and new builds across South London. Tell us the type, rough size and timing and we arrange a site visit and a written quote."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Build", path: "/build" }]), { "@context": "https://schema.org", "@type": "Service", name: "Construction and refurbishment", serviceType: PROJECT_TYPES.join(", "), provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region }]} />

      <section className="bg-door-t">
        <div className="wrap grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="label text-door">Build</p>
            <h1 className="text-[44px] sm:text-[64px]">What do you want to build?</h1>
            <p className="max-w-xl text-[18px]">Refurbishments between tenancies, rear and side-return extensions, loft conversions and the occasional new build, across {SITE.region}. A written quote, [SITE MANAGEMENT MODEL], and a date you can plan around.</p>
          </div>
          <div className="card p-5 sm:p-6"><BuildEnquiry /></div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex max-w-2xl flex-col gap-3"><p className="label text-door">Services</p><h2 className="text-[32px] sm:text-[44px]">Four kinds of job, one way of working.</h2></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[["Refurbishment", "Kitchens, bathrooms, rewires, decoration and compliance work, often to a letting deadline.", <Icon.Brick key="i" />],
            ["Extension", "Rear, side-return and wraparound extensions with structural work and glazing.", <Icon.Roof key="i" />],
            ["Loft conversion", "Dormer, hip-to-gable and mansard lofts with staircases and en-suites.", <Icon.Area key="i" />],
            ["New build", "Infill plots and small developments from groundworks to handover.", <Icon.Key key="i" />]].map(([t, d, ic]) => (
            <div key={t as string} className="flex flex-col gap-3 border-t border-ink pt-5"><span className="text-door">{ic}</span><h3 className="text-xl">{t}</h3><p className="text-mute">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap">
          <div className="mb-8 flex max-w-2xl flex-col gap-3"><p className="label text-door">Process</p><h2 className="text-[32px] sm:text-[44px]">Five steps, no surprises.</h2></div>
          <ol className="grid gap-4 md:grid-cols-5">
            {STEPS.map(([t, d], i) => <li key={t} className="flex flex-col gap-2 rounded-pill bg-paper p-5"><p className="display text-[36px] text-door">{i + 1}</p><h3 className="text-lg">{t}</h3><p className="text-sm text-mute">{d}</p></li>)}
          </ol>
          <p className="mt-6 text-sm text-mute">Insured to [INSURANCE COVER]. Accreditations: [ACCREDITATIONS]. Landlord clients of Realco Lettings get repairs and refurbishments at [TRADE RATE TERMS].</p>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="label text-door">Projects</p><h2 className="text-[32px] sm:text-[40px]">Recent work</h2></div>
          <p className="text-sm text-mute" aria-live="polite">{list.length} sample projects</p>
        </div>
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by type">
          <button type="button" aria-pressed={type === null} onClick={() => setType(null)} className={`chip ${type === null ? "" : "border-line"}`}>All</button>
          {PROJECT_TYPES.map((t) => <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={`chip ${type === t ? "" : "border-line"}`}>{t}</button>)}
        </div>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProjectCard key={p.handle} p={p} />)}</div>
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
  const related = store.projects().filter((x) => x.handle !== p.handle).slice(0, 3);
  const needFor: Record<ProjectType, string> = { Refurbishment: "A quote for a refurbishment", Extension: "A quote for an extension", "Loft conversion": "A quote for a loft conversion", "New build": "A new build" };
  return (
    <div className="door-build">
      <Seo title={`${p.title}, ${p.area}`} path={path} description={`${p.type} in ${p.area} by Realco Build: ${p.summary}`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Build", path: "/build" }, { name: p.title, path }]), { "@context": "https://schema.org", "@type": "CreativeWork", name: p.title, description: p.summary, genre: p.type, locationCreated: { "@type": "Place", name: `${p.area}, London` }, creator: { "@id": `${SITE.url}/#business` } }]} />

      <section className="wrap grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-4">
          <PhotoSlot label={p.photos[0]} ratio="aspect-[4/3]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center overflow-hidden rounded-pill border border-line bg-stone"><FloorPlan plan={p.plan} title={`${p.title}, new rooms shaded`} /></div>
            <PhotoSlot label={p.photos[1]} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="-my-2 text-sm text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · <Link to="/build" className="inline-flex min-h-11 items-center underline">Build</Link></nav>
          <div className="flex flex-col gap-2">
            <p className="label text-door">Sample project · {p.type}</p>
            <h1 className="text-[36px] sm:text-[44px]">{p.title}</h1>
            <p className="text-mute">{p.area} · {p.size} · {p.duration} on site</p>
          </div>
          <p className="text-[17px]">{p.summary}</p>
          <div>
            <h2 className="label mb-3 font-sans text-mute">Scope</h2>
            <ul className="grid gap-1 sm:grid-cols-2">{p.scope.map((s) => <li key={s} className="flex gap-2"><Icon.Check /> {s}</li>)}</ul>
          </div>
          <dl className="grid grid-cols-2 gap-4 rounded-pill bg-door-t p-5 text-sm sm:grid-cols-3">
            <div><dt className="text-mute">Cost</dt><dd className="text-lg">£[PROJECT COST]</dd></div>
            <div><dt className="text-mute">Programme</dt><dd className="text-lg">{p.duration}</dd></div>
            <div><dt className="text-mute">Client review</dt><dd className="text-lg">[Client review, to come]</dd></div>
          </dl>
          <div className="flex flex-col gap-3">
            <button type="button" onClick={() => openDrawer({ door: "build", need: needFor[p.type], about: `Something like "${p.title}" in ${p.area}.` })} className="btn btn-door min-h-14">Quote for something like this</button>
            <a href={`tel:${SITE.phone}`} className="btn btn-ghost">Call {SITE.phone}</a>
          </div>
        </div>
      </section>

      <section className="wrap pb-6">
        <h2 className="mb-6 text-[32px] sm:text-[36px]">More projects</h2>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((x) => <ProjectCard key={x.handle} p={x} />)}</div>
      </section>
    </div>
  );
}
