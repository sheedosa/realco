import { useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { Header, Footer } from "./components/Layout";
import { EnquiryDrawer } from "./components/EnquiryDrawer";
import { EnquiryProvider } from "./lib/enquiry";
import { Home } from "./pages/Home";
import { Lettings } from "./pages/Lettings";
import { Stays, StayPage } from "./pages/Stays";
import { Build, ProjectPage } from "./pages/Build";
import { About } from "./pages/About";
import { NotFound } from "./pages/NotFound";

/** Marks <main> with the path it is showing, so a shared-element page change knows when the new page is in. */
function Main({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return <main id="main" data-path={import.meta.env.BASE_URL.replace(/\/$/, "") + (pathname === "/" ? "/" : pathname.replace(/\/$/, ""))}>{children}</main>;
}

/** A new page starts at the top, at once (never a smooth scroll through the old one); Back and Forward return to
    where the person was on that page; an in-page anchor lands on its target. */
const places = new Map<string, number>();
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  const at = useRef(key), first = useRef(true);
  useEffect(() => {
    const note = () => { places.set(at.current, window.scrollY); };
    window.addEventListener("scroll", note, { passive: true });
    return () => window.removeEventListener("scroll", note);
  }, []);
  useLayoutEffect(() => {
    at.current = key;
    if (first.current) { first.current = false; if (!hash) return; } // a fresh load: the browser restores its own place
    if (hash) { document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant" }); return; }
    window.scrollTo({ top: type === "POP" ? places.get(key) ?? 0 : 0, behavior: "instant" });
  }, [pathname, hash, key]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** Everything inside the router. The prerender renders this same tree, so the first paint and React agree. */
export function Shell() {
  return (
    <EnquiryProvider>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-paper focus:px-4 focus:py-3 focus:text-ink">Skip to content</a>
      <Header />
      <Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lettings" element={<Lettings />} />
          <Route path="/lettings/:handle" element={<Navigate to="/lettings" replace />} />
          <Route path="/stays" element={<Stays />} />
          <Route path="/stays/:handle" element={<StayPage />} />
          <Route path="/build" element={<Build />} />
          <Route path="/build/:handle" element={<ProjectPage />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Main>
      <Footer />
      <EnquiryDrawer />
    </EnquiryProvider>
  );
}

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL}><Shell /></BrowserRouter>;
}
