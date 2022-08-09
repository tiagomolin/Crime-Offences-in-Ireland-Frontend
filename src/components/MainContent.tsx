import "../styles/mainPage.scss";
import { Map } from "./Map";
import { Graph } from "./Graph";
import { Container, Row } from "react-bootstrap";

export function MainContent() {
  return (
    <>
      <Container fluid className="main-content">
        <Row className="header-main-content">
          <h1>Crime Offences in Ireland</h1>
          <p>
            This website displays <b>figures*</b> regarding crime offences in
            Ireland for all the Garda Divisions with a map visual
            representation.
          </p>
          <p>
            The user may choose one or many types of crime offences and the
            period they want to see data for, using the Filter Data section and
            later click on the map to see the crime data for that Garda Division
            on a graph for the choosen period.
          </p>
          <p className="paragraph-header-legend">
            *Details on data resources are described at the bootom of the page.
          </p>
        </Row>
        <Row className="transition-header-map" />
        <Row className="map-container-row">
          <Map />
        </Row>
        <Row className="graph-container-row">
          <Graph />
        </Row>
        <Row className="footer-main-content">
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
        </Row>
      </Container>
    </>
  );
}
