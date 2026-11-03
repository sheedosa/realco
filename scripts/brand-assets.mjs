// Renders the raster brand assets from the SVG lockups: favicons, the Open Graph card and docs/logo-sheet.png.
// Run after scripts/logo.py: node scripts/brand-assets.mjs
import { chromium } from "playwright";
import { readFileSync, existsSync, mkdirSync } from "node:fs";

const root = new URL("../", import.meta.url).pathname;
const L = root + "public/img/logo/";
const svg = (n) => `data:image/svg+xml;utf8,${encodeURIComponent(readFileSync(L + n, "utf8"))}`;
const exe = existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined;
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const css = `<style>@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Manrope:wght@400;600&display=swap');
  body{margin:0;font-family:Manrope,system-ui,sans-serif;color:#1c2534;background:#f5f0e6}
  .label{text-transform:uppercase;letter-spacing:.15em;font-weight:600;font-size:12px;color:#5a564f}
  h1,h2{font-family:Fraunces,serif;font-weight:600;font-variation-settings:"opsz" 144;margin:0;letter-spacing:-.015em}
  .sw{height:72px;border-radius:3px;display:flex;align-items:flex-end;padding:8px;font-size:12px;font-weight:600;color:#f5f0e6}</style>`;

async function shot(html, w, h, path, opts = {}) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: opts.scale ?? 1 });
  await p.setContent(css + html, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path, omitBackground: Boolean(opts.transparent) });
  await p.close();
}

// Favicons: ink tile with paper marks.
for (const [n, s] of [["favicon-64.png", 64], ["apple-touch-icon.png", 180], ["icon-512.png", 512]]) {
  await shot(`<body style="background:transparent"><img src="${svg("realco-marque-tile-doors.svg")}" style="width:${s}px;height:${s}px;display:block"></body>`, s, s, L + n, { transparent: true });
}

// Open Graph card.
mkdirSync(root + "public/img/og", { recursive: true });
await shot(`<body style="background:#1c2534;color:#f5f0e6;display:flex;flex-direction:column;justify-content:space-between;padding:72px;box-sizing:border-box;height:630px">
  <img src="${svg("realco-horizontal-paper.svg")}" style="width:300px">
  <div><h1 style="font-size:76px;line-height:1.02;max-width:900px">Three doors.<br>One team. One number.</h1>
  <p style="font-size:24px;color:#b9b4a9;margin:24px 0 0">Lettings · Stays · Build · South London</p></div>
  <div style="display:flex;gap:8px"><span style="width:60px;height:14px;background:#9a4429"></span><span style="width:60px;height:14px;background:#1b6561"></span><span style="width:60px;height:14px;background:#79570b"></span></div></body>`, 1200, 630, root + "public/img/og/og-home.png");

// Logo sheet for docs/.
mkdirSync(root + "docs", { recursive: true });
await shot(`<body style="padding:56px;box-sizing:border-box;width:1400px;display:grid;grid-template-columns:1fr 1fr;gap:40px 56px">
  <div style="grid-column:1/-1;display:flex;justify-content:space-between;align-items:baseline"><h1 style="font-size:40px">Realco identity</h1><span class="label">Logo sheet · lockups, marque, palette, type</span></div>
  <div><p class="label">Horizontal, ink</p><img src="${svg("realco-horizontal-ink.svg")}" style="width:460px;margin-top:12px"></div>
  <div><p class="label">Horizontal, three doors</p><img src="${svg("realco-horizontal-doors.svg")}" style="width:460px;margin-top:12px"></div>
  <div style="background:#1c2534;padding:32px;border-radius:3px"><p class="label" style="color:#b9b4a9">Horizontal, paper on ink</p><img src="${svg("realco-horizontal-paper.svg")}" style="width:400px;margin-top:12px"></div>
  <div style="display:flex;gap:32px;align-items:flex-start"><div><p class="label">Stacked</p><img src="${svg("realco-stacked-doors.svg")}" style="width:220px;margin-top:12px"></div><div style="background:#1c2534;padding:20px;border-radius:3px"><img src="${svg("realco-stacked-paper-on-ink.svg")}" style="width:200px"></div></div>
  <div><p class="label">Marque: a roof over three bricks, one brick per door</p><div style="display:flex;gap:20px;align-items:center;margin-top:12px">
    <img src="${svg("realco-marque-ink.svg")}" style="width:96px"><img src="${svg("realco-marque-doors.svg")}" style="width:96px"><img src="${svg("realco-marque-tile.svg")}" style="width:96px"><img src="${svg("realco-marque-tile-doors.svg")}" style="width:96px"><img src="${svg("realco-marque-tile-doors.svg")}" style="width:32px"><img src="${svg("realco-marque-tile-doors.svg")}" style="width:16px"></div></div>
  <div><p class="label">Palette</p><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:12px">
    <div class="sw" style="background:#1c2534">Ink 1c2534</div><div class="sw" style="background:#121926">Deep 121926</div><div class="sw" style="background:#f5f0e6;color:#1c2534;border:1px solid #d9d1c2">Paper f5f0e6</div><div class="sw" style="background:#e6dfd2;color:#1c2534">Stone e6dfd2</div><div class="sw" style="background:#5a564f">Mute 5a564f</div>
    <div class="sw" style="background:#9a4429">Clay 9a4429</div><div class="sw" style="background:#1b6561">Teal 1b6561</div><div class="sw" style="background:#79570b">Gold 79570b</div><div class="sw" style="background:#f1dcd1;color:#1c2534">Clay tint</div><div class="sw" style="background:#d4e6e2;color:#1c2534">Teal tint</div></div></div>
  <div style="grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:56px;border-top:1px solid #d9d1c2;padding-top:32px">
    <div><p class="label">Display · Fraunces 600, opsz 144</p><h2 style="font-size:56px;line-height:1.04;margin-top:8px">Let it well, or find the one.</h2></div>
    <div><p class="label">Text · Manrope 400 / 600 · labels 0.15em uppercase</p><p style="font-size:18px;line-height:1.55;margin:8px 0 0;max-width:520px">Whichever door you come through, the same people answer, and one call covers all three. <b>Fees shown as a share of rent</b>, prices per night, quotes in writing.</p></div></div>
</body>`, 1400, 1186, root + "docs/logo-sheet.png");
await browser.close();
console.log("brand assets written");
