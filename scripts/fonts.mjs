// Copies the self-hosted font files into public/fonts. Run after changing a family or weight: `node scripts/fonts.mjs`.
// Only the latin subset, only woff2, only the weights the site uses (index.css names them; index.html preloads two).
import { copyFileSync, mkdirSync } from "node:fs";
const out = new URL("../public/fonts/", import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const from = (pkg, file) => new URL(`../node_modules/@fontsource/${pkg}/files/${file}`, import.meta.url).pathname;
for (const w of [400, 500, 600]) copyFileSync(from("barlow", `barlow-latin-${w}-normal.woff2`), `${out}barlow-${w}.woff2`);
copyFileSync(from("barlow-condensed", "barlow-condensed-latin-600-normal.woff2"), `${out}barlow-condensed-600.woff2`);
console.log("fonts copied to public/fonts");
