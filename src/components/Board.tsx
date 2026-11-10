import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { doorById, type DoorId } from "../data/site";
import { VLink, vt } from "./VLink";

// The site's signature. Each door is a board in its colour, the way a "To let" board reads from the street: the door
// name in big condensed type, one line, one tool. On Home the three stand on the street; on a door's own page the
// board is the page title. The field, the name and the line share view-transition names, so one becomes the other.
export const BOARD_LINE: Record<DoorId, string> = {
  lettings: "Your rented home, looked after.",
  build: "Refurbishments and extensions.",
  stays: "Short stays, booked direct.",
};
const part = (door: DoorId, p: "field" | "name" | "line") => vt(`board-${door}-${p}`);

/** A board on the home street. `children` is the door's one tool; `more` is the plain link under it. */
export function Board({ door, children, more }: { door: DoorId; children: ReactNode; more?: ReactNode }) {
  const d = doorById(door);
  return (
    <article className={`board on-door door-${door}`} aria-labelledby={`board-${door}`}>
      <div className="board-field" style={part(door, "field")} aria-hidden="true" />
      <div className="flex flex-col gap-1.5">
        <h2 id={`board-${door}`} className="leading-none"><VLink to={d.path} className="board-name" style={part(door, "name")}>{d.name}</VLink></h2>
        <p className="board-line"><span className="inline-block" style={part(door, "line")}>{BOARD_LINE[door]}</span></p>
      </div>
      {children}
      {more}
    </article>
  );
}

/** The same board as a page title: the door's colour takes the band under the header (and the header itself). */
export function DoorBand({ door, lede, note, children, wide = false }: { door: DoorId; lede: ReactNode; note?: ReactNode; children: ReactNode; wide?: boolean }) {
  const d = doorById(door);
  return (
    <section className={`on-door door-${door} relative isolate`}>
      <div className="board-field !rounded-none" style={part(door, "field")} aria-hidden="true" />
      <div className={`wrap grid gap-8 pb-10 pt-6 sm:pb-14 sm:pt-10 lg:gap-14 lg:pb-16 ${wide ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"} lg:items-start`}>
        <div className="flex flex-col gap-5">
          <h1 className="door-title">
            <span className="board-name" style={part(door, "name")}>{d.name}</span><span className="sr-only">: </span>
            <span className="board-line" style={part(door, "line")}>{BOARD_LINE[door]}</span>
          </h1>
          <p className="lede">{lede}</p>
          {note && <p className="measure">{note}</p>}
        </div>
        <div className="min-w-0 lg:pt-3">{children}</div>
      </div>
    </section>
  );
}

/** Phones only: a bar with the figure and the next action, shown once the page's own button has scrolled away and
    hidden again when the footer arrives. `early` also shows it before the button has been reached (detail pages). */
export function StickyBar({ watch, children, early = false }: { watch: RefObject<HTMLElement | null>; children: ReactNode; early?: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = watch.current, foot = document.querySelector("footer");
    if (!el || !("IntersectionObserver" in window)) return;
    let away = false, end = false; // away: the button is off screen (above it, or, with `early`, not reached yet)
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.target === el) away = !e.isIntersecting && (early || e.boundingClientRect.bottom < 0); else end = e.isIntersecting; }
      setOn(away && !end);
    });
    io.observe(el); if (foot) io.observe(foot);
    return () => io.disconnect();
  }, [watch, early]);
  return <div className="sticky-bar lg:hidden" data-on={on} inert={!on}>{children}</div>;
}
