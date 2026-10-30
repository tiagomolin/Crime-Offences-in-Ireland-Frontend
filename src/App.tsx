import { useEffect, useRef } from "react";
import { MainContent } from "./components/MainContent";
import "./styles/global.scss";
import { FiltersProvider, useFilters } from "./contexts/FiltersContext";
import { Sidebar } from "./components/Sidebar";

export function App() {
  return (
    <FiltersProvider>
      <Dashboard />
    </FiltersProvider>
  );
}

function Dashboard() {
  const headerRef = useRef<HTMLElement | null>(null);
  const { offenceMapData, gardaDivisions } = useFilters();
  const hasData = offenceMapData.length > 0;
  const currentTotal = offenceMapData.reduce(
    (total, division) => total + division.offence_count,
    0
  );

  useEffect(() => {
    const header = headerRef.current;
    const artwork = header?.querySelector<HTMLElement>(".site-header-art");
    if (!header || !artwork) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopLayout = window.matchMedia("(min-width: 992px)");
    const shell = header.parentElement;
    let frame = 0;
    let headerHeight = header.offsetHeight;

    const syncHeaderHeight = () => {
      headerHeight = header.offsetHeight;
      shell?.style.setProperty("--sticky-header-height", `${headerHeight}px`);
    };

    const updateArtwork = () => {
      if (desktopLayout.matches && window.scrollY > 8) {
        header.classList.add("is-compact");
      } else if (!desktopLayout.matches || window.scrollY <= 0) {
        header.classList.remove("is-compact");
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (reducedMotion.matches) {
          artwork.style.setProperty("--header-parallax-y", "0px");
          artwork.style.setProperty("--header-art-opacity", "1");
          return;
        }

        const progress = Math.min(Math.max(window.scrollY / headerHeight, 0), 1);
        artwork.style.setProperty("--header-parallax-y", `${progress * headerHeight * 0.16}px`);
        artwork.style.setProperty("--header-art-opacity", `${1 - progress * 0.62}`);
      });
    };
    const updateHeight = () => {
      syncHeaderHeight();
      updateArtwork();
    };

    const resizeObserver = new ResizeObserver(syncHeaderHeight);
    resizeObserver.observe(header);
    syncHeaderHeight();
    window.addEventListener("scroll", updateArtwork, { passive: true });
    window.addEventListener("resize", updateHeight, { passive: true });
    reducedMotion.addEventListener("change", updateArtwork);
    desktopLayout.addEventListener("change", updateHeight);
    updateArtwork();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      shell?.style.removeProperty("--sticky-header-height");
      window.removeEventListener("scroll", updateArtwork);
      window.removeEventListener("resize", updateHeight);
      reducedMotion.removeEventListener("change", updateArtwork);
      desktopLayout.removeEventListener("change", updateHeight);
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="site-header" ref={headerRef}>
        <div className="site-header-art" aria-hidden="true">
          <img src="/images/ireland-tidal-atlas-header.png" alt="" />
        </div>
        <div className="site-header-inner">
          <div className="hero-copy">
            <div className="header-meta">
              <p className="eyebrow">IRELAND <span> / </span> RECORDED CRIME</p>
              <span className="date-range">2003—2023 <span>·</span> RECORDED + FORECAST</span>
            </div>
            <h1>
              <span>Crime offences</span>
              <span>in <em>Ireland.</em></span>
            </h1>
            <p className="header-description">
              A closer look at recorded crime across Ireland. Explore patterns by
              Garda division, offence category, and quarter.
            </p>
          </div>
          <aside className="hero-snapshot" aria-label="Current map summary">
            <div className="snapshot-topline">
              <span className="snapshot-kicker">Current map view</span>
              <span className="snapshot-indicator" aria-hidden="true" />
            </div>
            <p className="snapshot-value" aria-live="polite">
              {hasData ? currentTotal.toLocaleString() : "—"}
            </p>
            <p className="snapshot-label">offences across mapped divisions</p>
            <div className="snapshot-divider" />
            <div className="snapshot-foot">
              <span className="snapshot-count">
                {gardaDivisions.length ? gardaDivisions.length : "—"}
              </span>
              <span className="snapshot-foot-label">Garda divisions</span>
              <span className="snapshot-foot-period">2003—2023</span>
            </div>
            <div className="snapshot-orbit" aria-hidden="true" />
          </aside>
        </div>
      </header>
      <aside className="app-sidebar" aria-label="Crime data filters">
        <Sidebar />
      </aside>
      <main className="app-main">
        <MainContent />
      </main>
    </div>
  );
}
