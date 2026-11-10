import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
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
  return <main id="main" data-path={import.meta.env.BASE_URL.replace(/\/$/, "") + pathname}>{children}</main>;
}

function ScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); else window.scrollTo(0, 0); }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <EnquiryProvider>
        <ScrollTop />
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
    </BrowserRouter>
  );
}
