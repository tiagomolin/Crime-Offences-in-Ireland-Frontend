import { MainContent } from "./components/MainContent";
import "./styles/global.scss";
import { FiltersProvider } from "./contexts/FiltersContext";
import { Sidebar } from "./components/Sidebar";

export function App() {
  return (
    <FiltersProvider>
      <div className="app-shell">
        <header className="site-header">
          <div className="site-header-inner">
            <div className="header-meta">
              <p className="eyebrow">IRELAND · RECORDED CRIME</p>
              <span className="date-range">2003—2023</span>
            </div>
            <h1>Crime Offences in Ireland</h1>
            <p className="header-description">
              Explore recorded offences by Garda division, category, and quarter.
              Forecasts are included for 2022 and 2023.
            </p>
          </div>
        </header>
        <aside className="app-sidebar" aria-label="Crime data filters">
          <Sidebar />
        </aside>
        <main className="app-main">
          <MainContent />
        </main>
      </div>
    </FiltersProvider>
  );
}
