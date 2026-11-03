import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ListingCard, ProjectCard, StayCard } from "../components/Cards";
import { AreaMap, Icon, Marque, PhotoSlot, Skyline } from "../components/Svg";
import { RENT_KEY, STAY_KEY, type RentSaved, type StaySaved, nightsBetween } from "../components/DoorTools";
import { DOORS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { gbp, readLocal } from "../lib/local";
import { store } from "../lib/store";

export function Home() {
  const { openDrawer, last } = useEnquiry();
  const rent = readLocal<RentSaved | null>(RENT_KEY, null);
  const stay = readLocal<StaySaved | null>(STAY_KEY, null);
  const hint: Record<string, string | null> = {
    lettings: rent ? `Your calculation: ${gbp(rent.rent)} pcm` : null,
    stays: stay?.checkIn && stay.checkOut ? `Your dates: ${nightsBetween(stay.checkIn, stay.checkOut)} nights, ${stay.guests} guests` : null,
    build: null,
  };
  return (
    <>
      <Seo title="Lettings, short stays and building work in South London" path="/" description="Realco lets and manages homes, runs short-term stays and builds extensions, lofts and refurbishments across South London. Three doors, one team, one number." />

      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <Skyline className="pointer-events-none absolute bottom-0 right-0 hidden h-[260px] w-[560px] text-paper/20 lg:block" />
        <div className="wrap relative flex flex-col gap-10 py-14 sm:py-20">
          <div className="flex max-w-3xl flex-col gap-5">
            <p className="label flex items-center gap-3 text-fog"><Marque size={22} doors fill="#f5f0e6" /> {SITE.region} · Lettings · Stays · Build</p>
            <h1 className="text-[44px] sm:text-[64px] lg:text-[72px]">Three doors. One team. One number.</h1>
            <p className="max-w-xl text-[18px] text-fog">Let your property, book a serviced stay, or build the extension. Whichever door you come through, the same people answer, and one call covers all three.</p>
            <div className="flex flex-wrap gap-3 pt-1">
              <button type="button" onClick={() => openDrawer()} className="btn btn-paper min-h-14">Talk to Realco</button>
              <a href={`tel:${SITE.phone}`} className="btn btn-outline-paper min-h-14">{SITE.phone}</a>
            </div>
          </div>
          <ul className="grid gap-3 md:grid-cols-3" aria-label="The three doors">
            {DOORS.map((d) => (
              <li key={d.id} className={`door-${d.id} flex flex-col gap-4 rounded-pill bg-paper p-5 text-ink sm:p-6`}>
                <div className="flex items-center justify-between"><Marque size={40} door={d.id} /><span className="label text-door">{d.name}</span></div>
                <h2 className="font-sans text-xl font-semibold tracking-normal">{d.strap}.</h2>
                {hint[d.id] && <p className="text-sm text-mute">{hint[d.id]}</p>}
                <div className="mt-auto flex flex-wrap gap-2">
                  <Link to={d.path} className="btn btn-door flex-1">Open {d.name}</Link>
                  <button type="button" onClick={() => openDrawer({ door: d.id })} className="btn btn-ghost" aria-label={`Talk to Realco about ${d.name}`}><Icon.Chat /></button>
                </div>
              </li>
            ))}
          </ul>
          {last && <p className="text-sm text-fog">Your last enquiry ({DOORS.find((d) => d.id === last.door)!.name}: {last.need}) is saved on this device. <button type="button" onClick={() => openDrawer({ door: last.door })} className="underline">Send another</button></p>}
        </div>
      </section>

      <section className="wrap grid gap-8 border-b border-line py-14 sm:grid-cols-3">
        {[
          ["One contact", "A landlord whose tenant has moved out can have the flat refurbished, let again, or filled with short stays while the market settles, from one phone call."],
          ["Local to the street", `We work across ${SITE.region}, in ${SITE.areasServed}, and we know which roads let in a week and which need a fresh kitchen first.`],
          ["Honest numbers", "Fees shown as a share of rent, prices per night, quotes in writing. If a figure is not confirmed yet, the page says so."],
        ].map(([t, d]) => <div key={t} className="flex flex-col gap-2 border-t border-ink pt-5"><h2 className="label font-sans text-mute">{t}</h2><p className="text-[17px]">{d}</p></div>)}
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="label text-clay">Lettings</p><h2 className="text-[32px] sm:text-[40px]">Homes to rent</h2></div>
          <Link to="/lettings#rent" className="label inline-flex min-h-11 items-center underline">All lettings</Link>
        </div>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{store.lettings().slice(0, 3).map((p) => <ListingCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="bg-stone py-16 sm:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-mute">Where we work</p>
            <h2 className="text-[32px] sm:text-[44px]">{SITE.region}, street by street.</h2>
            <p className="text-[17px]">Our lettings, stays and building work all sit within a short drive of each other, so a viewing, a check-in and a site visit can happen in one morning. Areas: {SITE.areasServed}.</p>
            <ul className="flex flex-wrap gap-2">{store.areas().map((a) => <li key={a.name} className="chip border-line bg-paper">{a.name}</li>)}</ul>
            <Link to="/about" className="btn btn-ink self-start">About and contact</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <AreaMap areas={store.areas()} className="rounded-pill border border-line" />
            <PhotoSlot label="Photo: a terraced street in the area" ratio="aspect-square" />
          </div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="label text-teal">Stays</p><h2 className="text-[32px] sm:text-[40px]">Serviced stays, nightly or monthly</h2></div>
          <Link to="/stays" className="label inline-flex min-h-11 items-center underline">All stays</Link>
        </div>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">{store.stays().map((p) => <StayCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap pb-16 sm:pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="label text-gold">Build</p><h2 className="text-[32px] sm:text-[40px]">Recent projects</h2></div>
          <Link to="/build" className="label inline-flex min-h-11 items-center underline">All projects</Link>
        </div>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{store.projects().slice(0, 3).map((p) => <ProjectCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap">
        <div className="on-ink flex flex-col gap-6 rounded-pill bg-ink p-8 text-paper sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div className="flex max-w-xl flex-col gap-2"><h2 className="text-[32px] text-paper sm:text-[40px]">Not sure which door?</h2><p className="text-fog">Start anywhere. The drawer asks which door, what you need and when suits you; the same team picks it up.</p></div>
          <button type="button" onClick={() => openDrawer()} className="btn btn-paper min-h-14 shrink-0">Talk to Realco</button>
        </div>
      </section>
    </>
  );
}
