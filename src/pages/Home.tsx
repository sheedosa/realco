import { useEffect, useState } from "react";
import { Seo } from "../components/Seo";
import { Board } from "../components/Board";
import { Ledger, ProjectRow, StayRail } from "../components/Cards";
import { AreaMap, Street } from "../components/Svg";
import { ALSO_ON, BuildQuick, RentQuick, StayEnquiry } from "../components/DoorTools";
import { VLink } from "../components/VLink";
import { DOORS, SITE } from "../data/site";
import { useEnquiry } from "../lib/enquiry";
import { store } from "../lib/store";

// The boards are planted once, when the site first opens. Coming back to Home from a door, they are simply there
// (the shared-element page change is the motion then).
let planted = false;

export function Home() {
  const { openDrawer, last } = useEnquiry();
  const [plant] = useState(() => (planted ? "" : "plant"));
  useEffect(() => { planted = true; }, []);
  const projects = store.projects();
  return (
    <>
      <Seo title="Property management, building work and short stays in South London" path="/" description="Realco manages rented homes for landlords, refurbishes and extends houses and flats, and runs short stays you can book direct, across South London. Three doors, one team, one number." />

      {/* The street: three boards, Lettings and Build first and larger, Stays third. Each carries its own tool. */}
      <section className="on-ink relative isolate overflow-hidden bg-ink text-paper">
        <Street className="pointer-events-none absolute inset-x-0 bottom-0 -z-10" />
        <div className="wrap pt-7 sm:pt-10 lg:pt-12">
          <h1 className="t-hero">Three doors. <br className="lg:hidden" />One team. <br className="sm:hidden" />One number.</h1>
          <div className="mt-4 flex flex-col gap-5 lg:mt-5 lg:flex-row lg:items-end lg:justify-between">
            <p className="lede text-fog">We manage rented homes for landlords, refurbish and extend houses and flats, and run short stays you can book direct.<span className="hidden sm:inline"> Whichever door you come through, the same people answer.</span></p>
            <div className="hidden shrink-0 flex-wrap gap-3 sm:flex">
              <button type="button" onClick={() => openDrawer()} className="btn btn-paper">Talk to Realco</button>
              <a href={`tel:${SITE.phone}`} className="btn btn-line">Call {SITE.phone}</a>
            </div>
          </div>
          {last && <p className="mt-3 text-fog">Your last enquiry ({DOORS.find((d) => d.id === last.door)?.name}: {last.need}) is saved on this device. <button type="button" onClick={() => openDrawer({ door: last.door })} className="link text-paper">Send another</button></p>}

          <div className="boards mt-7 lg:mt-10">
            <div className={`stand stand-lettings ${plant}`} style={{ "--i": 0 } as React.CSSProperties}>
              <Board door="lettings" more={<VLink to="/lettings" className="link self-start">How management works</VLink>}><RentQuick /></Board>
              <span className="post" aria-hidden="true" />
            </div>
            <div className={`stand stand-build ${plant}`} style={{ "--i": 1 } as React.CSSProperties}>
              <Board door="build" more={<VLink to="/build" className="link self-start">See the projects</VLink>}><BuildQuick /></Board>
              <span className="post" aria-hidden="true" />
            </div>
            <div className={`stand stand-stays ${plant}`} style={{ "--i": 2 } as React.CSSProperties}>
              <Board door="stays" more={<VLink to="/stays" className="link self-start">See the apartments</VLink>}><StayEnquiry compact /></Board>
              <span className="post" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Lettings evidence: a ledger, not cards. */}
      <section className="bg-stone"><div className="wrap grid gap-8 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.1fr)] lg:gap-14">
        <div className="flex flex-col gap-4">
          <h2>Homes we look after</h2>
          <p className="measure">A few of the homes we manage for their owners, with the level of service each one has. Samples in this preview.</p>
          <VLink to="/lettings" className="btn btn-ink self-start">Management for landlords</VLink>
        </div>
        <Ledger homes={store.managed().slice(0, 4)} />
      </div></section>

      {/* Build evidence: one project across the full width, the rest as a plain list. */}
      <section className="py-14 sm:py-20">
        <div className="wrap flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
            <h2>Before and after</h2>
            <VLink to="/build" className="link">All {projects.length} sample projects</VLink>
          </div>
          <ProjectRow p={projects[0]} />
          <ul className="grid border-t border-ink sm:grid-cols-3 sm:gap-x-8">
            {projects.slice(1).map((p) => <li key={p.handle} className="border-b border-line py-2 sm:border-b-0"><VLink to={`/build/${p.handle}`} className="tlink">{p.title}</VLink><p className="help">{p.type} in {p.area}</p></li>)}
          </ul>
        </div>
      </section>

      {/* Stays: a rail that runs off the right edge. */}
      <section className="bg-stone py-14 sm:py-20">
        <div className="wrap mb-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end lg:gap-14">
          <h2>Somewhere to stay, a few nights or a month</h2>
          <p className="measure">Serviced apartments and a family house, cleaned and ready, with a local team on the phone. Sample apartments in this preview. {ALSO_ON}</p>
        </div>
        <StayRail stays={store.stays()} />
      </section>

      <section className="on-ink bg-ink py-14 text-paper sm:py-20">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="flex flex-col gap-5">
            <h2>{SITE.region}, street by street.</h2>
            <p className="lede">The homes we manage, the houses we build on and the apartments we host sit a short drive apart, so a site visit and an inspection can happen in one morning.</p>
            <p className="text-fog">Areas served: {SITE.areasServed}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t border-paper/20 pt-4" aria-label="Areas on the map">{store.areas().map((a) => <li key={a.name}>{a.name}</li>)}</ul>
          </div>
          <AreaMap areas={store.areas()} className="max-w-xl rounded-pill lg:justify-self-end" />
        </div>
      </section>
    </>
  );
}
