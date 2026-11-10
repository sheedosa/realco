# Realco website — guidance for this repo

Static React site (Vite + Tailwind) on GitHub Pages for I & A Realco Ltd (a separate company in the I&A group).
A funnel, not a shop, for two main audiences, landlords and building clients, plus guests. Three doors, in this order:
**Lettings** (property management for landlords only: no tenant-facing copy, no homes to rent, no "enquire to rent"),
**Build** (refurbishments and extensions only: no lofts, no new builds) and **Stays** (short stays booked direct on
this site; Airbnb and Booking.com may be mentioned as other places they are listed). Each ends in an enquiry
through one drawer.

## Rules
1. **Facts come from `src/data/site.ts`; listings, stays and projects from `src/data/listings.json`.** Never invent
   prices, fees, deposits, terms, lead times, addresses, team names or reviews. Unconfirmed items are
   `[PLACEHOLDER]` in copy and listed in `SITE.toConfirm`. While `SITE.preview` is true, data is sample and stays
   labelled as such; a review slot reads "[Client review, to come]", at body size, at most one per page.
   Never put a placeholder in a heading or display number: write the heading plainly, placeholder in a 16px line.
   Never put a placeholder in a control either: phone, email, address and hours are read through `src/lib/contact.ts`
   (`CONTACT`, `known()`), which hides call buttons and contact links until the fact is real and leaves one
   "to come" line in the footer, the phone menu and the drawer. The bracketed facts are shown once, on About.
2. **Data goes through `src/lib/store.ts` only.** Managed homes (`store.managed()`) are evidence of the work, never listings. Components never read the JSON directly.
3. **Every enquiry goes through the drawer** (`src/components/EnquiryDrawer.tsx`, `src/lib/enquiry.tsx`). Door
   tools (calculator, stay enquiry, project enquiry) prefill it; they do not post anywhere themselves.
4. **Every page sets `<Seo>`.** Add new routes to `scripts/prerender.mjs`.
5. **Brand (`docs/BRAND.md`):** Ink `#1c2534` carries the hero, header, bands and footer; Paper `#f5f0e6` is for
   reading; Stone `#e6dfd2` neutral. Door colours Clay (Lettings), Gold (Build), Teal (Stays) are solid fields and
   rules through the `door-*` scope classes, never body text; no new colours. Barlow Condensed 600 for h1/h2/h3, door
   names, figures and button lettering (sentence case headings); Barlow 400/500/600 for text. Caps `.label` only for
   table heads and footer headings; form labels are `.flabel`. Corners 3px. No pills, gradients, drop shadows,
   eyebrow labels above headings, middle-dot strings, arrows on links, or card grids for prose. Marque: roof over
   three bricks; the wordmark is Barlow Condensed 600, built by `scripts/logo.py`.
6. **Imagery in code.** Floor plans, the area map, the street and photo slots are SVG/CSS. No stock photos with
   people; at most two stand-alone photo slots per page (Before/After pairs and the stays rail aside).
7. Tap targets ≥ 44px, no horizontal overflow at 375px, body text ≥ 16px, AA contrast, British English, GBP.

## Commands
```bash
npm run dev          # local
npm run build        # typecheck + vite build + prerender (needs Chromium)
npm run build:spa    # build without prerender
```

## Design system (v3)
- **Type:** one fluid scale in `index.css` (`--t-hero`, `--t-door`, `--t-board`, `--t-title`, `--t-section`,
  `--t-sub`, `--t-num`, `--t-lede`, `--t-body`). h1/h2/h3 take their size from the element; never hard-code a heading
  size in a page. Change faces through `--font-display` / `--font-sans` only.
- **The board is the signature** (`src/components/Board.tsx`). Home is three `Board`s on the `Street`
  (`src/components/Svg.tsx`): Lettings and Build first and larger, Stays third, each with its one tool (`RentQuick`,
  `BuildQuick`, `StayEnquiry compact`). A door page opens with `DoorBand`: the header and the band take the door's
  colour and the board is the h1. The field, name and line carry `board-<door>-*` view-transition names. Keep
  everything around the boards quiet; do not add a second showpiece.
- **Grounds:** `.on-ink`, `.on-door` (paper lettering on a door colour) and `.panel` (a paper or tint panel inside
  either) set `--help`, `--focus`, `--btn-*`, `--chip-*`, so tools work on any ground. Use `.btn-key` for the main
  action, `.help` for secondary text; never put `text-mute` inside a tool.
- **Evidence:** managed homes are the `Ledger` (rows, never cards or links); build projects are `ProjectRow`
  (before and after across the width, floor plan beside); stays are the `StayRail`.
- **Page changes:** links between pages use `VLink`; a stay's slot (`stay-<handle>`) and a project's pair
  (`project-<handle>`) share a name with their detail page. `VLink` waits for `<main data-path>` to change.
- **Motion:** tokens `--ease-out`, `--dur-1/2/3`. Motion answers an action. The one unprompted moment is the boards
  being planted on first load (`.plant`). Reduced motion switches all of it off.
- **Phones:** `StickyBar` shows the figure and the next action once the page's own button has scrolled away, and
  hides at the footer. The enquiry drawer is a full-height sheet with its action row pinned to the bottom.

## Layout rules
- One header strip: message left, outlined "Preview" tag right. The header's "Talk to Realco" button is always
  visible (sticky); there is no floating button. The mobile menu is a panel with the full nav, phone, email,
  office and hours.
- Photographs to come use `Slot` (door tint, line drawing, short tag, one line), never a grey wireframe box.
  Build projects show a Before/After pair.
- Dates are typed `dd/mm/yyyy` text fields (`DateField`), never `type="date"`; past check-ins are refused.
- Forms: labels above fields, errors say what to fix, 16px inputs, the right `inputmode` and `autocomplete`.
- Element rules live in `@layer base`, classes in `@layer components`, so utilities win.
