import axios from "axios";
import { API_BASE_URL } from "../config";
import { useEffect, useState } from "react";
import { PeriodFilter } from "./PeriodFilter";
//import { Offence } from "./Offence";
import { useFilters } from "../contexts/FiltersContext";

export function Periods() {
  const { periods, setPeriods } = useFilters();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  function fetchPeriods() {
    setIsLoading(true);
    setLoadError(null);
    axios
      .get(`${API_BASE_URL}/periods`)
      .then((response) => {
        setPeriods(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadError("Available quarters could not be loaded.");
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchPeriods();
  }, []);

  return (
    <div className="periods-filter">
      <h3>Time period</h3>
      {loadError ? (
        <div className="period-state period-state-error" role="alert">
          <span>{loadError}</span>
          <button type="button" onClick={fetchPeriods}>Try again</button>
        </div>
      ) : isLoading ? (
        <div className="period-skeleton" role="status" aria-label="Loading available quarters">
          <i /><i /><i />
        </div>
      ) : periods.length > 1 ? (
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
      ) : (
        <p className="period-empty">No time periods are available.</p>
      )}
    </div>
  );
}
