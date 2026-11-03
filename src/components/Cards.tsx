import { Link } from "react-router-dom";
import type { Letting, Project, Stay } from "../lib/store";
import { FloorPlan, Icon } from "./Svg";

const bedsLabel = (n: number) => (n === 0 ? "Studio" : `${n} bed`);

export function Facts({ items }: { items: [React.ReactNode, string][] }) {
  return <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-mute">{items.map(([ic, t]) => <li key={t} className="flex items-center gap-1.5">{ic} {t}</li>)}</ul>;
}

export function ListingCard({ p }: { p: Letting }) {
  return (
    <Link to={`/lettings/${p.handle}`} className="lift door-lettings group flex flex-col gap-3">
      <div className="relative flex aspect-[4/3] items-center overflow-hidden rounded-pill border border-line bg-stone"><FloorPlan plan={p.plan} title={p.title} className="max-h-full" /><span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-[11px] text-door">Sample · {p.furnished ? "Furnished" : "Unfurnished"}</span></div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg group-hover:underline">{p.title}</h3>
        <p className="text-sm text-mute">{p.area} {p.postcode} · £[PRICE] pcm</p>
        <Facts items={[[<Icon.Bed key="b" />, bedsLabel(p.beds)], [<Icon.Bath key="a" />, `${p.baths} bath`], [<Icon.Area key="s" />, `${p.sqft} sq ft`]]} />
      </div>
    </Link>
  );
}

export function StayCard({ p }: { p: Stay }) {
  return (
    <Link to={`/stays/${p.handle}`} className="lift door-stays group flex flex-col gap-3">
      <div className="relative flex aspect-[4/3] items-center overflow-hidden rounded-pill border border-line bg-stone"><FloorPlan plan={p.plan} title={p.title} className="max-h-full" /><span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-[11px] text-door">Sample · from {p.minNights} nights</span></div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg group-hover:underline">{p.title}</h3>
        <p className="text-sm text-mute">{p.area} {p.postcode} · <b className="text-ink">£[PRICE]</b> per night</p>
        <Facts items={[[<Icon.Guests key="g" />, `Sleeps ${p.sleeps}`], [<Icon.Bed key="b" />, bedsLabel(p.beds)], [<Icon.Bath key="a" />, `${p.baths} bath`]]} />
      </div>
    </Link>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link to={`/build/${p.handle}`} className="lift door-build group flex flex-col gap-3">
      <div className="relative flex aspect-[4/3] items-center overflow-hidden rounded-pill border border-line bg-stone"><FloorPlan plan={p.plan} title={`${p.title}, new rooms shaded`} className="max-h-full" /><span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-[11px] text-door">Sample · {p.type}</span></div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg group-hover:underline">{p.title}</h3>
        <p className="text-sm text-mute">{p.area} · {p.size} · {p.duration}</p>
      </div>
    </Link>
  );
}
