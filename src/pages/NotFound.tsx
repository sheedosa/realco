import { Seo } from "../components/Seo";
import { VLink } from "../components/VLink";
import { DOORS } from "../data/site";

export function NotFound() {
  return (
    <section className="on-ink bg-ink text-paper">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <div className="wrap flex flex-col gap-6 py-16 sm:py-24">
        <div className="flex flex-col gap-3"><h1>That page isn't here</h1><p className="lede text-fog">It may have moved. Try one of the three doors.</p></div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {DOORS.map((d) => <li key={d.id}><VLink to={d.path} className={`door-opt door-${d.id}`} style={{ "--focus": "#f5f0e6" } as React.CSSProperties}><span className="display text-[2.5rem] leading-[.9]">{d.name}</span><span>{d.strap}</span></VLink></li>)}
        </ul>
      </div>
    </section>
  );
}
