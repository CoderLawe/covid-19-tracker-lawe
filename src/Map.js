import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";
// import { showDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom }) {
  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <MapContainer
      casesType={casesType}
      className="map"
      center={center}
      zoom={zoom}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* {showDataOnMap(countries, casesType)} */}

    
      {/* We need a function that will loop through the countries, and draw circles on the screen */}
    {/* The size of the circles will vary based on the number of cases in that country */}
    {showDataOnMap(countries,casesType)}
    </MapContainer>
  );
}

export default Map;