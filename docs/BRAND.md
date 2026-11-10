# Realco identity

Interim identity: the client has its own Realco logo (files to come, listed in `SITE.toConfirm`).

A new identity of its own. The reference is the estate agent's board and the builder's site sign: sturdy, plain,
condensed lettering and numerals you can read from the road. One company with three doors (Lettings, Build, Stays)
that share a mark, a type system and a ground, and differ only by one colour each.

## Name treatment

**Realco** is set in Barlow Condensed SemiBold (600), tracked at +0.012em, sentence case, as a single word. The
wordmark is outlined to SVG paths (`scripts/logo.py`, fontTools, from the static `BarlowCondensed-SemiBold.ttf`), so
no font loads are needed for the logo. The marque is unchanged. The lockups are in `public/img/logo/`:

| File | Use |
| --- | --- |
| `realco-horizontal-paper.svg` | Header and footer (paper on Ink or on a door colour); the default on this site |
| `realco-horizontal-ink.svg`, `-doors.svg` | On Paper: documents, light grounds; `-doors` lights the three bricks |
| `realco-stacked-ink.svg`, `-doors.svg`, `-paper-on-ink.svg` | Square spaces, social avatars, signage |
| `realco-marque-*.svg` | Favicon, app icon, section markers; `-tile` variants sit on an ink square |
| `favicon-64.png`, `apple-touch-icon.png`, `icon-512.png`, `../og/og-home.png` | Rendered by `scripts/brand-assets.mjs` |

Minimum width for the horizontal lockup: 110px. Clear space: the height of one brick on all sides. Do not recolour
the wordmark outside Ink and Paper; do not stretch, outline or add effects.

## Marque: a roof over three bricks

A chevron roof (5-unit stroke, square caps) over three bricks in a row. Read as a house; the three bricks are the
three doors, left to right Lettings (clay), Stays (teal), Build (gold). In a single colour the marque is neutral. In
a door section, only that door's brick takes colour (`<Marque door="stays" />`), so a page tells you where you are
without a second logo. The `-doors` variants light all three and mean "the whole company".

## Palette

| Token | Hex | Role |
| --- | --- | --- |
| Ink | `#1c2534` | Ground for the hero, header, dark bands and drawer header; primary text |
| Deep | `#121926` | Footer, preview banner, pressed states |
| Paper | `#f5f0e6` | Page ground (warm) |
| Stone | `#e6dfd2` | Neutral with a warm bias: bands, photo slots, plan backgrounds |
| Line | `#d9d1c2` | Rules and borders |
| Mute | `#5a564f` | Secondary text; 6.4:1 on Paper, 5.5:1 on Stone |
| Fog | `#b9b4a9` | Secondary text on Ink; 7.4:1 |
| Outline | `#6f6f72` | The street drawing's line on Ink (decorative only) |
| Clay | `#9a4429` | Lettings: board, header and title band; tint `#f1dcd1` |
| Teal | `#1b6561` | Stays: board, header and title band; tint `#d4e6e2` |
| Gold | `#79570b` | Build: board, header and title band; tint `#efe3c6` |

The three door colours sit close in lightness so no door looks like the "main" one. Paper text on each passes AA
(Clay 5.6:1, Gold 5.7:1, Teal 5.9:1). Each is used as a solid field (a board, a door's header and title band, a
button), as a rule, and as one brick in the marque. Never as body text, never as a gradient. Tints are surfaces only
(photo slots, summary panels). Ink carries the hero, the header, the dark bands and the footer; Paper is for reading.

## Type

- **Display:** Barlow Condensed 600, sentence case, tight leading (0.94 to 1.0) and almost no tracking at size
  (-0.006em), a little air when small (+0.004em). h1, h2, h3, door names, rent figures (lining, tabular numerals)
  and button lettering (uppercase, +0.05em).
- **Text:** Barlow 400 (16 to 17px, line-height 1.55, 45 to 75 characters a line), 500 for links, 600 for emphasis
  and form labels. Caps labels (Barlow 600, 0.12em, 13px) are for table heads and footer headings only.
- One fluid scale in `src/index.css` (`--t-hero`, `--t-door`, `--t-board`, `--t-title`, `--t-section`, `--t-sub`,
  `--t-num`, `--t-lede`, `--t-body`, `--t-small`). Pages never set a heading size.
- Both from Google Fonts (`index.html`): Barlow Condensed 600; Barlow 400, 500, 600. Nothing else is loaded.

## The board

The signature. Each door is a board in its colour, the way a "To let" board reads from the street: the door name
in big condensed type, one line, one tool. Home is the three boards standing on the street (Lettings and Build first
and larger, Stays third). Inside a door, its colour takes the header and the title band and the board becomes the
page title; the field, the name and the line share view-transition names so one becomes the other. The Lettings
tool is the landlord calculator, with its result as large figures; Build's is the job-type chooser; Stays' is the
date pair. Boldness is spent here; everything around it stays quiet.

## Layout and components

Corners 3px everywhere (`--radius-pill` is 3px: the class name is kept from the shared stack). No pills, no
gradients, no drop shadows, no card grids for prose. Sections differ in shape: the full-bleed street, a ledger with
a title rail, full-width before and after rows, a rail of stays that runs off the right edge, Ink bands.

Managed homes are a ledger (home, area, service, managed since), not cards. Build projects are a before and after
pair across the width with the floor plan beside. Stays are a rail.

Imagery is drawn in code: floor plans as labelled rectangles (outside space dashed teal tint, new rooms gold tint),
a sketch area map (river as one line, faint street dashes, the marque as the pin), the outlined South London street
behind the home boards (1px strokes, one window lit per door), and designed slots where a photograph will go (door
tint ground, small line drawing, a short tag, one line; Before/After pairs for Build).

Motion answers an action (`--ease-out`, `--dur-1/2/3`). The one unprompted moment is the boards being planted when
the site first opens. Reduced motion switches all of it off.

## Voice

Plain, specific, local. "Three doors, one team, one number" is the line. Say what happens next and when. Figures
the client has not confirmed are written as `[PLACEHOLDER]`, never guessed.
