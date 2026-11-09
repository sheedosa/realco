import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { ManagedCard, ProjectCard, StayCard } from "../components/Cards";
import { AreaMap, Icon, Marque, Skyline } from "../components/Svg";
import { ALSO_ON, BuildQuick, RentQuick, StayEnquiry } from "../components/DoorTools";
import { DOORS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

export function Home() {
  const { openDrawer, last } = useEnquiry();
  return (
    <>
      <Seo title="Property management, building work and short stays in South London" path="/" description="Realco manages rented homes for landlords, refurbishes and extends houses and flats, and runs short stays you can book direct, across South London. Three doors, one team, one number." />

      <section className="on-ink relative overflow-hidden bg-ink text-paper">
        <Skyline className="pointer-events-none absolute bottom-0 right-0 hidden h-auto w-[min(760px,50%)] lg:block" />
        <div className="wrap relative flex flex-col gap-6 pb-0 pt-8 sm:gap-8 sm:pt-16 lg:min-h-[520px] lg:pb-20 lg:pt-20">
          <div className="flex flex-col gap-3 sm:gap-5 lg:max-w-[52%]">
            <p className="label flex items-center gap-3 text-fog"><Marque size={22} doors fill="#f5f0e6" /> {SITE.region} · Lettings · Build · Stays</p>
            <h1 className="text-[40px] sm:text-[52px] lg:text-[56px] xl:text-[66px]">Three doors.<br /> One team.<br className="sm:hidden" /> <span className="sm:whitespace-nowrap">One number.</span></h1>
            <p className="max-w-xl text-[17px] text-fog sm:text-[18px]">We manage rented homes for landlords, refurbish and extend houses and flats, and run short stays you can book direct.<span className="hidden sm:inline"> Whichever door you come through, the same people answer.</span></p>
            <div className="hidden flex-wrap gap-3 pt-1 sm:flex">
              <button type="button" onClick={() => openDrawer()} className="btn btn-paper min-h-14">Talk to Realco</button>
              <a href={`tel:${SITE.phone}`} className="btn btn-outline-paper min-h-14">{SITE.phone}</a>
            </div>
            {last && <p className="text-base text-fog">Your last enquiry ({DOORS.find((d) => d.id === last.door)?.name}: {last.need}) is saved on this device. <button type="button" onClick={() => openDrawer({ door: last.door })} className="inline-flex min-h-11 items-center underline">Send another</button></p>}
          </div>
          <ul className="flex flex-col gap-2 sm:hidden" aria-label="The three doors">
            {DOORS.map((d) => (
              <li key={d.id} className={`door-${d.id} rounded-pill bg-paper text-ink`}>
                <Link to={d.path} className="flex min-h-[68px] items-center gap-3 p-3">
                  <Marque size={34} door={d.id} />
                  <span className="flex min-w-0 flex-1 flex-col"><span className="label text-door">{d.name}</span><span className="text-base leading-snug">{d.strap}</span></span>
                  <span className="text-door" aria-hidden="true"><Icon.Arrow /></span>
                </Link>
              </li>
            ))}
          </ul>
          <Skyline className="-mx-4 h-auto w-[calc(100%+2rem)] max-w-none sm:-mx-8 sm:w-[calc(100%+4rem)] lg:hidden" />
        </div>
      </section>

      {/* The three doors, each with its own tool. Lettings and Build lead; Stays runs as a band beneath. */}
      <section className="wrap grid gap-5 py-12 sm:py-16 lg:grid-cols-12" aria-label="Start here">
        <div className="door-lettings grid gap-6 rounded-pill bg-door-t p-6 sm:p-8 md:grid-cols-[1fr_1fr] lg:col-span-7">
          <div className="flex flex-col gap-3">
            <p className="label flex items-center gap-2 text-door"><Marque size={22} door="lettings" fill="#1c2534" /> Lettings · for landlords</p>
            <h2 className="text-[30px] sm:text-[36px]">Your rented home, looked after.</h2>
            <p className="text-base">Rent collected, repairs arranged, inspections and certificates handled. See what you'd keep.</p>
            <Link to="/lettings" className="label mt-auto inline-flex min-h-11 items-center gap-2 text-door underline">How management works</Link>
          </div>
          <RentQuick />
        </div>
        <div className="door-build flex flex-col gap-4 rounded-pill border border-line border-t-4 border-t-gold p-6 sm:p-8 lg:col-span-5">
          <p className="label flex items-center gap-2 text-door"><Marque size={22} door="build" fill="#1c2534" /> Build</p>
          <h2 className="text-[30px] sm:text-[36px]">Refurbish it, or extend it.</h2>
          <p className="text-base text-mute">Kitchens, bathrooms and whole-house refits; rear and side-return extensions. A site visit, then a written quote.</p>
          <BuildQuick />
          <Link to="/build" className="label inline-flex min-h-11 items-center underline">See projects</Link>
        </div>
        <div className="door-stays flex flex-col gap-5 rounded-pill bg-ink p-6 text-paper sm:p-8 lg:col-span-12 lg:flex-row lg:items-start lg:gap-10">
          <div className="on-ink flex flex-col gap-2 lg:w-[34%]">
            <p className="label flex items-center gap-2 text-fog"><Marque size={22} door="stays" fill="#f5f0e6" /> Stays</p>
            <h2 className="text-[28px] sm:text-[32px]">Short stays, booked direct.</h2>
            <p className="text-base text-fog">{ALSO_ON} Book here and you deal directly with the people who look after the apartment.</p>
          </div>
          <div className="flex-1 rounded-pill bg-paper p-4 text-ink sm:p-5"><StayEnquiry compact /></div>
        </div>
      </section>

      <section className="border-y border-line bg-stone py-16 sm:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <p className="label text-clay">Lettings</p>
            <h2 className="text-[32px] sm:text-[40px]">Homes we look after</h2>
            <p className="text-[17px]">A few of the homes we manage for their owners, with the level of service each one has. Samples in this preview; floor plans drawn to scale.</p>
            <Link to="/lettings" className="btn btn-ink self-start">Management for landlords</Link>
          </div>
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">{store.managed().slice(0, 2).map((p) => <ManagedCard key={p.handle} p={p} />)}</div>
        </div>
      </section>

      <section className="wrap py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="label text-gold">Build</p><h2 className="text-[32px] sm:text-[40px]">Before and after</h2></div>
          <Link to="/build" className="label inline-flex min-h-11 items-center underline">All projects</Link>
        </div>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{store.projects().slice(0, 3).map((p) => <ProjectCard key={p.handle} p={p} />)}</div>
      </section>

      <section className="wrap pb-16 sm:pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="flex flex-col gap-4">
            <p className="label text-teal">Stays</p>
            <h2 className="text-[32px] sm:text-[40px]">Somewhere to stay, a few nights or a month</h2>
            <p className="text-[17px]">Serviced apartments and a family house, cleaned and ready, with a local team on the phone. Sample apartments in this preview.</p>
            <Link to="/stays" className="label inline-flex min-h-11 items-center underline">All stays</Link>
          </div>
          <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">{store.stays().slice(0, 2).map((p) => <StayCard key={p.handle} p={p} />)}</div>
        </div>
      </section>

      <section className="border-t border-line bg-stone py-16 sm:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <p className="label text-mute">Where we work</p>
            <h2 className="text-[32px] sm:text-[44px]">{SITE.region}, street by street.</h2>
            <p className="text-[17px]">The homes we manage, the houses we build on and the apartments we host sit a short drive apart, so a site visit and an inspection can happen in one morning.</p>
            <p className="text-base text-mute">Areas served: {SITE.areasServed}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-base" aria-label="Areas on the map">{store.areas().map((a) => <li key={a.name}>{a.name}</li>)}</ul>
          </div>
          <AreaMap areas={store.areas()} className="max-w-xl rounded-pill border border-line lg:justify-self-end" />
        </div>
      </section>
    </>
  );
}
