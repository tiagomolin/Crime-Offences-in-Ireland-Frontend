import { useEffect, useRef } from "react";
import "../styles/mainPage.scss";
import { Map } from "./Map";
import { Graph } from "./Graph";

export function MainContent() {
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const artwork = footer?.querySelector<HTMLElement>(".footer-artwork");
    if (!footer || !artwork) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const updateArtwork = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (reducedMotion.matches) {
          artwork.style.setProperty("--footer-parallax-y", "0px");
          artwork.style.setProperty("--footer-art-opacity", "1");
          return;
        }

        const bounds = footer.getBoundingClientRect();
        const progress = Math.min(
          Math.max((window.innerHeight - bounds.top) / (window.innerHeight + bounds.height), 0),
          1
        );
        artwork.style.setProperty("--footer-parallax-y", `${progress * Math.min(bounds.height * 0.14, 100)}px`);
        artwork.style.setProperty("--footer-art-opacity", `${1 - progress * 0.48}`);
      });
    };

    window.addEventListener("scroll", updateArtwork, { passive: true });
    window.addEventListener("resize", updateArtwork, { passive: true });
    reducedMotion.addEventListener("change", updateArtwork);
    updateArtwork();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateArtwork);
      window.removeEventListener("resize", updateArtwork);
      reducedMotion.removeEventListener("change", updateArtwork);
    };
  }, []);

  return (
    <div className="main-content">
      <section className="map-container-row" aria-label="Crime offences map">
        <Map />
      </section>
      <section className="graph-container-row" aria-label="Crime offences chart">
        <Graph />
      </section>
      <footer className="footer-main-content" ref={footerRef}>
          <div className="footer-artwork" aria-hidden="true">
            <img src="/images/ireland-tidal-atlas-header.png" alt="" />
          </div>
          <p>
            This website was developed by Tiago Molin, Student ID 21115281, as
            part of the Project module for the Machine Learning Fundamentals
            (H8MLF) HDAIML SEPOL Course of National College of Ireland
          </p>
          <p>
            Crime offences figures from 2003 to 2021 were stracted directly from
            the{" "}
            <a
              href="https://data.cso.ie/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Central Statistics Office of Ireland
            </a>{" "}
            under "Home / Crime & Justice / Recorded Crime / CJQ06 - Recorded
            Crime Offences under Reservation" menu.
          </p>
          <p>
            Crime data for 2022 and 2023 was pedicted using a Machine Learning
            algorithm, though the use TensorFlow python library and the creation
            and training of models for each type of offence. The model was
            designed as a multi-layer dense model with the input layer receiving
            figures for four consecutive quarters, two hidden layers with 32
            neurons each, and the output layer with the prediction for the
            upcoming quarter. The results were evaluated using the mean absolute
            error (MAE) which was aproximately 0.4 for the described model.
          </p>
          <p>
            The Garda Division mapping was made based on the official Garda
            division map available on the{" "}
            <a
              href="https://www.garda.ie/en/about-us/organisational-structure/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Garda Organisational structure
            </a>{" "}
            website.
          </p>
          <p>
            All the crime offences figures are absolute numbers and do not
            consider the population density for that particular Garda Division
            area.
          </p>
      </footer>
    </div>
  );
}
