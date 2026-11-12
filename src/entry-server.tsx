// Used only by scripts/prerender.mjs: the page as React first renders it, so the prerendered HTML and the running
// site start from the same markup.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Shell } from "./App";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
export const render = (route: string) => renderToString(<StrictMode><StaticRouter basename={BASE} location={BASE + route}><Shell /></StaticRouter></StrictMode>);
