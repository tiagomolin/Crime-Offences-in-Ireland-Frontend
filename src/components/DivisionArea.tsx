import { Polygon, Tooltip } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useState } from "react";
import { useFilters } from "../contexts/FiltersContext";

interface OffenceCountDivision {
  division_number: number;
  division_description: string;
  offence_count: number;
  coordinates: LatLngExpression[];
  color: string;
}

export function DivisionArea(props: OffenceCountDivision) {
  const [fillOpacity, setFillOpacity] = useState(0.5);

  //rgb(128, 0, 38)
  //rgb(255, 237, 160)

  const { pickDivision } = useFilters();

  function handleClick() {
    pickDivision({
      division_number: props.division_number,
      division_description: props.division_description,
    });
  }

  return (
    <div className="division-area">
      <Polygon
        key={props.division_number}
        positions={props.coordinates}
        pathOptions={{
          color: props.color,
          opacity: 0.5,
          fillColor: props.color,
          fillOpacity: fillOpacity,
        }}
        eventHandlers={{
          mouseover() {
            setFillOpacity(1);
          },
          mouseout() {
            setFillOpacity(0.5);
          },
          click() {
            handleClick();
          },
        }}
      >
        <Tooltip>
          {props.division_description}
          <br />
          Crime Offences: {props.offence_count.toLocaleString()}
        </Tooltip>
      </Polygon>
    </div>
  );
}
