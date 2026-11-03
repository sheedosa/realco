import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { DOORS } from "../data/site";

export function NotFound() {
  return (
    <section className="wrap flex flex-col items-center gap-4 py-24 text-center">
      <Seo title="Page not found" path="/404" description="That page isn't here." noindex />
      <h1 className="text-[44px]">That page isn't here</h1>
      <p className="text-mute">It may have moved. Try one of the three doors.</p>
      <div className="flex flex-wrap justify-center gap-3">{DOORS.map((d) => <Link key={d.id} to={d.path} className="btn btn-ghost">{d.name}</Link>)}</div>
    </section>
  );
}
