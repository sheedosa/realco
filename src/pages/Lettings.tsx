import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { ListingCard, Facts } from "../components/Cards";
import { LandlordCalculator } from "../components/DoorTools";
import { AreaMap, FloorPlan, Icon, PhotoSlot } from "../components/Svg";
import { NotFound } from "./NotFound";
import { PRICE_BANDS, SERVICE_LEVELS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

const tog = <T,>(set: (f: (x: T[]) => T[]) => void, v: T) => set((x) => (x.includes(v) ? x.filter((y) => y !== v) : [...x, v]));
const Check = ({ on, onChange, children }: { on: boolean; onChange: () => void; children: React.ReactNode }) => (
  <label className="-mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-pill px-2 text-sm hover:bg-stone"><input type="checkbox" checked={on} onChange={onChange} className="h-11 w-5 shrink-0 accent-[#9a4429]" /> {children}</label>
);

export function Lettings() {
  const { openDrawer } = useEnquiry();
  const [beds, setBeds] = useState<number[]>([]);
  const [band, setBand] = useState<number[]>([]);
  const [area, setArea] = useState<string[]>([]);
  const [furnished, setFurnished] = useState<boolean | null>(null);
  const all = store.lettings();
  const list = store.lettings({ beds, band, area, furnished });
  const areas = [...new Set(all.map((p) => p.area))].sort();
  const clear = () => { setBeds([]); setBand([]); setArea([]); setFurnished(null); };

  return (
    <div className="door-lettings">
      <Seo title="Lettings and property management in South London" path="/lettings" description="Let only, rent collection or fully managed: see what you would keep from your rent. Tenants: homes to rent across South London with viewings booked in one step."
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Lettings", path: "/lettings" }]), { "@context": "https://schema.org", "@type": "Service", name: "Residential lettings and property management", provider: { "@id": `${SITE.url}/#business` }, areaServed: SITE.region, offers: SERVICE_LEVELS.map((s) => ({ "@type": "Offer", name: s.name, description: s.includes.join(", ") })) }]} />

      <section className="bg-door-t">
        <div className="wrap grid items-end gap-8 py-14 sm:py-20 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-door">Lettings</p>
            <h1 className="text-[44px] sm:text-[64px]">Let it well, or find the one.</h1>
            <p className="max-w-xl text-[18px]">For landlords: three service levels, fees shown as a share of rent, and a calculator that tells you what lands in your account. For tenants: homes across {SITE.region}, and a viewing requested in one step.</p>
            <div className="flex flex-wrap gap-3"><a href="#landlords" className="btn btn-door">I'm a landlord</a><a href="#rent" className="btn btn-ghost">I'm looking to rent</a></div>
          </div>
          <div className="hidden lg:block"><p className="display text-[160px] leading-none text-door" aria-hidden="true">3</p><p className="label text-mute">service levels, one team</p></div>
        </div>
      </section>

      <section id="landlords" className="wrap scroll-mt-24 py-16 sm:py-20">
        <div className="mb-8 flex max-w-2xl flex-col gap-3">
          <p className="label text-door">For landlords</p>
          <h2 className="text-[32px] sm:text-[44px]">Enter the rent. See what you keep.</h2>
          <p className="text-[17px] text-mute">Pick a service level and the figure updates. The percentages are samples until the client confirms the fee schedule; the mechanics are real and your figure is remembered on this device.</p>
        </div>
        <LandlordCalculator />
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <p className="label text-door">How letting with Realco works</p>
            <h2 className="text-[32px] sm:text-[40px]">From valuation to rent in the bank.</h2>
            <p className="text-mute">[COMPLIANCE STATEMENT: which checks and certificates are handled at each level, e.g. gas safety, EICR, EPC, deposit registration, Right to Rent.] Member of [REDRESS SCHEME]; client money protection through [CMP PROVIDER].</p>
            <PhotoSlot label="Photo: a row of terraced houses on a local street" className="mt-2" />
          </div>
          <ol className="grid gap-6 sm:grid-cols-2">
            {[["Valuation", "We visit, compare recent lets on your street and suggest a rent and a strategy: long let, or short stays while you decide."],
              ["Marketing", "Floor plan, photographs and listing on [PORTALS] within [DAYS] days. [VIEWINGS MODEL]."],
              ["Referencing and move-in", "Tenants referenced, deposit registered, inventory done, keys handed over against a signed agreement."],
              ["Managing", "Rent collected and chased, repairs through our own Build team at [TRADE RATE TERMS], inspections and renewals handled."]].map(([t, d], i) => (
              <li key={t} className="flex flex-col gap-2 rounded-pill bg-paper p-5"><p className="label text-door">Step {i + 1}</p><h3 className="text-lg">{t}</h3><p className="text-sm text-mute">{d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section id="rent" className="wrap scroll-mt-24 flex flex-col gap-4 pb-6 pt-16 sm:pt-20">
        <p className="label text-door">For tenants</p>
        <h2 className="text-[32px] sm:text-[44px]">Homes to rent in {SITE.region}</h2>
        <p className="max-w-2xl text-[17px] text-mute">Sample listings with floor plans drawn to scale. Request a viewing from any property; we reply with times, and one message covers every home you like.</p>
      </section>

      <section className="wrap grid gap-10 pb-10 lg:grid-cols-[240px_1fr]">
        <aside aria-label="Filters" className="flex flex-col gap-7">
          <fieldset className="flex flex-col gap-1"><legend className="label mb-2 text-mute">Bedrooms</legend>
            {[[0, "Studio"], [1, "1 bed"], [2, "2 bed"], [3, "3+ bed"]].map(([v, l]) => <Check key={l} on={beds.includes(v as number)} onChange={() => tog(setBeds, v as number)}>{l} <span className="text-mute">({all.filter((p) => Math.min(p.beds, 3) === v).length})</span></Check>)}
          </fieldset>
          <fieldset className="flex flex-col gap-1"><legend className="label mb-2 text-mute">Price band</legend>
            {PRICE_BANDS.map((b) => <Check key={b.id} on={band.includes(b.id)} onChange={() => tog(setBand, b.id)}>{b.label}</Check>)}
          </fieldset>
          <fieldset className="flex flex-col gap-1"><legend className="label mb-2 text-mute">Area</legend>
            {areas.map((a) => <Check key={a} on={area.includes(a)} onChange={() => tog(setArea, a)}>{a} <span className="text-mute">({all.filter((p) => p.area === a).length})</span></Check>)}
          </fieldset>
          <fieldset className="flex flex-col gap-1"><legend className="label mb-2 text-mute">Furnished</legend>
            <div className="grid grid-cols-3 gap-1.5">{([["Any", null], ["Yes", true], ["No", false]] as const).map(([l, v]) => <button key={l} type="button" aria-pressed={furnished === v} onClick={() => setFurnished(v)} className={`chip justify-center px-2 ${furnished === v ? "" : "border-line"}`}>{l}</button>)}</div>
          </fieldset>
          <div className="flex flex-col gap-2 rounded-pill bg-door-t p-4">
            <p className="text-sm font-semibold">Nothing right yet?</p>
            <p className="text-sm text-mute">Tell us what you need and we'll send new homes before they reach the portals.</p>
            <button type="button" onClick={() => openDrawer({ door: "lettings", role: "I'm looking to rent", need: "Register for new listings" })} className="label inline-flex min-h-11 items-center text-door underline">Register</button>
          </div>
        </aside>
        <div className="min-w-0">
          <p className="mb-5 text-sm text-mute" aria-live="polite">{list.length} {list.length === 1 ? "home" : "homes"} · sample listings</p>
          {list.length ? <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <ListingCard key={p.handle} p={p} />)}</div>
            : <div className="rounded-pill bg-stone p-8 text-center"><p>Nothing matches those filters.</p><button type="button" onClick={clear} className="btn btn-ghost mt-4">Clear filters</button></div>}
        </div>
      </section>
    </div>
  );
}

export function PropertyPage() {
  const { handle = "" } = useParams();
  const p = store.letting(handle);
  const { openDrawer } = useEnquiry();
  if (!p) return <NotFound />;
  const path = `/lettings/${p.handle}`;
  const related = store.lettings().filter((x) => x.handle !== p.handle).slice(0, 3);
  return (
    <div className="door-lettings">
      <Seo title={`${p.title}, ${p.area} ${p.postcode}`} path={path} description={`${p.title} to rent in ${p.area}: ${p.summary} Request a viewing with Realco.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "Lettings", path: "/lettings" }, { name: p.title, path }]),
          { "@context": "https://schema.org", "@type": "Accommodation", name: p.title, description: p.summary, numberOfBedrooms: p.beds, numberOfBathroomsTotal: p.baths, floorSize: { "@type": "QuantitativeValue", value: p.sqft, unitCode: "FTK" }, address: { "@type": "PostalAddress", addressLocality: p.area, postalCode: p.postcode, addressRegion: "London", addressCountry: "GB" } }]} />

      <section className="wrap grid gap-10 pb-16 pt-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14 lg:pt-10">
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-pill border border-line"><FloorPlan plan={p.plan} title={p.title} /></div>
          <div className="grid grid-cols-2 gap-4"><PhotoSlot label="Photo: living room" /><PhotoSlot label="Photo: kitchen" /></div>
        </div>
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Breadcrumb" className="-my-2 text-sm text-mute"><Link to="/" className="inline-flex min-h-11 items-center underline">Home</Link> · <Link to="/lettings#rent" className="inline-flex min-h-11 items-center underline">Lettings</Link></nav>
          <div className="flex flex-col gap-2">
            <p className="label text-door">Sample listing · {p.type}</p>
            <h1 className="text-[36px] sm:text-[44px]">{p.title}</h1>
            <p className="text-mute">{p.area} {p.postcode} · {p.furnished ? "Furnished" : "Unfurnished"} · Available {p.available}</p>
            <p className="display text-[32px]">£[PRICE] <span className="font-sans text-base font-normal text-mute">per calendar month</span></p>
          </div>
          <Facts items={[[<Icon.Bed key="b" />, p.beds === 0 ? "Studio" : `${p.beds} bedrooms`], [<Icon.Bath key="a" />, `${p.baths} bathroom${p.baths > 1 ? "s" : ""}`], [<Icon.Area key="s" />, `${p.sqft} sq ft`]]} />
          <p className="text-[17px]">{p.summary}</p>
          <div className="flex flex-col gap-3">
            <button type="button" onClick={() => openDrawer({ door: "lettings", role: "I'm looking to rent", need: "Book a viewing", about: `${p.title}, ${p.area} ${p.postcode}` })} className="btn btn-door min-h-14">Request a viewing</button>
            <a href={`tel:${SITE.phone}`} className="btn btn-ghost">Call {SITE.phone}</a>
            <p className="text-center text-sm text-mute">Concept preview: a sample home. Nothing is booked.</p>
          </div>
          <div className="border-t border-line">
            <details open className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">Features</summary><ul className="grid gap-1 pb-4 text-mute sm:grid-cols-2">{p.features.map((f) => <li key={f} className="flex gap-2"><Icon.Check /> {f}</li>)}</ul></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">Key facts</summary><dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 pb-4 text-mute"><dt>Deposit</dt><dd>[DEPOSIT] (protected with [DEPOSIT SCHEME])</dd><dt>Minimum term</dt><dd>[MINIMUM TERM]</dd><dt>Council tax</dt><dd>Band [BAND]</dd><dt>EPC</dt><dd>[EPC RATING]</dd></dl></details>
            <details className="border-b border-line"><summary className="flex min-h-12 cursor-pointer items-center font-semibold">Fees for tenants</summary><p className="pb-4 text-mute">[TENANT FEES STATEMENT: the permitted payments this agency charges under the Tenant Fees Act 2019, holding deposit terms and deposit cap.] Confirmed by the client before launch.</p></details>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-8 pb-16 lg:grid-cols-[1fr_2fr]">
        <AreaMap areas={store.areas()} highlight={p.area} className="max-w-sm rounded-pill border border-line" />
        <div className="flex flex-col gap-3"><h2 className="text-[28px] sm:text-[32px]">Around {p.area}</h2><p className="text-mute">[LOCAL AREA NOTE: transport, shops, parks and schools near this home, written by the team that let it.]</p><p className="text-mute">Owner of a similar home? <Link to="/lettings#landlords" className="underline">See what you would keep</Link> letting it through Realco.</p></div>
      </section>

      <section className="wrap pb-6">
        <h2 className="mb-6 text-[32px] sm:text-[36px]">More homes to rent</h2>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{related.map((x) => <ListingCard key={x.handle} p={x} />)}</div>
      </section>
    </div>
  );
}
