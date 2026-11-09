// Post-build: render every route to static HTML inside dist/ so GitHub Pages serves real pages
// (titles, meta, JSON-LD and content) to Google, social scrapers and AI crawlers. Also writes sitemap.xml and llms.txt.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const BASE = "/realco";
const SITE = "https://sheedosa.github.io" + BASE;
const dist = new URL("../dist/", import.meta.url).pathname;
const data = JSON.parse(readFileSync(new URL("../src/data/listings.json", import.meta.url)));

const routes = ["/", "/lettings", "/stays", "/build", "/about",
  ...data.stays.map((p) => `/stays/${p.handle}`),
  ...data.projects.map((p) => `/build/${p.handle}`)];

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]).replace(BASE, "") || "/";
  let f = join(dist, p);
  if (!existsSync(f) || statSync(f).isDirectory()) f = join(dist, "index.html");
  res.setHeader("Content-Type", types[extname(f)] ?? "application/octet-stream");
  res.end(readFileSync(f));
}).listen(0);
const PORT = server.address().port;

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // fonts aren't needed for markup
let n = 0;
for (const r of routes) {
  await page.goto(`http://localhost:${PORT}${BASE}${r}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("h1") && !document.body.innerText.includes("Loading"), null, { timeout: 10000 }).catch(() => {});
  let html = await page.content();
  html = html.replace("<html", '<html data-prerendered="1"'); // informational only
  const out = r === "/" ? join(dist, "index.html") : join(dist, r.slice(1), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, "<!doctype html>\n" + html.replace(/^<!doctype html>\s*/i, ""));
  n++;
}
await browser.close(); server.close();

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><changefreq>${r.split("/").length > 2 ? "weekly" : "monthly"}</changefreq><priority>${r === "/" ? "1.0" : r.split("/").length > 2 ? "0.7" : "0.9"}</priority></url>`).join("\n")}\n</urlset>\n`);

const li = (arr, pre, f) => arr.map((p) => `- [${p.title}](${SITE}${pre}/${p.handle}): ${f(p)}`).join("\n");
writeFileSync(join(dist, "llms.txt"), `# Realco

> Realco (I & A Realco Ltd, a company in the I&A group) is a South London property business with three doors and one team: Lettings (property management for landlords: Rent collection or Fully managed), Build (refurbishments and rear and side-return extensions, for homeowners and landlords) and Stays (serviced apartments and a family house for short stays, booked direct; also listed on Airbnb and Booking.com). One enquiry route and one phone number cover all three.

Note: this site is a concept preview. Managed homes, apartments and projects are samples; prices and business details are placeholders until the client confirms them. Enquiries are saved on the visitor's device and not sent.

## Doors
- [Lettings](${SITE}/lettings): management for landlords, what each level covers, landlord calculator, homes we manage
- [Build](${SITE}/build): refurbishments and extensions, five-step process, before-and-after projects
- [Stays](${SITE}/stays): book direct, dates and guests, the apartments
- [About and contact](${SITE}/about): company details, areas, team

## Stays (samples)
${li(data.stays, "/stays", (p) => `${p.area}, sleeps ${p.sleeps}, minimum ${p.minNights} nights`)}

## Projects (samples)
${li(data.projects, "/build", (p) => `${p.type.toLowerCase()} in ${p.area}`)}
`);
console.log(`prerendered ${n} routes, sitemap + llms.txt written`);
