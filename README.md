# Realco — lettings, stays and build

Concept preview for Realco, a South London property business with three doors: **Lettings** (property
management for landlords), **Build** (refurbishments and extensions) and **Stays** (short stays, booked direct).
Realco is I & A Realco Ltd, a separate company in the I&A group.
A funnel site, not a shop: every path ends in an enquiry, a viewing request, a stay enquiry or a quote request.

**Live preview:** https://sheedosa.github.io/realco/

## Stack
Vite + React 19 + TypeScript + Tailwind v4, react-router, deployed to GitHub Pages by `.github/workflows/deploy.yml`.
Every route is prerendered to static HTML (`scripts/prerender.mjs`) with titles, meta, Open Graph, JSON-LD,
`sitemap.xml` and `llms.txt`.

## Commands
```bash
npm install
npm run dev          # http://localhost:5173/realco/
npm run build        # typecheck + build + prerender (needs Chromium)
npm run build:spa    # without prerender
python3 scripts/logo.py <BarlowCondensed-SemiBold.ttf> public/img/logo   # rebuild the SVG lockups (fontTools)
node scripts/brand-assets.mjs                           # favicons, OG card, docs/logo-sheet.png
```

## The idea the site owns
"Three doors, one team, one number." One enquiry layer for the whole company:
- **Talk to Realco drawer** (`src/components/EnquiryDrawer.tsx`): which door → what you need → when suits you.
  Every page can open it prefilled (a property, a stay with dates, a project type). The draft and the last
  enquiry are saved in `localStorage`; nothing is sent in the preview.
- **Landlord calculator** (Lettings): monthly rent → what you keep under Rent collection / Fully
  managed. Percentages are sample `[FEE %]` values in `src/data/site.ts`; the result is remembered.
- **Book direct** (Stays): dd/mm/yyyy dates + guests → a stay summary → a direct booking request in the drawer.
- **Project enquiry** (Build): type, rough size, timing → a project summary → site-visit request.

## What's real and what's sample
- **Real:** the structure, the identity (`docs/BRAND.md`, `docs/logo-sheet.png`), the interactions above.
- **Sample:** every listing, apartment and project in `src/data/listings.json` (6 managed homes, 4 stays, 4 projects),
  the fee percentages, the price bands, the steps and timings. All labelled on the page.
- **Placeholders:** company name, number, address, phone, email, hours, areas served, prices (`£[PRICE]`),
  deposits, fees, terms, team names, reviews (`[Client review, to come]`). The full list is `SITE.toConfirm`.

## Going live
1. Fill `src/data/site.ts` (company details, areas, real fee schedule) and set `SITE.preview = false`.
2. Replace `src/data/listings.json` with a feed from the lettings CRM / channel manager behind `src/lib/store.ts`
   (same interface), and add photographs where the photo slots are.
3. Wire the drawer's `setLast` to a form endpoint or CRM webhook, and the stay enquiry to the booking system.
4. Custom domain: `public/CNAME`, `VITE_BASE=/`, update `SITE.url`, `index.html`, `robots.txt`, `404.html` and
   `scripts/prerender.mjs`.
