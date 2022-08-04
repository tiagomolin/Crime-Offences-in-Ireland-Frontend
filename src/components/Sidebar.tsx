import { Button, Col, Row, Container } from "react-bootstrap";
import "../styles/sidebar.scss";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { CrimeOffences } from "./CrimeOffences";
import { Periods } from "./Periods";
import { useFilters } from "../contexts/FiltersContext";

export function Sidebar() {
  const { fetchOffenceMapData } = useFilters();

  function handleApplyFilters() {
    fetchOffenceMapData();
  }
  return (
    <Navbar bg="light" expand="lg" className="main-navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto col-md-12 d-md-block  sidebar">
          <h1>Filter Data</h1>
          <Nav.Item>
            <CrimeOffences />
          </Nav.Item>
          <Nav.Item>
            <Periods />
          </Nav.Item>
          <Nav.Item className="btn-apply-filter">
            <Container>
              <Row>
                <Button variant="light" onClick={handleApplyFilters} size="lg">
                  <b>Apply Filters</b>
                </Button>
              </Row>
            </Container>
          </Nav.Item>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
