# Realco identity

Interim identity: the client has its own Realco logo (files to come, listed in `SITE.toConfirm`).

A new identity of its own. Calm, trustworthy, modern property: one company with three doors
(Lettings, Stays, Build) that share a mark, a type system and a ground, and differ only by one accent each.

## Name treatment

**Realco** is set in Fraunces (variable, optical size 144, weight 600, SOFT 0, WONK 0), tracked tight at -0.028em,
sentence case, as a single word. The wordmark is outlined to SVG paths (`scripts/logo.py`, fontTools), so no font
loads are needed for the logo. The lockups are in `public/img/logo/`:

| File | Use |
| --- | --- |
| `realco-horizontal-ink.svg` / `-paper.svg` | Header (ink on paper), footer (paper on ink) |
| `realco-horizontal-doors.svg` | Header when the three accents are wanted; the default on this site |
| `realco-stacked-ink.svg`, `-doors.svg`, `-paper-on-ink.svg` | Square spaces, social avatars, signage |
| `realco-marque-*.svg` | Favicon, app icon, section markers; `-tile` variants sit on an ink square |
| `favicon-64.png`, `apple-touch-icon.png`, `icon-512.png`, `../og/og-home.png` | Rendered by `scripts/brand-assets.mjs` |

Minimum width for the horizontal lockup: 120px. Clear space: the height of one brick on all sides. Do not recolour
the wordmark outside Ink and Paper; do not stretch, outline or add effects.

## Marque: a roof over three bricks

A chevron roof (5-unit stroke, square caps) over three bricks in a row. Read as a house; the three bricks are the
three doors, left to right Lettings (clay), Stays (teal), Build (gold). In a single colour the marque is neutral. In
a door section, only that door's brick takes colour (`<Marque door="stays" />`), so a page tells you where you are
without a second logo. The `-doors` variants light all three and mean "the whole company".

## Palette

| Token | Hex | Role |
| --- | --- | --- |
| Ink | `#1c2534` | Ground for hero, drawer header, dark panels; primary text |
| Deep | `#121926` | Footer, preview banner, pressed states |
| Paper | `#f5f0e6` | Page ground (warm) |
| Stone | `#e6dfd2` | Neutral with a warm bias: bands, photo slots, plan backgrounds |
| Line | `#d9d1c2` | Rules and borders |
| Mute | `#5a564f` | Secondary text; 6.4:1 on Paper, 5.5:1 on Stone |
| Fog | `#b9b4a9` | Secondary text on Ink; 7.4:1 |
| Clay | `#9a4429` | Lettings accent; 5.1:1 on its tint `#f1dcd1` |
| Teal | `#1b6561` | Stays accent; 5.4:1 on its tint `#d4e6e2` |
| Gold | `#79570b` | Build accent; 5.2:1 on its tint `#efe3c6` |

The three accents sit close in lightness so no door looks like the "main" one. Each is used as a solid button
with Paper text, as label text on Paper or its own tint, and as one brick in the marque. Never as body text, never
as a gradient. Tints are surfaces only.

## Type

- **Display:** Fraunces 600 at optical size 144, letter-spacing -0.015em, line-height 1.04, sentence case. h1, h2,
  prices and large numerals.
- **Text:** Manrope 400 (body, 16px minimum, line-height 1.55), 600 for emphasis and h3. Labels: Manrope 600,
  uppercase, 0.15em tracking, 12px.
- Both from Google Fonts (`index.html`). Nothing else is loaded.

## Layout and components

Corners 3px everywhere (`--radius-pill` is 3px: the class name is kept from the shared stack). No pills, no
gradients, no drop shadows except the floating "Talk to Realco" button and the drawer. Buttons are uppercase
tracked labels, 48px tall. Cards are plain borders on Paper. Section bands alternate Paper, Stone and a door tint.

Imagery is drawn in code: floor plans as labelled rectangles (outside space dashed teal tint, new rooms gold tint),
a sketch area map (river as one line, faint street dashes, the marque as the pin), the outlined South London terrace
skyline in the home hero (1px strokes, one window lit per door), and designed slots where a photograph will go (door
tint ground, small line drawing, caps label, one line; Before/After pairs for Build).

## Voice

Plain, specific, local. "Three doors, one team, one number" is the line. Say what happens next and when. Figures
the client has not confirmed are written as `[PLACEHOLDER]`, never guessed.
