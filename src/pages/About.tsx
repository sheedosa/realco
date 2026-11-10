import { Seo, breadcrumbs } from "../components/Seo";
import { AreaMap, Icon, Marque, Slot } from "../components/Svg";
import { VLink } from "../components/VLink";
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
        <div className="wrap grid gap-10 pb-12 pt-8 sm:pb-16 sm:pt-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end">
          <div className="flex flex-col gap-5">
            <h1 className="max-w-[22ch]">One team that manages, builds and hosts.</h1>
            <p className="lede text-fog">Most property businesses do one of these. We do three, because they feed each other: a house we refurbish is a house we can manage; a landlord with a leak calls the people who fitted the bathroom; a home waiting on its owner's plans can earn as a stay.</p>
            <p className="text-fog">Realco is {SITE.legalName}, a separate company in {SITE.group}.</p>
          </div>
          <div className="hidden justify-end lg:flex"><Marque size={200} doors fill="#f5f0e6" /></div>
        </div>
      </section>

      {/* Contact as a ledger: what, then the detail. */}
      <section className="wrap grid gap-x-14 gap-y-6 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)]">
        <div className="flex flex-col gap-4">
          <h2>How to reach us</h2>
          <button type="button" onClick={() => openDrawer()} className="btn btn-ink self-start">Talk to Realco</button>
        </div>
        <dl className="border-t-2 border-ink">
          <div className="grid gap-x-8 gap-y-1 border-b border-line py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <dt className="t-sub">Call or message</dt>
            <dd className="flex flex-col"><a href={`tel:${SITE.phone}`} className="link gap-2 self-start"><Icon.Phone /> {SITE.phone}</a><a href={`mailto:${SITE.email}`} className="link self-start">{SITE.email}</a><span className="help">{SITE.hours}. One number for lettings, build and stays.</span></dd>
          </div>
          <div className="grid gap-x-8 gap-y-1 border-b border-line py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <dt className="t-sub">Office</dt>
            <dd className="flex flex-col gap-1"><span>{SITE.address}</span><span className="help">Inspections and site visits by appointment.</span></dd>
          </div>
          <div className="grid gap-x-8 gap-y-1 border-b border-line py-5 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <dt className="t-sub">Company</dt>
            <dd className="flex flex-col gap-1"><span>{SITE.legalName}, part of {SITE.group}. Company no. {SITE.companyNumber}.</span><span className="help">[REDRESS SCHEME], [CMP PROVIDER], [ICO REGISTRATION]</span></dd>
          </div>
        </dl>
      </section>

      <section className="bg-stone py-14 sm:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <AreaMap areas={store.areas()} className="max-w-lg rounded-pill" />
          <div className="flex flex-col gap-4">
            <h2>Where we work</h2>
            <p className="lede">Across {SITE.region}. The map is a sketch, not a boundary: if you are near these places, call; if you are a little further out, call anyway.</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 border-y border-ink py-3" aria-label="Areas on the map">{store.areas().map((a) => <li key={a.name}>{a.name}</li>)}</ul>
            <p className="help">Full list of areas served: {SITE.areasServed}</p>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-x-14 gap-y-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)]">
        <div className="flex flex-col gap-3"><h2>Who answers the phone</h2><p className="measure">Named contacts for each door, so you speak to the same person each time.</p></div>
        <div className="grid gap-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-start">
          <Slot kind="team" tone="paper" label="Team photo" line="The team, at the office" ratio="aspect-square" compact className="door-lettings max-w-[11rem]" />
          <ul className="border-t-2 border-ink">
            {DOORS.map((d) => (
              <li key={d.id} className={`door-${d.id} grid grid-cols-[1rem_minmax(0,1fr)] items-baseline gap-x-3 border-b border-line py-3 sm:grid-cols-[1rem_7rem_minmax(0,1fr)_minmax(0,1fr)]`}>
                <span className="bg-door h-3.5 w-3.5 self-center rounded-[2px]" aria-hidden="true" />
                <VLink to={d.path} className="tlink">{d.name}</VLink>
                <span className="col-start-2 sm:col-start-auto">[TEAM MEMBER NAME]</span><span className="help col-start-2 sm:col-start-auto">[ROLE]</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-ink bg-ink text-paper">
        <div className="wrap flex flex-col gap-5 py-12 sm:py-16 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex flex-col gap-2"><h2>What clients say</h2><p className="text-fog">[Client review, to come]</p></div>
          <button type="button" onClick={() => openDrawer()} className="btn btn-paper shrink-0 self-start md:self-auto">Talk to Realco</button>
        </div>
      </section>
    </>
  );
}
