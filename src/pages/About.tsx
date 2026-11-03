import { Link } from "react-router-dom";
import { Seo, breadcrumbs } from "../components/Seo";
import { AreaMap, Icon, Marque } from "../components/Svg";
import { DOORS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

export function About() {
  const { openDrawer } = useEnquiry();
  return (
    <>
      <Seo title="About Realco and how to reach us" path="/about" description={`Realco: lettings, short stays and building work across ${SITE.region}, from one team on one number. Address, phone, email and opening hours.`}
        jsonLd={[breadcrumbs([{ name: "Home", path: "/" }, { name: "About and contact", path: "/about" }]), { "@context": "https://schema.org", "@type": "ContactPage", name: "About and contact", mainEntity: { "@id": `${SITE.url}/#business` } }]} />

      <section className="on-ink bg-ink text-paper">
        <div className="wrap grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="flex flex-col gap-5">
            <p className="label text-fog">About Realco</p>
            <h1 className="text-[44px] text-paper sm:text-[64px]">One team that lets, hosts and builds.</h1>
            <p className="max-w-xl text-[18px] text-fog">Most property businesses do one of these. We do three, because they feed each other: a flat we refurbish is a flat we let; a house between tenancies earns as a stay; a landlord with a leak calls the people who fitted the bathroom.</p>
          </div>
          <div className="flex justify-center lg:justify-end"><Marque size={220} doors fill="#f5f0e6" /></div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Call or message</h2><a href={`tel:${SITE.phone}`} className="inline-flex min-h-11 items-center gap-2 text-lg"><Icon.Phone /> {SITE.phone}</a><a href={`mailto:${SITE.email}`} className="inline-flex min-h-11 items-center text-lg underline">{SITE.email}</a><p className="text-mute">{SITE.hours}. One number for lettings, stays and build.</p></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Office</h2><p className="text-lg">{SITE.address}</p><p className="text-mute">Viewings and site visits by appointment across {SITE.areasServed}.</p></div>
        <div className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">Company</h2><p className="text-lg">{SITE.legalName}</p><p className="text-mute">Trading as Realco · Company no. {SITE.companyNumber} · [REDRESS SCHEME] · [CMP PROVIDER] · [ICO REGISTRATION]</p></div>
      </section>

      <section className="bg-stone py-16">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <AreaMap areas={store.areas()} className="max-w-lg rounded-pill border border-line" />
          <div className="flex flex-col gap-4">
            <p className="label text-mute">Areas</p>
            <h2 className="text-[32px] sm:text-[40px]">{SITE.region}: {SITE.areasServed}</h2>
            <p className="text-mute">The map is a sketch, not a boundary. If you are near these places, call; if you are a little further out, call anyway.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {DOORS.map((d) => <Link key={d.id} to={d.path} className={`door-${d.id} flex min-h-24 flex-col justify-between rounded-pill bg-paper p-4 hover:bg-door-t`}><Marque size={28} door={d.id} /><span className="font-semibold">{d.name}</span></Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <div className="mb-8 max-w-2xl"><p className="label text-mute">The people</p><h2 className="text-[32px] sm:text-[40px]">Who answers the phone</h2><p className="mt-3 text-mute">Named contacts for each door, so you speak to the same person each time.</p></div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {["Lettings", "Stays", "Build"].map((d) => <li key={d} className="flex flex-col gap-3 rounded-pill border border-line p-5"><div className="aspect-square w-20 rounded-pill bg-stone" aria-hidden="true" /><p className="label text-mute">{d}</p><p className="text-lg">[TEAM MEMBER NAME]</p><p className="text-sm text-mute">[ROLE AND ONE LINE OF BACKGROUND]</p></li>)}
        </ul>
      </section>

      <section className="wrap">
        <div className="flex flex-col gap-4 rounded-pill bg-stone p-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-[28px] sm:text-[32px]">What clients say</h2><p className="text-mute">[Client review, to come] · [Client review, to come] · [Client review, to come]</p></div>
          <button type="button" onClick={() => openDrawer()} className="btn btn-ink shrink-0">Talk to Realco</button>
        </div>
      </section>
    </>
  );
}
