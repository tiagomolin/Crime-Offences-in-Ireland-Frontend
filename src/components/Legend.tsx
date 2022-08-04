import { useEffect } from "react";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";
import "../styles/map.scss";
//import "./Legend.css";

interface LegendProps {
  minOffenceCount: number;
  maxOffenceCount: number;
}

function Legend(props: LegendProps) {
  const map = useMapEvents({});
  useEffect(() => {
    if (map && props.minOffenceCount !== Infinity) {
      const legend = new L.Control({ position: "bottomright" });

      var controlContainer = map
        .getContainer()
        .getElementsByClassName("leaflet-bottom leaflet-right")[0];

      if (controlContainer) {
        controlContainer.innerHTML = "";
      }

      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info-legend");
        div.innerHTML =
          "<h5>Crime Offences</h5>" +
          "<div class='legend-box'>" +
          "  <div class='legend-values'>" +
          `    <h3>${props.maxOffenceCount.toLocaleString()}</h3>` +
          `    <h3>${props.minOffenceCount.toLocaleString()}</h3>` +
          "  </div>" +
          "  <div class='legend-scale'>" +
          `    <div class="legend-color-box""></div>` +
          "  </div>" +
          "</div>";
        return div;
      };

      map.addControl(legend);
      console.log("map ", map);
    }
  }, [map, props.minOffenceCount]);
  return null;
}

export default Legend;
