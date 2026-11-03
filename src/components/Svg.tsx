import type { Area, Plan } from "../lib/store";
import type { DoorId } from "../data/site";

const DOOR_HEX: Record<DoorId, string> = { lettings: "#9a4429", stays: "#1b6561", build: "#79570b" };

/** Roof over three bricks. `door` lights one brick; `doors` lights all three. */
export function Marque({ size = 32, door, doors = false, fill = "currentColor", className = "" }: { size?: number; door?: DoorId; doors?: boolean; fill?: string; className?: string }) {
  const order: DoorId[] = ["lettings", "stays", "build"];
  const brick = (i: number) => (doors ? DOOR_HEX[order[i]] : door && order[i] === door ? DOOR_HEX[door] : fill);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M11 32L32 12L53 32" fill="none" stroke={fill} strokeWidth="5" strokeLinecap="square" />
      {[0, 1, 2].map((i) => <rect key={i} x={14 + i * 13.75} y="38" width="11.5" height="13" fill={brick(i)} />)}
    </svg>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const I = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className={`shrink-0 ${className}`} {...stroke}>{children}</svg>;
export const Icon = {
  Bed: () => <I><path d="M3 18v-8h18v8M3 14h18M5 10V6h6v4M11 10V7h8v3" /></I>,
  Bath: () => <I><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3ZM6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" /></I>,
  Area: () => <I><path d="M4 4h16v16H4zM4 9h5V4M15 20v-5h5" /></I>,
  Key: () => <I><circle cx="8" cy="12" r="4" /><path d="M12 12h9M18 12v3M15 12v2" /></I>,
  Roof: () => <I><path d="M3 12l9-8 9 8M6 10v9h12v-9M10 19v-5h4v5" /></I>,
  Brick: () => <I><path d="M3 6h18v12H3zM3 12h18M9 6v6M15 12v6" /></I>,
  Calendar: () => <I><path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" /></I>,
  Guests: () => <I><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20a6 6 0 0 1 12 0M15 20a5 5 0 0 1 6-4.8" /></I>,
  Pin: () => <I><path d="M12 21s-6-6.5-6-11a6 6 0 0 1 12 0c0 4.5-6 11-6 11Z" /><circle cx="12" cy="10" r="2" /></I>,
  Phone: () => <I><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></I>,
  Check: () => <I><path d="M5 12l5 5 9-10" /></I>,
  Arrow: () => <I><path d="M5 12h14M13 6l6 6-6 6" /></I>,
  Close: () => <I><path d="M6 6l12 12M18 6L6 18" /></I>,
  Chat: () => <I><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9h8M8 12h5" /></I>,
};

/** Rooms as labelled rectangles. Units are metres; the viewBox scales to the plan. */
export function FloorPlan({ plan, title, className = "" }: { plan: Plan; title: string; className?: string }) {
  const S = 40, pad = 10;
  const W = plan.w * S + pad * 2, H = plan.h * S + pad * 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Floor plan: ${title}. Rooms: ${plan.rooms.map((r) => r.name).join(", ")}.`} className={`h-auto w-full ${className}`}>
      <rect x="0" y="0" width={W} height={H} fill="#e6dfd2" />
      {plan.rooms.map((r) => {
        const x = pad + r.x * S, y = pad + r.y * S, w = r.w * S, h = r.h * S;
        const small = w < 70 || h < 46;
        return (
          <g key={r.name + x + y}>
            <rect x={x} y={y} width={w} height={h} fill={r.outside ? "#d4e6e2" : r.new ? "#efe3c6" : "#f5f0e6"} stroke="#1c2534" strokeWidth={r.outside ? 1 : 2} strokeDasharray={r.outside ? "4 3" : undefined} />
            <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central" fontFamily="Manrope, system-ui, sans-serif" fontSize={small ? 10 : 12} fontWeight="600" fill="#1c2534">{small && r.name.length > 7 ? r.name.slice(0, 6) + "." : r.name}</text>
            {!small && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif" fontSize="10" fill="#5a564f">{r.w} × {r.h} m</text>}
          </g>
        );
      })}
    </svg>
  );
}

/** Abstract map of the area: a river line, a boundary, and labelled pins. No tiles, no claims of exact position. */
export function AreaMap({ areas, highlight, className = "" }: { areas: Area[]; highlight?: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`Map of areas served: ${areas.map((a) => a.name).join(", ")}.`} className={`h-auto w-full ${className}`}>
      <rect width="100" height="100" fill="#e6dfd2" />
      <path d="M-2 10C15 4 28 14 42 10S70 2 102 8" fill="none" stroke="#1b6561" strokeWidth="2.5" strokeOpacity="1" />
      <text x="4" y="7" fontFamily="Manrope, system-ui, sans-serif" fontSize="3.2" fontWeight="600" fill="#1b6561">THAMES</text>
      {[20, 40, 60, 80].map((v) => <g key={v}><line x1={v} y1="12" x2={v} y2="100" stroke="#d9d1c2" strokeWidth="0.4" /><line x1="0" y1={v + 8} x2="100" y2={v + 8} stroke="#d9d1c2" strokeWidth="0.4" /></g>)}
      {areas.map((a) => {
        const on = a.name === highlight;
        return (
          <g key={a.name}>
            <path d={`M${a.x} ${a.y}c-3 -3.5 -3 -8 0 -8s3 4.5 0 8Z`} fill={on ? "#9a4429" : "#1c2534"} />
            <circle cx={a.x} cy={a.y - 5.2} r="1.3" fill="#f5f0e6" />
            <text x={a.x} y={a.y + 4} textAnchor="middle" fontFamily="Manrope, system-ui, sans-serif" fontSize="3.4" fontWeight={on ? 700 : 600} fill="#1c2534">{a.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** A tile where a photograph will go. The label is for the preview and hidden from assistive tech. */
export function PhotoSlot({ label, ratio = "aspect-[4/3]", className = "" }: { label: string; ratio?: string; className?: string }) {
  return (
    <div className={`relative flex items-end overflow-hidden rounded-pill bg-stone ${ratio} ${className}`} role="img" aria-label="Photograph to come">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true"><path d="M0 75L100 0M0 0L100 75" stroke="#d9d1c2" strokeWidth="0.4" /></svg>
      <span aria-hidden="true" className="relative m-3 rounded-pill bg-paper px-2.5 py-1.5 text-xs text-mute">{label}</span>
    </div>
  );
}
