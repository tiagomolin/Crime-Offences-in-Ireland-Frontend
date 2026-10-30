import axios from "axios";
import { API_BASE_URL } from "../config";
import { useEffect, useState } from "react";
import { PeriodFilter } from "./PeriodFilter";
//import { Offence } from "./Offence";
import { useFilters } from "../contexts/FiltersContext";

export function Periods() {
  const { periods, setPeriods } = useFilters();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/periods`)
      .then((response) => setPeriods(response.data));
  }, []);

  return (
    <div className="periods-filter">
      <h3>Time period</h3>
      <div className="period-range">
        <div className="period-range-field">
          <span className="period-field-label">From</span>
        <PeriodFilter
          key="from"
          selected_quarter={1}
          is_from={true}
          is_to={false}
          periods={periods}
        />
        </div>
        <div className="period-range-field">
          <span className="period-field-label">To</span>
        <PeriodFilter
          key="to"
          selected_quarter={76}
          is_from={false}
          is_to={true}
          periods={periods}
        />
        </div>
      </div>
    </div>
  );
}
