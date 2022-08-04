import { useFilters } from "../contexts/FiltersContext";
import { useEffect, useState } from "react";
import "../styles/map.scss";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  MapContainerProps,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import Legend from "./Legend";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { DivisionArea } from "./DivisionArea";

//import "leaflet/dist/leaflet.css";

interface OffenceCountDivision {
  division_number: number;
  division_description: string;
  offence_count: number;
  coordinates: LatLngExpression[];
  color: string;
}

export function Map() {
  const {
    offenceMapData,
    fetchOffenceMapData,
    pickDivision,
    gardaDivisions,
    setGardaDivisions,
  } = useFilters();

  const [minOffenceCount, setMinOffenceCount] = useState(0);
  const [maxOffenceCount, setMaxOffenceCount] = useState(0);

  function returnCrimeOffencesCount(division_number: number) {
    //finds the offenceMapData for the division_number
    const offenceCount = offenceMapData.find(
      (offence) => offence.division_number === division_number
    );

    if (offenceCount) {
      return offenceCount.offence_count;
    }
    return 0;
  }

  const baseBestColor = { red: 128, green: 0, blue: 38 };
  const baseWrostColor = { red: 255, green: 237, blue: 160 };

  function getProportionalColor(offenceCount: number) {
    var red: number = 0;
    var green: number = 0;
    var blue: number = 0;

    const proportion =
      (offenceCount - Math.min(...offenceMapData.map((o) => o.offence_count))) /
      (Math.max(...offenceMapData.map((o) => o.offence_count)) -
        Math.min(...offenceMapData.map((o) => o.offence_count)));
    red = Math.round(
      baseWrostColor.red + (baseBestColor.red - baseWrostColor.red) * proportion
    );
    green = Math.round(
      baseWrostColor.green +
        (baseBestColor.green - baseWrostColor.green) * proportion
    );
    blue = Math.round(
      baseWrostColor.blue +
        (baseBestColor.blue - baseWrostColor.blue) * proportion
    );

    function componentToHex(c: number) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r: number, g: number, b: number) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    return rgbToHex(red, green, blue);
  }

  function findOffenceCountDivision() {
    const offenceCountDivisions: OffenceCountDivision[] = [];
    gardaDivisions.map((division) => {
      const coordinates = division.coordinates as unknown;
      offenceCountDivisions.push({
        division_number: division.division_number,
        division_description: division.division_description,
        offence_count: returnCrimeOffencesCount(division.division_number),
        coordinates: coordinates as LatLngExpression[],
        color: getProportionalColor(
          returnCrimeOffencesCount(division.division_number)
        ),
      });
    });
    return offenceCountDivisions;
  }

  useEffect(() => {
    if (offenceMapData) {
      setMinOffenceCount(
        Math.min(...offenceMapData.map((o) => o.offence_count))
      );
      setMaxOffenceCount(
        Math.max(...offenceMapData.map((o) => o.offence_count))
      );
    }
  }, [offenceMapData]);

  useEffect(() => {
    if (offenceMapData && gardaDivisions) {
      setOffenceCountDivision(findOffenceCountDivision());
    }
  }, [offenceMapData, gardaDivisions]);

  const [offenceCountDivision, setOffenceCountDivision] = useState<
    OffenceCountDivision[]
  >([]);

  function fetchDivisions() {
    axios
      .get("https://irish-crime-data.herokuapp.com/divisions")
      .then((response) => {
        const mapped = response.data.map((res: any) => {
          return {
            division_number: res.division_number,
            division_description: res.division_description,
            coordinates: res.coordinates,
          };
        });
        setGardaDivisions(mapped);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchDivisions();
    fetchOffenceMapData();
  }, []);

  const center: LatLngExpression = [53.4, -7.9];

  return (
    <div className="map-data">
      <div className="map">
        <h1>Choropleth Map for Ireland Crime Offences</h1>
        <MapContainer
          center={center}
          zoom={7}
          minZoom={5}
          zoomControl={false}
          style={{ height: "70vh" }}
        >
          <Legend
            minOffenceCount={minOffenceCount}
            maxOffenceCount={maxOffenceCount}
          />
          {offenceCountDivision.map((division) => {
            return (
              <DivisionArea
                division_number={division.division_number}
                division_description={division.division_description}
                offence_count={division.offence_count}
                coordinates={division.coordinates}
                color={division.color}
                key={division.division_number}
              />
            );
          })}

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ZoomControl position="topright" />
        </MapContainer>
      </div>
    </div>
  );
}
