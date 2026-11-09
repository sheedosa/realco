import { Seo, breadcrumbs } from "../components/Seo";
import { ManagedCard } from "../components/Cards";
import { LandlordCalculator } from "../components/DoorTools";
import { Icon, Slot } from "../components/Svg";
import { SERVICE_LEVELS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

const STEPS: [string, string][] = [
  ["A visit and a plain quote", "We see the home, read the tenancy and tell you which level suits it, with the fee in writing: [FEE SCHEDULE]."],
  ["We take it over", "Tenancy, deposit registration and certificates come across to us. The tenant gets one number to call."],
  ["Every month", "Rent collected and chased, a statement to you, the money in your account by [PAYMENT DAY]."],
  ["When something needs doing", "Repairs arranged and reported back. Bigger jobs can go to our own Build team at [TRADE RATE TERMS]."],
];

export function Lettings() {
  const { openDrawer } = useEnquiry();
  return (
    <div className="door-lettings">
      <Seo title="Property management for landlords in South London" path="/lettings" description="Realco manages rented homes for landlords across South London: rent collection or fully managed, repairs, inspections and compliance. Enter the rent and see what you keep."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Lettings", path: "/lettings" }]), { "@context": "https://schema.org", "@type": "Service", name: "Residential property management for landlords", serviceType: "Property management", audience: { "@type": "Audience", audienceType: "Landlords" }, provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region, offers: SERVICE_LEVELS.map((s) => ({ "@type": "Offer", name: s.name, description: s.includes.join(", ") })) }]} />

      <section className="bg-door-t">
        <div className="wrap grid gap-10 py-10 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-14">
          <div className="flex flex-col gap-4 sm:gap-5">
            <p className="label text-door">Lettings · for landlords</p>
            <h1 className="text-[40px] sm:text-[60px]">Your rented home, looked after.</h1>
            <p className="max-w-xl text-[18px]">Realco manages homes for landlords across {SITE.region}. Rent collected, repairs arranged, inspections and certificates kept up to date, and one team the tenant can call. Enter the rent to see what you keep.</p>
            <p className="max-w-xl text-base text-mute">Fees shown are samples until confirmed; your figure is remembered on this device.</p>
          </div>
          <div className="card p-5 sm:p-6"><LandlordCalculator /></div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex max-w-2xl flex-col gap-3">
          <p className="label text-door">What management covers</p>
          <h2 className="text-[32px] sm:text-[44px]">Two levels. Pick how much you hand over.</h2>
        </div>
        <div className="grid gap-10 md:grid-cols-2">
          {SERVICE_LEVELS.map((s, i) => (
            <div key={s.id} className={`flex flex-col gap-4 border-t-2 pt-5 ${i === 1 ? "border-door" : "border-ink"}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-2xl">{s.name}</h3><span className="text-base text-mute">Fee: [FEE %] of rent</span></div>
              <p className="text-[17px]">{s.note}</p>
              <ul className="flex flex-col gap-2 text-base">{s.includes.map((x) => <li key={x} className="flex gap-2"><span className="text-door"><Icon.Check /></span> {x}</li>)}</ul>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base text-mute">[COMPLIANCE STATEMENT: which checks and certificates are handled at each level, e.g. gas safety, EICR, EPC, deposit registration, Right to Rent.] Member of [REDRESS SCHEME]; client money protection through [CMP PROVIDER].</p>
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3"><p className="label text-door">How it works</p><h2 className="text-[32px] sm:text-[40px]">From the first visit to rent in your account.</h2></div>
            <ol className="flex flex-col border-l-2 border-door">
              {STEPS.map(([t, d]) => (
                <li key={t} className="flex flex-col gap-1 py-4 pl-6 first:pt-1 last:pb-1"><h3 className="text-lg">{t}</h3><p className="text-base text-mute">{d}</p></li>
              ))}
            </ol>
            <button type="button" onClick={() => openDrawer({ door: "lettings", need: "Switching from another agent" })} className="btn btn-ink self-start">Switching from another agent?</button>
          </div>
          <Slot kind="street" tone="paper" line="A row of terraced homes we manage, on a local street" />
        </div>
      </section>

      <section id="managed" className="wrap scroll-mt-24 py-16 sm:py-20">
        <div className="mb-8 flex max-w-2xl flex-col gap-3">
          <p className="label text-door">Homes we look after</p>
          <h2 className="text-[32px] sm:text-[44px]">The kind of homes we manage</h2>
          <p className="text-[17px] text-mute">Flats, mansion blocks and terraced houses, each with the level of service its owner chose. Samples in this preview, with floor plans drawn to scale.</p>
        </div>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{store.managed().map((p) => <ManagedCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap">
        <div className="on-ink flex flex-col gap-6 rounded-pill bg-ink p-8 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div className="flex max-w-xl flex-col gap-2"><h2 className="text-[30px] text-paper sm:text-[36px]">Own a home that needs looking after?</h2><p className="text-base text-fog">Tell us the address and the rent; we come back with a plain quote.</p></div>
          <button type="button" onClick={() => openDrawer({ door: "lettings", need: "A management quote" })} className="btn btn-paper min-h-14 shrink-0">Ask for a management quote</button>
        </div>
      </section>
    </div>
  );
}
