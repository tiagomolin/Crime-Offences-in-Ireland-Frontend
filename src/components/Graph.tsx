import { useFilters } from "../contexts/FiltersContext";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import "../styles/graph.scss";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export function Graph() {
  const {
    offenceGraphData,
    periods,
    selectedDivision,
    isGraphLoading,
    graphError,
    fetchOffenceGraphData,
  } = useFilters();

  const [graphData, setGraphData] = useState<any>({
    labels: [],
    datasets: [],
  });

  function returnCompleteQuarter(period_number: number) {
    //finds the complete quarter from periods array where period_number is the period number
    const complete_quarter = periods.find(
      (period) => period.period_number === period_number
    )?.complete_quarter;
    return complete_quarter;
  }

  function transposeDataGraphData() {
    //iterates through offenceGraphData
    //and creates a new array of objects with the label and data
    //and sets the graphData state
    const newGraphData = {
      labels: [] as string[],
      datasets: [
        {
          label: "Crime Data",
          data: [] as number[],
          borderColor: "#176b70",
          backgroundColor: "rgba(23, 107, 112, 0.09)",
          borderWidth: 2.5,
          tension: 0.28,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "#123d45",
        },
      ],

      fill: true,
    };
    offenceGraphData.forEach((offence) => {
      const complete_quarter = returnCompleteQuarter(offence.period_number);
      if (complete_quarter) {
        newGraphData.labels.push(complete_quarter);
      }
      newGraphData.datasets[0].data.push(offence.offence_count);
    });
    setGraphData(newGraphData);
  }

  useEffect(() => {
    transposeDataGraphData();
  }, [offenceGraphData, periods]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: "index" as const },
    animation:
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? false
        : { duration: 480 },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#123d45",
        titleColor: "#fff",
        bodyColor: "#e6f1ef",
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y.toLocaleString()} offences`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#74858a",
          maxTicksLimit: 9,
          maxRotation: 0,
          font: { size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: "rgba(31, 61, 72, 0.08)" },
        ticks: {
          color: "#74858a",
          maxTicksLimit: 6,
          font: { size: 11 },
          callback: (value: string | number) => Number(value).toLocaleString(),
        },
      },
    },
  };

  const gardaDescription = selectedDivision.division_description
    ? selectedDivision.division_description
    : "All Divisions";

  return (
    <div className="graph-data">
      <p className="section-kicker">Trend over time</p>
      <h2>Recorded offences <span className="graph-location">{gardaDescription}</span></h2>
      {graphError ? (
        <div className="graph-state graph-state-error" role="alert">
          <span>{graphError}</span>
          <button
            type="button"
            onClick={() => fetchOffenceGraphData(selectedDivision.division_number)}
          >
            Try again
          </button>
        </div>
      ) : isGraphLoading ? (
        <div className="chart-skeleton" role="status" aria-label="Loading quarterly figures">
          <div className="skeleton-axis" />
          <div className="skeleton-chart">
            <span /><span /><span /><span /><span />
          </div>
          <div className="skeleton-ticks"><i /><i /><i /><i /><i /></div>
        </div>
      ) : graphData.labels.length > 0 ? (
        <div className="chart-frame">
          <Line data={graphData} options={options} />
        </div>
      ) : (
        <div className="graph-empty" role="status">
          <span className="graph-empty-mark" aria-hidden="true">↗</span>
          <span>No quarterly figures are available for this selection.</span>
        </div>
      )}
    </div>
  );
}
