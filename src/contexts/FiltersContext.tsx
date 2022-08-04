import { createContext, useState, useContext, FC } from "react";
import axios from "axios";

interface Offence {
  division_number: number;
  period_number: number;
  offence_count: number;
}

interface Period {
  _id: string;
  period_number: number;
  complete_quarter: string;
  year: number;
  quarter: string;
}

interface Division {
  division_number: number;
  division_description: string;
  coordinates?: [number[]];
}

interface IFiltersContext {
  selectPredictedData: boolean;
  selectedPeriodFrom: number;
  selectedPeriodTo: number;
  selectedOffences: string[];
  offenceMapData: Offence[];
  selectedDivision: Division;
  offenceGraphData: Offence[];
  periods: Period[];
  gardaDivisions: Division[];
  setSelectPredictedData: (value: boolean) => void;
  setSelectedPeriodFrom: (value: number) => void;
  setSelectedPeriodTo: (value: number) => void;
  setSelectedOffences: (value: string[]) => void;
  fetchOffenceMapData: () => void;
  pickDivision: (value: Division) => void;
  setPeriods: (value: Period[]) => void;
  setGardaDivisions: (value: Division[]) => void;
}

const defaultState = {
  selectPredictedData: false,
  //default period is Q1 2003
  selectedPeriodFrom: 1,
  //default period is Q4 2021
  selectedPeriodTo: 76,
  //default all
  selectedOffences: [
    "0",
    "01",
    "0111",
    "0112",
    "0113",
    "012",
    "02",
    "021",
    "022",
    "03",
    "0311",
    "0312",
    "033",
    "034",
    "035",
    "04",
    "0411",
    "0412",
    "0413",
    "0421",
    "0422",
    "0423",
    "0424",
    "0425",
    "05",
    "0511",
    "0512",
    "0513",
    "06",
    "0611",
    "0612",
    "0613",
    "0621",
    "0631",
    "07",
    "0711",
    "0712",
    "0713",
    "08",
    "081",
    "0821",
    "0822",
    "084",
    "09",
    "090",
    "10",
    "1011",
    "1012",
    "1021",
    "1022",
    "103",
    "11",
    "111",
    "1121",
    "1122",
    "113",
    "114",
    "12",
    "1211",
    "1212",
    "1221",
    "13",
    "131",
    "132",
    "133",
    "134",
    "135",
    "136",
    "15",
    "151",
    "152",
    "153",
    "157",
  ],
  offenceMapData: [],
  selectedDivision: {} as Division,
  offenceGraphData: [],
  periods: [
    { _id: "0", period_number: 0, complete_quarter: "", year: 0, quarter: "" },
  ],
  gardaDivisions: [],
  setSelectPredictedData: (value: boolean) => {},
  setSelectedPeriodFrom: (value: number) => {},
  setSelectedPeriodTo: (value: number) => {},
  setSelectedOffences: (value: string[]) => {},
  fetchOffenceMapData: () => {},
  pickDivision: (value: Division) => {},
  setPeriods: (value: Period[]) => {},
  setGardaDivisions: (value: Division[]) => {},
};

const FiltersContext = createContext<IFiltersContext>(defaultState);

export const FiltersProvider: FC = ({ children }) => {
  const [selectPredictedData, setSelectPredictedData] = useState<boolean>(
    defaultState.selectPredictedData
  );
  const [selectedPeriodFrom, setSelectedPeriodFrom] = useState<number>(
    defaultState.selectedPeriodFrom
  );
  const [selectedPeriodTo, setSelectedPeriodTo] = useState<number>(
    defaultState.selectedPeriodTo
  );
  const [selectedOffences, setSelectedOffences] = useState<string[]>(
    defaultState.selectedOffences
  );

  const [offenceMapData, setOffenceMapData] = useState<Offence[]>([]);
  const [selectedDivision, setSelectedDivision] = useState({} as Division);
  const [offenceGraphData, setOffenceGraphData] = useState<Offence[]>([]);
  const [periods, setPeriods] = useState<Period[]>(defaultState.periods);
  const [gardaDivisions, setGardaDivisions] = useState<Division[]>([]);

  function pickDivision(value: Division) {
    setSelectedDivision(value);
    fetchOffenceGraphData(value.division_number);
  }

  function returnCategoriesFilter() {
    //maps though selectedOffences and creatFilter json object listing all categories

    interface Category {
      category: string;
    }

    const offenceMap: Category[] = [];

    selectedOffences.map((offence) => {
      offenceMap.push({
        category: offence,
      });
    });

    return offenceMap;
  }

  function fetchOffenceGraphData(division?: number) {
    const offenceMap = returnCategoriesFilter();

    const req_data = {
      data: {
        initial_period_number: selectedPeriodFrom,
        final_period_number: selectedPeriodTo,
        division_number: division ? division : null,
        categories: offenceMap,
      },
    };

    axios
      .post("https://irish-crime-data.herokuapp.com/crimes_period", req_data)
      .then((response) => {
        const mapped = response.data.map((res: any) => {
          return {
            division_number: res.division_number,
            period_number: res.period_number,
            offence_count: res.offence_count,
          };
        });
        setOffenceGraphData(mapped);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //creates a function that fetches the data from the api
  function fetchOffenceMapData() {
    const offenceMap = returnCategoriesFilter();

    const req_data = {
      data: {
        initial_period_number: selectedPeriodFrom,
        final_period_number: selectedPeriodTo,
        categories: offenceMap,
      },
    };

    axios
      .post("https://irish-crime-data.herokuapp.com/crimes", req_data)
      .then((response) => {
        const mapped = response.data.map((res: any) => {
          return {
            division_number: res.division_number,
            period_number: parseInt(""),
            offence_count: res.offence_count,
          };
        });
        setOffenceMapData(mapped);
      })
      .catch((error) => {
        console.log(error);
      });

    //populates the graph with data from the api, with no division filter
    fetchOffenceGraphData();
    setSelectedDivision({} as Division);
  }

  return (
    <FiltersContext.Provider
      value={{
        selectPredictedData,
        selectedPeriodFrom,
        selectedPeriodTo,
        selectedOffences,
        offenceMapData,
        selectedDivision,
        offenceGraphData,
        periods,
        gardaDivisions,
        setSelectPredictedData,
        setSelectedPeriodFrom,
        setSelectedPeriodTo,
        setSelectedOffences,
        fetchOffenceMapData,
        pickDivision,
        setPeriods,
        setGardaDivisions,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => {
  return useContext(FiltersContext);
};
