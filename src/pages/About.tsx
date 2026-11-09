import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { AreaMap, Icon, Marque, Slot } from "../components/Svg";
import { DOORS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

export function About() {
  const { openDrawer } = useEnquiry();
  return (
    <>
      <Seo title="About Realco and how to reach us" path="/about" description={`Realco (${SITE.legalName}, part of ${SITE.group}): property management for landlords, refurbishments and extensions, and short stays across ${SITE.region}, from one team on one number.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "About and contact", path: "/about" }]), { "@context": "https://schema.org", "@type": "ContactPage", name: "About and contact", mainEntity: { "@id": `${SITE.url}/#business` } }]} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid gap-10 py-12 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="label text-fog">About Realco</p>
            <h1 className="text-[40px] text-paper sm:text-[60px]">One team that manages, builds and hosts.</h1>
            <p className="max-w-xl text-[18px] text-fog">Most property businesses do one of these. We do three, because they feed each other: a house we refurbish is a house we can manage; a landlord with a leak calls the people who fitted the bathroom; a home waiting on its owner's plans can earn as a stay.</p>
            <p className="max-w-xl text-base text-fog">Realco is {SITE.legalName}, a separate company in {SITE.group}.</p>
          </div>
          <div className="hidden justify-end lg:flex"><Marque size={220} doors fill="#f5f0e6" /></div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label text-mute">Call or message</h2><a href={`tel:${SITE.phone}`} className="inline-flex min-h-11 items-center gap-2 text-lg"><Icon.Phone /> {SITE.phone}</a><a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center text-lg underline">{SITE.email}</a><p className="text-base text-mute">{SITE.hours}. One number for lettings, build and stays.</p></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label text-mute">Office</h2><p className="text-lg">{SITE.address}</p><p className="text-base text-mute">Inspections and site visits by appointment.</p></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label text-mute">Company</h2><p className="text-lg">{SITE.legalName}</p><p className="text-base text-mute">Part of {SITE.group} · Company no. {SITE.companyNumber} · [REDRESS SCHEME] · [CMP PROVIDER] · [ICO REGISTRATION]</p></div>
      </section>

      <section className="bg-stone py-16">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <AreaMap areas={store.areas()} className="max-w-lg rounded-pill border border-line" />
          <div className="flex flex-col gap-4">
            <p className="label text-mute">Areas</p>
            <h2 className="text-[32px] sm:text-[40px]">Where we work</h2>
            <p className="text-[17px]">Across {SITE.region}. The map is a sketch, not a boundary: if you are near these places, call; if you are a little further out, call anyway.</p>
            <ul className="flex flex-wrap gap-2" aria-label="Areas on the map">{store.areas().map((a) => <li key={a.name} className="inline-flex min-h-11 items-center rounded-pill border border-line bg-paper px-3 text-base">{a.name}</li>)}</ul>
            <p className="text-base text-mute">Full list of areas served: {SITE.areasServed}</p>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
              {DOORS.map((d) => <Link key={d.id} to={d.path} className={`door-${d.id} inline-flex min-h-11 items-center gap-2 font-semibold underline`}><Marque size={22} door={d.id} fill="#1c2534" /> {d.name}</Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div className="flex flex-col gap-3"><p className="label text-mute">The people</p><h2 className="text-[32px] sm:text-[40px]">Who answers the phone</h2><p className="text-[17px]">Named contacts for each door, so you speak to the same person each time.</p></div>
        <div className="grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
          <Slot kind="team" tone="paper" label="Team photo" line="The team, at the office" ratio="aspect-square" compact className="door-lettings" />
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {DOORS.map((d) => <li key={d.id} className="flex flex-wrap items-baseline gap-x-4 py-3 text-base"><span className={`door-${d.id} label w-20 text-door`}>{d.name}</span><span>[TEAM MEMBER NAME]</span><span className="text-mute">[ROLE]</span></li>)}
          </ul>
        </div>
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-4 rounded-pill bg-stone p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1"><h2 className="text-[28px] sm:text-[32px]">What clients say</h2><p className="text-base text-mute">[Client review, to come]</p></div>
          <button type="button" onClick={() => openDrawer()} className="btn btn-ink shrink-0">Talk to Realco</button>
        </div>
      </section>
    </>
  );
}
