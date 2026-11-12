import { StrictMode, startTransition } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { goLive } from "./lib/local";

// GitHub Pages SPA fallback: 404.html redirects to /?p=<path>; restore it before React mounts.
const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) window.history.replaceState(null, "", import.meta.env.BASE_URL.replace(/\/$/, "") + p);

// A prerendered page is taken over as it stands (no repaint, nothing typed is lost). Anything else (the 404
// fallback, the dev server) is drawn from scratch.
const root = document.getElementById("root")!;
const slash = (s: string) => (s.length > 1 ? s.replace(/\/$/, "") : s);
const drawn = root.querySelector<HTMLElement>("main[data-path]")?.dataset.path;
const here = slash(window.location.pathname), base = slash(import.meta.env.BASE_URL);
const app = <StrictMode><App /></StrictMode>;
// Taken over in a transition, so React works in slices and a tap or a scroll is never kept waiting behind it.
if (!p && drawn !== undefined && (slash(drawn) === here || (drawn === `${base}/` && here === base))) startTransition(() => { hydrateRoot(root, app); });
else { goLive(); root.textContent = ""; createRoot(root).render(app); }
