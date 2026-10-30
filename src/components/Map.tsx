import { useFilters } from "../contexts/FiltersContext";
import { useEffect, useState } from "react";
import "../styles/map.scss";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import Legend from "./Legend";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { DivisionArea } from "./DivisionArea";

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
    isMapLoading,
    mapError,
    gardaDivisions,
    setGardaDivisions,
  } = useFilters();

  const [minOffenceCount, setMinOffenceCount] = useState(0);
  const [maxOffenceCount, setMaxOffenceCount] = useState(0);
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(true);
  const [divisionsError, setDivisionsError] = useState<string | null>(null);

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

  const baseBestColor = { red: 21, green: 83, blue: 92 };
  const baseWrostColor = { red: 217, green: 238, blue: 232 };

  function getProportionalColor(offenceCount: number) {
    const counts = offenceMapData.map((offence) => offence.offence_count);
    if (!counts.length) return "#d9eee8";

    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);
    const proportion =
      maxCount === minCount
        ? 0.5
        : Math.max(
            0,
            Math.min(1, (offenceCount - minCount) / (maxCount - minCount))
          );
    const red = Math.round(
      baseWrostColor.red + (baseBestColor.red - baseWrostColor.red) * proportion
    );
    const green = Math.round(
      baseWrostColor.green +
        (baseBestColor.green - baseWrostColor.green) * proportion
    );
    const blue = Math.round(
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
    if (offenceMapData.length) {
      setMinOffenceCount(
        Math.min(...offenceMapData.map((o) => o.offence_count))
      );
      setMaxOffenceCount(
        Math.max(...offenceMapData.map((o) => o.offence_count))
      );
    } else {
      setMinOffenceCount(0);
      setMaxOffenceCount(0);
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
    setIsLoadingDivisions(true);
    setDivisionsError(null);
    axios
      .get(`${API_BASE_URL}/divisions`)
      .then((response) => {
        const mapped = response.data.map((res: any) => {
          return {
            division_number: res.division_number,
            division_description: res.division_description,
            coordinates: res.coordinates,
          };
        });
        setGardaDivisions(mapped);
        setIsLoadingDivisions(false);
      })
      .catch((error) => {
        console.log(error);
        setDivisionsError("Garda division boundaries could not be loaded.");
        setIsLoadingDivisions(false);
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
        <div className="map-heading">
          <div>
            <p className="section-kicker">Geographic view</p>
            <h2>Recorded offences by Garda division</h2>
          </div>
          <p className="section-hint">Select a division to explore its figures</p>
        </div>
        {mapError && (
          <div className="map-state map-state-error" role="alert">
            <span>{mapError}</span>
            <button type="button" onClick={fetchOffenceMapData}>Try again</button>
          </div>
        )}
        {divisionsError && (
          <div className="map-state map-state-error" role="alert">
            <span>{divisionsError}</span>
            <button type="button" onClick={fetchDivisions}>Try again</button>
          </div>
        )}
        {isMapLoading && !mapError && (
          <div className="map-loading-state" role="status">
            <span className="map-loading-dot" /> Loading offence counts for the current selection
          </div>
        )}
        {!isLoadingDivisions && !divisionsError && gardaDivisions.length === 0 && (
          <div className="map-state map-state-empty" role="status">
            No Garda division boundaries are available.
          </div>
        )}
        {!isMapLoading && !mapError && offenceMapData.length === 0 && (
          <div className="map-state map-state-empty" role="status">
            No offence counts are available for this selection.
          </div>
        )}
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
