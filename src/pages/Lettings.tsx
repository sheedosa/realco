import { useRef, useState } from "react";
import { Seo, breadcrumbs } from "../components/Seo";
import { DoorBand, StickyBar } from "../components/Board";
import { Ledger } from "../components/Cards";
import { LandlordCalculator } from "../components/DoorTools";
import { Icon, Slot } from "../components/Svg";
import { SERVICE_LEVELS, SITE, type ServiceLevelId } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { gbp } from "../lib/local";
import { store } from "../lib/store";

const STEPS: [string, string][] = [
  ["A visit and a plain quote", "We see the home, read the tenancy and tell you which level suits it, with the fee in writing: [FEE SCHEDULE]."],
  ["We take it over", "Tenancy, deposit registration and certificates come across to us. The tenant gets one number to call."],
  ["Every month", "Rent collected and chased, a statement to you, the money in your account by [PAYMENT DAY]."],
  ["When something needs doing", "Repairs arranged and reported back. Bigger jobs can go to our own Build team at [TRADE RATE TERMS]."],
];

export function Lettings() {
  const { openDrawer } = useEnquiry();
  const quote = useRef<HTMLButtonElement>(null);
  const [bar, setBar] = useState<{ keep: number | null; level: ServiceLevelId }>({ keep: null, level: "managed" });
  const homes = store.managed();
  return (
    <div className="door-lettings">
      <Seo title="Property management for landlords in South London" path="/lettings" description="Realco manages rented homes for landlords across South London: rent collection or fully managed, repairs, inspections and compliance. Enter the rent and see what you keep."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Lettings", path: "/lettings" }]), { "@context": "https://schema.org", "@type": "Service", name: "Residential property management for landlords", serviceType: "Property management", audience: { "@type": "Audience", audienceType: "Landlords" }, provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region, offers: SERVICE_LEVELS.map((s) => ({ "@type": "Offer", name: s.name, description: s.includes.join(", ") })) }]} />

      <DoorBand door="lettings" lede={<>Realco manages homes for landlords across {SITE.region}. Rent collected, repairs arranged, inspections and certificates kept up to date, and one team the tenant can call.</>}>
        <LandlordCalculator quoteRef={quote} onShown={(keep, level) => setBar({ keep, level })} />
      </DoorBand>

      <section className="wrap py-14 sm:py-20">
        <h2 className="mb-8 max-w-[18ch] sm:mb-10">Two levels. Pick how much you hand over.</h2>
        <div className="grid gap-x-14 gap-y-10 md:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          {SERVICE_LEVELS.map((s, i) => (
            <div key={s.id} className={`flex flex-col gap-3 pt-5 ${i === 1 ? "border-t-4 border-door" : "border-t-4 border-ink"}`}>
              <h3>{s.name}</h3>
              <p className="lede">{s.note}</p>
              <ul className={`mt-1 gap-x-8 ${i === 1 ? "lg:columns-2" : ""}`}>{s.includes.map((x) => <li key={x} className="mb-2 flex break-inside-avoid gap-2"><span className="text-door"><Icon.Check /></span> {x}</li>)}</ul>
              <p className="help mt-1">Fee: [FEE %] of rent</p>
            </div>
          ))}
        </div>
        <p className="help mt-10 max-w-[44em]">[COMPLIANCE STATEMENT: which checks and certificates are handled at each level, e.g. gas safety, EICR, EPC, deposit registration, Right to Rent.] Member of [REDRESS SCHEME]; client money protection through [CMP PROVIDER].</p>
      </section>

      <section className="bg-stone py-14 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
          <div className="flex flex-col gap-6">
            <h2>From the first visit to rent in your account.</h2>
            <Slot kind="street" tone="paper" line="A row of terraced homes we manage, on a local street" className="hidden lg:flex" />
          </div>
          <div className="flex flex-col gap-8">
            <ol className="grid gap-x-10 sm:grid-cols-2">
              {STEPS.map(([t, d]) => <li key={t} className="flex flex-col gap-1.5 border-t border-ink py-5"><h3>{t}</h3><p className="help">{d}</p></li>)}
            </ol>
            <button type="button" onClick={() => openDrawer({ door: "lettings", need: "Switching from another agent" })} className="btn btn-ink self-start">Switching from another agent?</button>
          </div>
        </div>
      </section>

      <section id="managed" className="wrap grid scroll-mt-28 gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] lg:gap-14">
        <div className="flex flex-col gap-4">
          <h2>The kind of homes we manage</h2>
          <p className="measure">Flats, mansion blocks and terraced houses, each with the level of service its owner chose. {homes.length} sample homes in this preview; open a row for its floor plan, drawn to scale.</p>
        </div>
        <Ledger homes={homes} expandable />
      </section>

      <section className="on-ink bg-ink text-paper">
        <div className="wrap flex flex-col gap-6 py-12 sm:py-16 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex flex-col gap-2"><h2>Own a home that needs looking after?</h2><p className="lede text-fog">Tell us the address and the rent; we come back with a plain quote.</p></div>
          <button type="button" onClick={() => openDrawer({ door: "lettings", need: "A management quote" })} className="btn btn-paper shrink-0 self-start md:self-auto">Ask for a management quote</button>
        </div>
      </section>

      <StickyBar watch={quote}>
        <p className="min-w-0 leading-tight">{bar.keep !== null ? <><span className="display block text-[1.75rem] leading-none">{gbp(bar.keep)}</span><span className="small">a month, {SERVICE_LEVELS.find((s) => s.id === bar.level)!.name.toLowerCase()} (sample fee)</span></> : <span>See what you would keep each month</span>}</p>
        <button type="button" onClick={() => openDrawer({ door: "lettings", need: "A management quote" })} className="btn btn-paper shrink-0 px-4">Get a quote</button>
      </StickyBar>
    </div>
  );
}
