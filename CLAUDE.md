# Realco website — guidance for this repo

Static React site (Vite + Tailwind) on GitHub Pages. A funnel, not a shop: lettings, short stays and construction,
each ending in an enquiry through one drawer.

## Rules
1. **Facts come from `src/data/site.ts`; listings, stays and projects from `src/data/listings.json`.** Never invent
   prices, fees, deposits, terms, lead times, addresses, team names or reviews. Unconfirmed items are
   `[PLACEHOLDER]` in copy and listed in `SITE.toConfirm`. While `SITE.preview` is true, data is sample and stays
   labelled as such; a review slot reads "[Client review, to come]".
2. **Data goes through `src/lib/store.ts` only.** Components never read the JSON directly.
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
