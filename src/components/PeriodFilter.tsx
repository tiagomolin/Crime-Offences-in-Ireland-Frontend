import { useFilters } from "../contexts/FiltersContext";
import Form from "react-bootstrap/Form";
import "../styles/periodFilter.scss";
import { Col, Container, Row } from "react-bootstrap";

interface Period {
  _id: string;
  period_number: number;
  complete_quarter: string;
  year: number;
  quarter: string;
}

interface Periods {
  selected_quarter: number;
  is_from: boolean;
  is_to: boolean;
  periods: Period[];
}

export function PeriodFilter(props: Periods) {
  const {
    selectedPeriodFrom,
    setSelectedPeriodFrom,
    selectedPeriodTo,
    setSelectedPeriodTo,
  } = useFilters();

  const selectedPeriodNumber = props.is_from ? selectedPeriodFrom : selectedPeriodTo;
  const selectedPeriod = props.periods.find(
    (period) => period.period_number === selectedPeriodNumber
  );

  const uniqueYears = Array.from(new Set(props.periods.map((period) => period.year)))
    .filter((year) => year > 0)
    .sort((a, b) => a - b);
  const uniqueQuarters = Array.from(new Set(props.periods.map((period) => period.quarter)))
    .filter(Boolean)
    .sort();

  function commitPeriod(period: Period | undefined) {
    if (!period) return;

    if (props.is_from) {
      setSelectedPeriodFrom(Math.min(period.period_number, selectedPeriodTo));
    } else {
      setSelectedPeriodTo(Math.max(period.period_number, selectedPeriodFrom));
    }
  }

  function handleSelectedYearChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const year = Number(event.target.value);
    const quarter = selectedPeriod?.quarter || "Q1";
    const period = props.periods.find((item) => item.year === year && item.quarter === quarter)
      || props.periods.find((item) => item.year === year);
    commitPeriod(period);
  }

  function handleSelectedQuarterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const quarter = event.target.value;
    const year = selectedPeriod?.year;
    const period = props.periods.find((item) => item.year === year && item.quarter === quarter);
    commitPeriod(period);
  }

  return (
    <div className="period-filter">
      <Container fluid={true} className="g-0">
        <Row className="g-0">
          <Col md={7}>
            <Form.Select
              size="lg"
              aria-label={`${props.is_from ? "From" : "To"} year`}
              value={selectedPeriod?.year ?? ""}
              onChange={handleSelectedYearChange}
              disabled={!selectedPeriod}
            >
              {uniqueYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={5}>
            <Form.Select
              size="lg"
              aria-label={`${props.is_from ? "From" : "To"} quarter`}
              value={selectedPeriod?.quarter ?? ""}
              onChange={handleSelectedQuarterChange}
              disabled={!selectedPeriod}
            >
              {uniqueQuarters.map((quarter) => (
                <option key={quarter} value={quarter}>{quarter}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
