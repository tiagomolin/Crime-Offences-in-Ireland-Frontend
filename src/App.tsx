import { MainContent } from "./components/MainContent";
import "./styles/global.scss";
import { FiltersProvider } from "./contexts/FiltersContext";
import { Sidebar } from "./components/Sidebar";
import { Container, Row, Col } from "react-bootstrap";

export function App() {
  return (
    <FiltersProvider>
      <Container fluid={true}>
        <Row>
          <Col lg={3} className="col-sidebar">
            <Sidebar />
          </Col>
          <Col lg={9} className="col-main-content">
            <MainContent />
          </Col>
        </Row>
      </Container>
    </FiltersProvider>
  );
}
