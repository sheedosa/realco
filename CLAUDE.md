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
2. **Data goes through `src/lib/store.ts` only.** Managed homes (`store.managed()`) are evidence of the work, never listings. Components never read the JSON directly.
3. **Every enquiry goes through the drawer** (`src/components/EnquiryDrawer.tsx`, `src/lib/enquiry.tsx`). Door
   tools (calculator, stay enquiry, project enquiry) prefill it; they do not post anywhere themselves.
4. **Every page sets `<Seo>`.** Add new routes to `scripts/prerender.mjs`.
5. **Brand (`docs/BRAND.md`):** Ink `#1c2534` ground, Paper `#f5f0e6`, Stone `#e6dfd2` neutral; door accents Clay
   (Lettings), Teal (Stays), Gold (Build), used through the `door-*` scope classes, never as body text. Fraunces 600
   for h1/h2 (sentence case), Manrope for text and 0.15em uppercase labels. Corners 3px. No pills, gradients,
   drop shadows on cards, or card grids for prose. Marque: roof over three bricks; light one brick per door.
6. **Imagery in code.** Floor plans, the area map, the skyline and photo slots are SVG/CSS. No stock photos with
   people; at most two photo slots per page.
7. Tap targets ≥ 44px, no horizontal overflow at 375px, body text ≥ 16px, AA contrast, British English, GBP.

## Commands
```bash
npm run dev          # local
npm run build        # typecheck + vite build + prerender (needs Chromium)
npm run build:spa    # build without prerender
```

## Layout rules (v2)
- One header strip: message left, outlined "Preview" tag right. The header's "Talk to Realco" button is always
  visible (sticky); there is no floating button.
- Home hero: headline left, the outlined terrace `Skyline` right (`src/components/Svg.tsx`). Door cards below each
  carry their own tool (`RentQuick`, `BuildQuick`, `StayEnquiry compact`); do not make them identical.
- Photographs to come use `Slot` (door tint, line drawing, caps label, one line), never a grey wireframe box.
  Build projects show a Before/After pair.
- Dates are typed `dd/mm/yyyy` text fields (`DateField`), never `type="date"`; past check-ins are refused.
- Element rules live in `@layer base`, classes in `@layer components`, so utilities win; `.label` is always Manrope.
