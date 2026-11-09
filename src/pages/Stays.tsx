import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { StayCard, Facts } from "../components/Cards";
import { ALSO_ON, StayEnquiry } from "../components/DoorTools";
import { AreaMap, FloorPlan, Icon, Slot } from "../components/Svg";
import { NotFound } from "./NotFound";
import { SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { plural, store } from "../lib/store";

export function Stays() {
  const { openDrawer } = useEnquiry();
  return (
    <div className="door-stays">
      <Seo title="Short stays in South London, booked direct" path="/stays" description="Serviced apartments and a family house in South London for a few nights or a few months. Book direct with Realco: enter dates and guests and we confirm availability and price by reply."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Stays", path: "/stays" }]), { "@context": "https://schema.org", "@type": "Service", name: "Short stays and serviced apartments, booked direct", serviceType: "Serviced accommodation", provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region }]} />

      <section className="bg-door-t">
        <div className="wrap flex flex-col gap-6 py-10 sm:gap-8 sm:py-16">
          <div className="flex max-w-3xl flex-col gap-4 sm:gap-5">
            <p className="label text-door">Stays · book direct</p>
            <h1 className="text-[40px] sm:text-[60px]">Book direct, and stay in South London.</h1>
            <p className="text-[18px]">Serviced apartments and a family house, cleaned and ready, for a few nights or a working month. Book here and you deal directly with the team that looks after the place.</p>
          </div>
          <div className="card p-5 sm:p-6"><StayEnquiry /></div>
          <p className="text-base text-mute">{ALSO_ON} The same apartments, booked straight with us.</p>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex max-w-2xl flex-col gap-3"><p className="label text-door">The apartments</p><h2 className="text-[32px] sm:text-[40px]">Four places to stay</h2><p className="text-base text-mute">Sample apartments in this preview. Prices per night are confirmed by reply.</p></div>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">{store.stays().map((p) => <StayCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="border-y border-line bg-stone py-14">
        <div className="wrap grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] sm:text-[32px]">Why book direct</h2>
            <ul className="flex flex-col gap-2 text-[17px]">
              <li className="flex gap-2"><span className="text-door"><Icon.Check /></span> One local team from enquiry to check-out, on {SITE.phone}.</li>
              <li className="flex gap-2"><span className="text-door"><Icon.Check /></span> Questions answered before you book, by the people who clean the apartment.</li>
              <li className="flex gap-2"><span className="text-door"><Icon.Check /></span> [DIRECT BOOKING BENEFIT, e.g. a rate or a perk for booking here].</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-[28px] sm:text-[32px]">Longer stays and groups</h2>
            <p className="text-[17px]">Between homes, during building work, or relocating a team: [MONTHLY RATE TERMS]. Group and corporate stays are arranged by one person, with invoicing and [CORPORATE TERMS] on request.</p>
            <button type="button" onClick={() => openDrawer({ door: "stays", need: "A corporate or relocation stay" })} className="btn btn-ink self-start">Ask about a longer stay</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function StayPage() {
  const { handle = "" } = useParams();
  const p = store.stay(handle);
  if (!p) return <NotFound />;
  const path = `/stays/${p.handle}`;
  const related = store.stays().filter((x) => x.handle !== p.handle).slice(0, 2);
  return (
    <div className="door-stays">
      <Seo title={`${p.title}, ${p.area}`} path={path} description={`${p.title} in ${p.area}: sleeps ${p.sleeps}, ${plural(p.beds, "bedroom")}, minimum ${p.minNights} nights. Book direct with Realco. ${p.summary}`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Stays", path: "/stays" }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "LodgingBusiness", name: `${p.title} by Realco`, description: p.summary, address: { "@type": "PostalAddress", addressLocality: p.area, postalCode: p.postcode, addressRegion: "London", addressCountry: "GB" }, amenityFeature: p.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: f, value: true })) }]} />

      <section className="wrap grid gap-8 pb-16 pt-4 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-4 lg:order-2">
          <nav aria-label="Breadcrumb" className="-my-2 text-base text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · <Link to="/stays" className="inline-flex min-h-11 items-center underline">Stays</Link></nav>
          <div className="flex flex-col gap-2">
            <p className="label text-door">Sample apartment · book direct</p>
            <h1 className="text-[36px] sm:text-[48px]">{p.title}</h1>
            <p className="text-base text-mute">{p.area} {p.postcode} · minimum {p.minNights} nights</p>
            <p className="text-base"><b>£[PRICE]</b> a night · <b>£[MONTHLY RATE]</b> for a month or more</p>
          </div>
          <Facts items={[[<Icon.Guests key="g" />, `Sleeps ${p.sleeps}`], [<Icon.Bed key="b" />, plural(p.beds, "bedroom")], [<Icon.Bath key="a" />, plural(p.baths, "bathroom")]]} />
          <p className="text-[17px]">{p.summary}</p>
          <div className="card p-5"><h2 className="label mb-4 text-door">Book this apartment direct</h2><StayEnquiry stacked stayTitle={p.title} minNights={p.minNights} sleeps={p.sleeps} /></div>
          <div className="border-t border-line">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">What's included</summary><ul className="grid gap-1 pb-4 text-base text-mute sm:grid-cols-2">{p.features.map((f) => <li key={f} className="flex gap-2"><Icon.Check /> {f}</li>)}</ul></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">Check-in, cleaning and deposit</summary><p className="pb-4 text-base text-mute">Check-in from [CHECK-IN TIME], check-out by [CHECK-OUT TIME]. [CLEANING FEE] per stay and a [DEPOSIT] security hold. Cancellation: [CANCELLATION TERMS].</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">House rules</summary><p className="pb-4 text-base text-mute">No parties or events. [PET POLICY]. [SMOKING POLICY]. Quiet hours respected for the neighbours.</p></details>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:order-1">
          <Slot kind="room" line={p.photo} />
          <div className="overflow-hidden rounded-pill border border-line"><FloorPlan plan={p.plan} title={p.title} /></div>
        </div>
      </section>

      <section className="wrap grid gap-6 pb-16 sm:grid-cols-[300px_1fr] sm:items-start">
        <AreaMap areas={store.areas()} highlight={p.area} className="max-w-[300px] rounded-pill border border-line" />
        <div className="flex flex-col gap-3"><h2 className="text-[28px] sm:text-[32px]">Getting around from {p.area}</h2><p className="text-base text-mute">[TRANSPORT NOTE: nearest stations, journey times to central London, parking.]</p><p className="text-base text-mute">{ALSO_ON}</p></div>
      </section>

      <section className="wrap pb-6">
        <h2 className="mb-6 text-[32px] sm:text-[36px]">Other stays</h2>
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">{related.map((x) => <StayCard key={x.handle} p={x} />)}</div>
      </section>
    </div>
  );
}
