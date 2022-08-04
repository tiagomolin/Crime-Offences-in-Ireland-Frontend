import axios from "axios";
import { useEffect, useState } from "react";
import { PeriodFilter } from "./PeriodFilter";
//import { Offence } from "./Offence";
import { useFilters } from "../contexts/FiltersContext";

export function Periods() {
  const { periods, setPeriods } = useFilters();

  useEffect(() => {
    axios
      .get("https://irish-crime-data.herokuapp.com/periods")
      .then((response) => setPeriods(response.data));
  }, []);

  return (
    <div className="periods-filter">
      <h3>Period</h3>
      <ul>
        <li>From</li>
        <PeriodFilter
          key="from"
          selected_quarter={1}
          is_from={true}
          is_to={false}
          periods={periods}
        />

        <li>To</li>
        <PeriodFilter
          key="to"
          selected_quarter={76}
          is_from={false}
          is_to={true}
          periods={periods}
        />
      </ul>
    </div>
  );
}
