import { Link } from "react-router-dom";
import { SERVICE_LEVELS } from "../data/site";
import { plural, type ManagedHome, type Project, type Stay } from "../lib/store";
import { FloorPlan, Icon, Slot } from "./Svg";

const bedsLabel = (n: number) => (n === 0 ? "Studio" : plural(n, "bedroom"));
const levelName = (id: string) => SERVICE_LEVELS.find((s) => s.id === id)?.name ?? "";

export function Facts({ items }: { items: [React.ReactNode, string][] }) {
  return <ul className="flex flex-wrap gap-x-4 gap-y-1 text-base text-mute">{items.map(([ic, t]) => <li key={t} className="flex items-center gap-1.5">{ic} {t}</li>)}</ul>;
}

/** A home Realco manages: evidence of the work, not a home to rent. No link, no price. */
export function ManagedCard({ p }: { p: ManagedHome }) {
  return (
    <article className="door-lettings flex flex-col gap-3">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-pill border border-line bg-stone px-2 pb-2 pt-11"><FloorPlan compact plan={p.plan} title={p.title} className="!h-full !w-full" /><span className="label absolute left-3 top-3 rounded-pill bg-paper px-2 py-1.5 text-door">Sample · {levelName(p.level)}</span></div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg">{p.title}</h3>
        <p className="text-base text-mute">{p.area} {p.postcode} · {bedsLabel(p.beds)} · {plural(p.baths, "bathroom")}</p>
      </div>
    </article>
  );
}

export function StayCard({ p }: { p: Stay }) {
  return (
    <Link to={`/stays/${p.handle}`} className="door-stays group flex flex-col gap-3">
      <div className="grid aspect-[16/10] grid-cols-[3fr_2fr] gap-1.5">
        <Slot kind="room" line={p.photo} label={`Sample · from ${p.minNights} nights`} ratio="h-full" />
        <div className="flex items-center justify-center overflow-hidden rounded-pill border border-line bg-stone p-2"><FloorPlan compact plan={{ ...p.plan, rooms: p.plan.rooms.map((r) => ({ ...r, name: "" })) }} title={`${p.title}, outline`} className="!h-full !w-full" /></div>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg group-hover:underline">{p.title}</h3>
        <p className="text-base text-mute">{p.area} {p.postcode} · <b className="text-ink">£[PRICE]</b> a night</p>
        <Facts items={[[<Icon.Guests key="g" />, `Sleeps ${p.sleeps}`], [<Icon.Bed key="b" />, bedsLabel(p.beds)]]} />
      </div>
    </Link>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  const k = p.type === "Extension" ? "extension" : "refurb";
  return (
    <Link to={`/build/${p.handle}`} className="door-build group flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-1.5">
        <Slot kind={`${k}-before`} label="Before" line={p.before} compact tone="stone" ratio="aspect-square" />
        <Slot kind={`${k}-after`} label="After" line={p.after} compact ratio="aspect-square" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="label text-door">Sample · {p.type}</p>
        <h3 className="text-lg group-hover:underline">{p.title}</h3>
        <p className="text-base text-mute">{p.area} · {p.size} · {p.duration}</p>
      </div>
    </Link>
  );
}
