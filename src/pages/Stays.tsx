import { useRef } from "react";
import { useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { DoorBand, StickyBar } from "../components/Board";
import { StayRail } from "../components/Cards";
import { ALSO_ON, StayEnquiry } from "../components/DoorTools";
import { AreaMap, FloorPlan, Icon, Slot } from "../components/Svg";
import { VLink, vt } from "../components/VLink";
import { NotFound } from "./NotFound";
import { SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { plural, store } from "../lib/store";

const NUM = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
const toForm = (form: HTMLFormElement | null) => { form?.scrollIntoView({ block: "center" }); form?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }); };

export function Stays() {
  const { openDrawer } = useEnquiry();
  const form = useRef<HTMLFormElement>(null);
  const stays = store.stays();
  return (
    <div className="door-stays">
      <Seo title="Short stays in South London, booked direct" path="/stays" description="Serviced apartments and a family house in South London for a few nights or a few months. Book direct with Realco: enter dates and guests and we confirm availability and price by reply."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Stays", path: "/stays" }]), { "@context": "https://schema.org", "@type": "Service", name: "Short stays and serviced apartments, booked direct", serviceType: "Serviced accommodation", provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region }]} />

      <DoorBand door="stays" lede={<>Serviced apartments and a family house in {SITE.region}, cleaned and ready, for a few nights or a working month. Book here and you deal directly with the team that looks after the place.</>} note={<>{ALSO_ON} The same apartments, booked straight with us.</>}>
        <StayEnquiry formRef={form} />
      </DoorBand>

      <section className="py-14 sm:py-20">
        <div className="wrap mb-8 flex flex-col gap-2"><h2>{NUM[stays.length] ?? stays.length} places to stay</h2><p className="help">Sample apartments in this preview. Prices per night are confirmed by reply.</p></div>
        <StayRail stays={stays} />
      </section>

      <section className="bg-stone py-14 sm:py-20">
        <div className="wrap grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <h2>Why book direct</h2>
            <ul className="border-t border-ink">
              <li className="flex gap-3 border-b border-line py-3"><span className="text-door"><Icon.Check /></span> One local team from enquiry to check-out, on {SITE.phone}.</li>
              <li className="flex gap-3 border-b border-line py-3"><span className="text-door"><Icon.Check /></span> Questions answered before you book, by the people who clean the apartment.</li>
              <li className="flex gap-3 border-b border-line py-3"><span className="text-door"><Icon.Check /></span> [DIRECT BOOKING BENEFIT, e.g. a rate or a perk for booking here].</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="t-sub">Longer stays and groups</h2>
            <p>Between homes, during building work, or relocating a team: [MONTHLY RATE TERMS]. Group and corporate stays are arranged by one person, with invoicing and [CORPORATE TERMS] on request.</p>
            <button type="button" onClick={() => openDrawer({ door: "stays", need: "A corporate or relocation stay" })} className="btn btn-ink self-start">Ask about a longer stay</button>
          </div>
        </div>
      </section>

      <StickyBar watch={form}>
        <p className="min-w-0 leading-tight">Book direct: we confirm by reply</p>
        <button type="button" onClick={() => toForm(form.current)} className="btn btn-paper shrink-0 px-4">Check dates</button>
      </StickyBar>
    </div>
  );
}

export function StayPage() {
  const { handle = "" } = useParams();
  const p = store.stay(handle);
  const form = useRef<HTMLFormElement>(null);
  if (!p) return <NotFound />;
  const path = `/stays/${p.handle}`;
  const related = store.stays().filter((x) => x.handle !== p.handle);
  return (
    <div className="door-stays">
      <Seo title={`${p.title}, ${p.area}`} path={path} description={`${p.title} in ${p.area}: sleeps ${p.sleeps}, ${plural(p.beds, "bedroom")}, minimum ${p.minNights} nights. Book direct with Realco. ${p.summary}`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Stays", path: "/stays" }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "LodgingBusiness", name: `${p.title} by Realco`, description: p.summary, address: { "@type": "PostalAddress", addressLocality: p.area, postalCode: p.postcode, addressRegion: "London", addressCountry: "GB" }, amenityFeature: p.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: f, value: true })) }]} />

      <section className="wrap grid gap-x-14 gap-y-6 pb-14 pt-2 sm:pb-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:pt-6">
        <div className="flex flex-col gap-5 lg:order-2">
          <div className="flex flex-col gap-3">
            <nav aria-label="Breadcrumb" className="help"><VLink to="/stays" className="link">Stays</VLink>, sample apartment</nav>
            <h1>{p.title}</h1>
            <p className="lede">{p.area} {p.postcode}. Sleeps {p.sleeps}, {plural(p.beds, "bedroom")}, {plural(p.baths, "bathroom")}.</p>
          </div>
          <Slot kind="room" line={p.photo} className="lg:hidden" style={vt(`stay-${p.handle}`)} />
          <p className="measure">{p.summary}</p>
          <div className="flex flex-col gap-4 border-t-4 border-door pt-5">
            <div className="flex flex-col gap-1">
              <h2 className="t-sub">Book this apartment direct</h2>
              <p><b>£[PRICE]</b> a night, or <b>£[MONTHLY RATE]</b> for a month or more. Minimum {p.minNights} nights.</p>
            </div>
            <StayEnquiry stacked stayTitle={p.title} minNights={p.minNights} sleeps={p.sleeps} formRef={form} />
          </div>
          <div className="border-t border-ink">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">What's included</summary><ul className="grid gap-x-6 gap-y-1.5 pb-4 sm:grid-cols-2">{p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-door"><Icon.Check /></span> {f}</li>)}</ul></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">Check-in, cleaning and deposit</summary><p className="help pb-4">Check-in from [CHECK-IN TIME], check-out by [CHECK-OUT TIME]. [CLEANING FEE] per stay and a [DEPOSIT] security hold. Cancellation: [CANCELLATION TERMS].</p></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">House rules</summary><p className="help pb-4">No parties or events. [PET POLICY]. [SMOKING POLICY]. Quiet hours respected for the neighbours.</p></details>
          </div>
        </div>
        <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:order-1 lg:self-start">
          <Slot kind="room" line={p.photo} className="hidden lg:flex" style={vt(`stay-${p.handle}`)} />
          <figure className="flex flex-col gap-2">
            <div className="overflow-hidden rounded-pill bg-stone p-2"><FloorPlan plan={p.plan} title={p.title} /></div>
            <figcaption className="small help">Floor plan, drawn to scale.</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-stone py-14 sm:py-16">
        <div className="wrap grid gap-8 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:items-center sm:gap-12">
          <AreaMap areas={store.areas()} highlight={p.area} className="max-w-[18rem] rounded-pill" />
          <div className="flex flex-col gap-3"><h2>Getting around from {p.area}</h2><p className="help measure">[TRANSPORT NOTE: nearest stations, journey times to central London, parking.]</p><p className="help">{ALSO_ON}</p></div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="wrap"><h2 className="mb-6">Other stays</h2></div>
        <StayRail stays={related} />
      </section>

      <StickyBar watch={form} early>
        <p className="min-w-0 leading-tight"><span className="block"><b>£[PRICE]</b> a night</span><span className="small">Minimum {p.minNights} nights</span></p>
        <button type="button" onClick={() => toForm(form.current)} className="btn btn-paper shrink-0 px-4">Check dates</button>
      </StickyBar>
    </div>
  );
}
