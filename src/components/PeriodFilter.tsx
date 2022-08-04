import { useState, useEffect } from "react";
//import { Offence } from "./Offence";
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

  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedQuarter, setSelectedQuarter] = useState("");

  //finds the year from periods list where the selected period is located
  useEffect(() => {
    if (props.is_from) {
      setSelectedYear(2003);
      setSelectedQuarter("Q1");
      setSelectedPeriod(selectedPeriodFrom);
    } else {
      setSelectedYear(2021);
      setSelectedQuarter("Q4");
      setSelectedPeriod(selectedPeriodTo);
    }
  }, []);

  function handleSelectedPeriodChange() {
    //tests if the list of periods is fetched
    if (props.periods.length > 1) {
      const find_period = props.periods.find(
        (period) =>
          period.year === selectedYear && period.quarter === selectedQuarter
      );

      //Sets the selected period to the selected period
      if (find_period) {
        setSelectedPeriod(find_period!.period_number);
        if (props.is_from) {
          setSelectedPeriodFrom(find_period!.period_number);
        } else {
          setSelectedPeriodTo(find_period!.period_number);
        }
      }
    }
  }

  useEffect(() => {
    handleSelectedPeriodChange();
  }, [selectedYear, selectedQuarter]);

  const uniqueYears = props.periods
    .map((item) => item.year)
    .filter((value, index, self) => self.indexOf(value) === index);

  const uniqueQuarters = props.periods
    .map((item) => item.quarter)
    .filter((value, index, self) => self.indexOf(value) === index);

  function handleSelectedYearChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedYear(parseInt(event.target.value));
  }

  function handleSelectedQuarterChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setSelectedQuarter(event.target.value);
  }

  return (
    <div className="period-filter">
      <Container fluid={true} className="g-0">
        <Row className="g-0">
          <Col md={7}>
            <Form.Select
              size="lg"
              value={selectedYear}
              onChange={handleSelectedYearChange}
            >
              {uniqueYears.map((year) => {
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
          <Col md={5}>
            <Form.Select
              size="lg"
              value={selectedQuarter}
              onChange={handleSelectedQuarterChange}
            >
              {uniqueQuarters.map((quarter) => {
                return (
                  <option key={quarter} value={quarter}>
                    {quarter}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
