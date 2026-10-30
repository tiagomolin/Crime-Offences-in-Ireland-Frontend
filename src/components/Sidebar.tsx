import "../styles/sidebar.scss";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { CrimeOffences } from "./CrimeOffences";
import { Periods } from "./Periods";

export function Sidebar() {
  return (
    <Navbar bg="light" expand="lg" className="main-navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto col-md-12 d-md-block  sidebar">
          <div className="sidebar-heading">
            <p className="eyebrow">Explore the data</p>
            <h2>Filters</h2>
            <p className="sidebar-description">Choose offence categories and a time range.</p>
          </div>
          <Nav.Item>
            <CrimeOffences />
          </Nav.Item>
          <Nav.Item>
            <Periods />
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
