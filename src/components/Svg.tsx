import type { Area, Plan } from "../lib/store";
import type { DoorId } from "../data/site";

const DOOR_HEX: Record<DoorId, string> = { lettings: "#9a4429", stays: "#1b6561", build: "#79570b" };
const ORDER: DoorId[] = ["lettings", "stays", "build"]; // brick order in the marque, left to right

/** Roof over three bricks. `door` lights one brick; `doors` lights all three. */
export function Marque({ size = 32, door, doors = false, fill = "currentColor", className = "" }: { size?: number; door?: DoorId; doors?: boolean; fill?: string; className?: string }) {
  const brick = (i: number) => (doors ? DOOR_HEX[ORDER[i]] : door && ORDER[i] === door ? DOOR_HEX[door] : fill);
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
  Phone: () => <I><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></I>,
  Check: () => <I><path d="M5 12l5 5 9-10" /></I>,
  Prev: () => <I><path d="M14 6l-6 6 6 6" /></I>,
  Next: () => <I><path d="M10 6l6 6-6 6" /></I>,
  Close: () => <I><path d="M6 6l12 12M18 6L6 18" /></I>,
  Chat: () => <I><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 9h8M8 12h5" /></I>,
};

/** Rooms as labelled rectangles. Units are metres; the viewBox scales to the plan. `compact` drops dimensions for cards. */
export function FloorPlan({ plan, title, compact = false, className = "" }: { plan: Plan; title: string; compact?: boolean; className?: string }) {
  const S = compact ? 34 : 48, pad = 10;
  const W = plan.w * S + pad * 2, H = plan.h * S + pad * 2;
  const name = compact ? 15 : 20, dim = 15;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Floor plan: ${title}.${plan.rooms.some((r) => r.name) ? ` Rooms: ${plan.rooms.map((r) => r.name).filter(Boolean).join(", ")}.` : ""}`} className={`h-auto w-full ${className}`}>
      <rect x="0" y="0" width={W} height={H} fill="#e6dfd2" />
      {plan.rooms.map((r) => {
        const x = pad + r.x * S, y = pad + r.y * S, w = r.w * S, h = r.h * S;
        // Fit the room name: shorten long names in narrow rooms, never below the minimum size.
        const fits = r.name.length * name * 0.6 < w - 8;
        const label = fits ? r.name : r.name.split(/[ -]/)[0];
        const showDim = !compact && h >= 70 && w >= 80;
        return (
          <g key={r.name + x + y}>
            <rect x={x} y={y} width={w} height={h} fill={r.outside ? "#d4e6e2" : r.new ? "#efe3c6" : "#f5f0e6"} stroke="#1c2534" strokeWidth={r.outside ? 1 : 2} strokeDasharray={r.outside ? "4 3" : undefined} />
            {label && h >= 26 && w >= 34 && <text x={x + w / 2} y={y + h / 2 - (showDim ? 10 : 0)} textAnchor="middle" dominantBaseline="central" fontFamily="Barlow, system-ui, sans-serif" fontSize={name} fontWeight="600" fill="#1c2534">{label}</text>}
            {showDim && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" dominantBaseline="central" fontFamily="Barlow, system-ui, sans-serif" fontSize={dim} fill="#5a564f">{r.w} × {r.h} m</text>}
          </g>
        );
      })}
    </svg>
  );
}

/** Sketch map of the area: the river as a single line, a faint street grid, and the marque as the pin. */
export function AreaMap({ areas, highlight, className = "" }: { areas: Area[]; highlight?: string; className?: string }) {
  const streets: string[] = [];
  for (let y = 18; y < 100; y += 9) for (let x = (y % 2 ? 2 : 6); x < 100; x += 11) streets.push(`M${x} ${y}h5`);
  for (let x = 8; x < 100; x += 13) for (let y = 20; y < 100; y += 12) streets.push(`M${x} ${y}v4`);
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`Sketch map of areas served: ${areas.map((a) => a.name).join(", ")}.`} className={`h-auto w-full ${className}`}>
      <rect width="100" height="100" fill="#f5f0e6" />
      <path d={streets.join("")} stroke="#d9d1c2" strokeWidth="0.5" strokeLinecap="round" />
      <path d="M-2 10C15 4 28 14 42 10S70 2 102 8" fill="none" stroke="#5a564f" strokeWidth="0.6" />
      <text x="4" y="5.5" fontFamily="Barlow, system-ui, sans-serif" fontSize="3.6" letterSpacing="0.5" fontWeight="600" fill="#5a564f">RIVER THAMES</text>
      {areas.map((a) => {
        const on = a.name === highlight;
        return (
          <g key={a.name} transform={`translate(${a.x} ${a.y})`}>
            <path d="M-3.6 -3.4L0 -7L3.6 -3.4" fill="none" stroke="#1c2534" strokeWidth="0.9" strokeLinecap="square" />
            {[-1, 0, 1].map((i) => <rect key={i} x={i * 2.5 - 1} y="-2.4" width="2" height="2.3" fill={on ? "#9a4429" : "#1c2534"} />)}
            <text y="4.2" textAnchor="middle" fontFamily="Barlow, system-ui, sans-serif" fontSize="3.4" fontWeight={on ? 700 : 600} fill="#1c2534">{a.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Skyline: outlined South London terraces for the home hero ---------- */
function Terrace({ x0, n, w, base, h, roof, lit }: { x0: number; n: number; w: number; base: number; h: number; roof: number; lit: Record<number, string> }) {
  const top = base - h;
  const parts: React.ReactNode[] = [];
  // body and roof as one filled outline so the row occludes anything behind it
  parts.push(<path key="body" d={`M${x0} ${base}V${top}L${x0 + 10} ${top - roof}H${x0 + n * w - 10}L${x0 + n * w} ${top}V${base}`} />);
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w;
    if (i > 0) parts.push(<path key={`pw${i}`} d={`M${x} ${base}V${top}`} />);
    // chimney stack on each party wall
    if (i > 0) parts.push(<path key={`ch${i}`} d={`M${x - 6} ${top - roof}v-16h12v16M${x - 4} ${top - roof - 16}v-5h3v5M${x + 1} ${top - roof - 16}v-5h3v5`} />);
    // first floor: two sash windows
    const win = (wx: number, key: string, fill?: string) => <rect key={key} x={wx} y={top + 16} width={13} height={24} style={fill ? { fill, stroke: fill } : undefined} />;
    parts.push(win(x + 10, `w1${i}`, lit[i * 2]), win(x + w - 23, `w2${i}`, lit[i * 2 + 1]));
    // ground floor: bay window and door with a fanlight
    const gy = top + 58;
    parts.push(<path key={`bay${i}`} d={`M${x + 6} ${base}V${gy + 6}L${x + 10} ${gy}H${x + 32}L${x + 36} ${gy + 6}V${base}M${x + 6} ${gy + 6}H${x + 36}M${x + 16} ${gy + 6}V${base - 12}M${x + 26} ${gy + 6}V${base - 12}M${x + 6} ${base - 12}H${x + 36}`} />);
    parts.push(<path key={`dr${i}`} d={`M${x + w - 18} ${base}V${gy + 10}a6 6 0 0 1 12 0V${base}`} />);
  }
  return <g>{parts}</g>;
}

/** The home hero's street: one long row of outlined terraces with a mansion block and a church behind, one window
    lit per door. Fixed height, cropped from the middle, so it fills any width without stretching. */
export function Street({ className = "" }: { className?: string }) {
  const block = (x: number, top: number, cols: number) => (
    <g key={`b${x}`}>
      <path d={`M${x} 300V${top}H${x + cols * 26 + 14}V300M${x} ${top}v-8h${cols * 26 + 14}v8`} />
      {Array.from({ length: Math.floor((300 - top - 30) / 34) }, (_, r) => Array.from({ length: cols }, (_, c) => <rect key={`${r}${c}`} x={x + 14 + c * 26} y={top + 14 + r * 34} width={12} height={20} />))}
    </g>
  );
  return (
    <svg viewBox="0 0 1920 300" aria-hidden="true" focusable="false" className={`street ${className}`} preserveAspectRatio="xMidYMax slice">
      <g fill="#1c2534" stroke="#6f6f72" strokeWidth="1" strokeLinejoin="miter">
        {/* back row */}
        {block(232, 118, 6)}
        {block(1380, 104, 7)}
        <path d="M636 300V96h40v204M636 96l20-34 20 34M656 62V44M650 50h12" />
        <rect x="649" y="120" width="14" height="26" />
        {block(1668, 132, 5)}
        {/* the terraces */}
        <Terrace x0={-30} n={4} w={66} base={300} h={118} roof={20} lit={{}} />
        <Terrace x0={290} n={5} w={66} base={300} h={128} roof={22} lit={{}} />
        <Terrace x0={700} n={3} w={66} base={300} h={112} roof={18} lit={{ 2: "#9a4429" }} />
        <Terrace x0={940} n={6} w={66} base={300} h={128} roof={22} lit={{ 5: "#79570b", 8: "#1b6561" }} />
        <Terrace x0={1400} n={4} w={66} base={300} h={116} roof={20} lit={{}} />
        <Terrace x0={1730} n={3} w={66} base={300} h={124} roof={20} lit={{}} />
        <path d="M0 299.5H1920" fill="none" />
      </g>
    </svg>
  );
}

/* ---------- Designed slots where a photograph will go ---------- */
type SlotKind = "room" | "street" | "extension-before" | "extension-after" | "refurb-before" | "refurb-after" | "team";
const SLOT_ART: Record<SlotKind, React.ReactNode> = {
  room: <><path d="M14 10h40v32H14zM34 10v32M14 26h40" /><path d="M66 58V40h40v18M62 58h48M70 40v-6h32v6M66 50h40" /><path d="M24 58V48M18 48h12l-2-6h-8z" /></>,
  street: <><path d="M10 64V30l12-10 12 10v34M34 64V30l12-10 12 10v34M58 64V30l12-10 12 10v34M82 64V30l12-10 12 10v34M4 64h110" /><path d="M16 36h12v10H16zM40 36h12v10H40zM64 36h12v10H64zM88 36h12v10H88zM18 64V54h8v10M42 64V54h8v10M66 64V54h8v10M90 64V54h8v10" /></>,
  "extension-before": <><path d="M20 64V22l20-12 20 12v42M60 64V38h18v26M8 64h104" /><path d="M28 30h10v12H28zM44 30h10v12H44zM64 46h8v8h-8z" /><path d="M78 64V38h26v26" strokeDasharray="3 3" /></>,
  "extension-after": <><path d="M20 64V22l20-12 20 12v42M8 64h104" /><path d="M28 30h10v12H28zM44 30h10v12H44z" /><path d="M60 64V38h44v26z" style={{ fill: "var(--door-t, #efe3c6)" }} /><path d="M70 38l6-4h14l6 4M66 64V48h24v16M78 48v16" /></>,
  "refurb-before": <><path d="M8 64h104M14 64V24h92v40" /><path d="M20 64V44h50v20M20 50h50M45 44v20" strokeDasharray="3 3" /><path d="M80 30h18v14H80z" strokeDasharray="3 3" /><path d="M36 24v6" /></>,
  "refurb-after": <><path d="M8 64h104M14 64V24h92v40" /><path d="M20 64V44h50v20z" style={{ fill: "var(--door-t, #efe3c6)" }} /><path d="M20 50h50M45 44v20M28 54v3M60 54v3" /><path d="M80 30h18v14H80zM89 30v14" /><path d="M36 24v6M32 30h8" /></>,
  team: <><path d="M40 16h40v40H40z" strokeDasharray="3 3" /><path d="M50 44l10-10 10 10M52 48h4v4h-4zM58 48h4v4h-4zM64 48h4v4h-4z" /></>,
};

/**
 * A designed tile in place of a photograph: door tint (or stone) ground, a small line drawing of what the photograph
 * will show, a short tag and one line of description. Reads as intentional, not as a wireframe box.
 */
export function Slot({ kind, label = "Photo to come", line, ratio = "aspect-[4/3]", tone = "tint", compact = false, className = "", style }: { kind: SlotKind; label?: string; line: string; ratio?: string; tone?: "tint" | "stone" | "paper"; compact?: boolean; className?: string; style?: React.CSSProperties }) {
  const ground = tone === "tint" ? "bg-door-t" : tone === "stone" ? "bg-stone" : "border border-line bg-paper";
  return (
    <div className={`relative flex flex-col justify-between gap-3 overflow-hidden rounded-pill ${compact ? "p-3" : "p-4"} ${ground} ${ratio} ${className}`} style={style} role="img" aria-label={`Photograph to come: ${line}`}>
      <span aria-hidden="true" className="slot-tag">{label}</span>
      <svg viewBox="0 0 120 72" aria-hidden="true" className="mx-auto h-auto w-3/5 max-w-[220px] text-ink" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" style={{ overflow: "visible" }}>{SLOT_ART[kind]}</svg>
      {compact ? <span aria-hidden="true" /> : <span aria-hidden="true" className="leading-snug text-ink">{line}</span>}
    </div>
  );
}
