import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { StayCard, Facts } from "../components/Cards";
import { StayEnquiry } from "../components/DoorTools";
import { AreaMap, FloorPlan, Icon, PhotoSlot } from "../components/Svg";
import { NotFound } from "./NotFound";
import { SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

export function Stays() {
  const { openDrawer } = useEnquiry();
  return (
    <div className="door-stays">
      <Seo title="Short-term lets and serviced apartments in South London" path="/stays" description="Serviced apartments and whole houses in South London for a few nights or a few months. Enter dates and guests for an enquiry summary; we confirm availability and price by reply."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Stays", path: "/stays" }]), { "@context": "https://schema.org", "@type": "Service", name: "Short-term lets and serviced apartments", serviceType: "Serviced accommodation", provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region }]} />

      <section className="bg-door-t">
        <div className="wrap flex flex-col gap-8 py-14 sm:py-20">
          <div className="flex max-w-2xl flex-col gap-5">
            <p className="label text-door">Stays</p>
            <h1 className="text-[44px] sm:text-[64px]">A South London address, for as long as you need it.</h1>
            <p className="text-[18px]">Serviced apartments and whole houses, cleaned and ready, with a local team on the phone rather than a call centre. A few nights between homes, a working month, or a family visit.</p>
          </div>
          <div className="card p-5 sm:p-6"><StayEnquiry /></div>
        </div>
      </section>

      <section className="wrap grid gap-8 border-b border-line py-14 sm:grid-cols-3">
        {[["Instant answer, human reply", "Your dates and guests become a summary straight away; a person confirms availability and the exact price within [RESPONSE TIME]."],
          ["Monthly rates", "Stays of 28 nights or more are priced monthly. Useful between tenancies, during building work, or on relocation."],
          ["Landlords: fill the gap", "A home between lets can earn as a stay. We furnish, list, clean and manage it, then hand it back for a long let when you say."]].map(([t, d]) => <div key={t} className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">{t}</h2><p className="text-[17px]">{d}</p></div>)}
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4"><h2 className="text-[32px] sm:text-[40px]">The apartments</h2><p className="text-sm text-mute">Sample listings · £[PRICE] per night</p></div>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">{store.stays().map((p) => <StayCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap">
        <div className="on-ink flex flex-col gap-6 rounded-pill bg-ink p-8 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div className="flex max-w-xl flex-col gap-2"><h2 className="text-[32px] text-paper sm:text-[40px]">Relocating a team, or a family for a term?</h2><p className="text-fog">Group and corporate stays are arranged by one person end to end. Invoicing and [CORPORATE TERMS] on request.</p></div>
          <button type="button" onClick={() => openDrawer({ door: "stays", need: "A corporate or relocation stay" })} className="btn btn-paper min-h-14 shrink-0">Ask about group stays</button>
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
  const related = store.stays().filter((x) => x.handle !== p.handle).slice(0, 3);
  return (
    <div className="door-stays">
      <Seo title={`${p.title}, ${p.area}`} path={path} description={`${p.title} in ${p.area}: sleeps ${p.sleeps}, ${p.beds} bedroom${p.beds > 1 ? "s" : ""}, minimum ${p.minNights} nights. ${p.summary}`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Stays", path: "/stays" }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "LodgingBusiness", name: `${p.title} by Realco`, description: p.summary, address: { "@type": "PostalAddress", addressLocality: p.area, postalCode: p.postcode, addressRegion: "London", addressCountry: "GB" }, amenityFeature: p.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: f, value: true })) }]} />

      <section className="wrap grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-pill border border-line"><FloorPlan plan={p.plan} title={p.title} /></div>
          <div className="grid grid-cols-2 gap-4"><PhotoSlot label="Photo: bedroom, made up" /><PhotoSlot label="Photo: kitchen and living space" /></div>
        </div>
        <div className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="-my-2 text-sm text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · <Link to="/stays" className="inline-flex min-h-11 items-center underline">Stays</Link></nav>
          <div className="flex flex-col gap-2">
            <p className="label text-door">Sample apartment</p>
            <h1 className="text-[36px] sm:text-[44px]">{p.title}</h1>
            <p className="text-mute">{p.area} {p.postcode} · minimum {p.minNights} nights</p>
            <p className="display text-[32px]">£[PRICE] <span className="font-sans text-base font-normal text-mute">per night · £[MONTHLY RATE] for 28 nights or more</span></p>
          </div>
          <Facts items={[[<Icon.Guests key="g" />, `Sleeps ${p.sleeps}`], [<Icon.Bed key="b" />, `${p.beds} bedroom${p.beds > 1 ? "s" : ""}`], [<Icon.Bath key="a" />, `${p.baths} bathroom${p.baths > 1 ? "s" : ""}`]]} />
          <p className="text-[17px]">{p.summary}</p>
          <div className="card p-5"><h2 className="mb-4 font-sans text-base font-semibold tracking-normal">Check dates for this apartment</h2><StayEnquiry stayTitle={p.title} minNights={p.minNights} sleeps={p.sleeps} /></div>
          <div className="border-t border-line">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">What's included</summary><ul className="grid gap-1 pb-4 text-mute sm:grid-cols-2">{p.features.map((f) => <li key={f} className="flex gap-2"><Icon.Check /> {f}</li>)}</ul></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">Check-in, cleaning and deposit</summary><p className="pb-4 text-mute">Check-in from [CHECK-IN TIME], check-out by [CHECK-OUT TIME]. [CLEANING FEE] per stay and a [DEPOSIT] security hold. Cancellation: [CANCELLATION TERMS]. Confirmed by the client before launch.</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">House rules</summary><p className="pb-4 text-mute">No parties or events. [PET POLICY]. [SMOKING POLICY]. Quiet hours respected for the neighbours, who are long-term residents.</p></details>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-8 pb-16 lg:grid-cols-[1fr_2fr]">
        <AreaMap areas={store.areas()} highlight={p.area} className="max-w-sm rounded-pill border border-line" />
        <div className="flex flex-col gap-3"><h2 className="text-[28px] sm:text-[32px]">Getting around from {p.area}</h2><p className="text-mute">[TRANSPORT NOTE: nearest stations, journey times to central London, parking.]</p></div>
      </section>

      <section className="wrap pb-6">
        <h2 className="mb-6 text-[32px] sm:text-[36px]">Other stays</h2>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((x) => <StayCard key={x.handle} p={x} />)}</div>
      </section>
    </div>
  );
}
