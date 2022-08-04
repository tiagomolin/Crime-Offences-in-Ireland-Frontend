import { useFilters } from "../contexts/FiltersContext";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import "../styles/graph.scss";
import { Chart, registerables } from "chart.js";

export function Graph() {
  Chart.register(...registerables);

  const { offenceGraphData, periods, selectedDivision } = useFilters();

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
          borderColor: "rgb(224, 57, 113)",
        },
      ],

      fill: true,
    };
    newGraphData.datasets.push();
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
  }, [offenceGraphData]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Crime Offences/Period",
      },
    },
  };

  const gardaDescription = selectedDivision.division_description
    ? selectedDivision.division_description
    : "All Divisions";

  return (
    <div className="graph-data">
      <h1>Crime Data for {gardaDescription}</h1>
      <Line data={graphData} options={options} />
    </div>
  );
}
