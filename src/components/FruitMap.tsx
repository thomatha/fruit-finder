"use client";

import { useState } from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function FruitMap({ token }) {
  const state = useGeolocation();
  const [isStreet, setIsStreet] = useState(true);

  if (state.loading) {
    // TODO show spinner or loading indicator
    return <p>Loading... (you may need to enable permissions)</p>;
  }

  if (state.error) {
    return <p>Enable permissions to access your location data</p>;
  }

  return (
    <>
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: state.longitude,
          latitude: state.latitude,
          zoom: 16,
        }}
        // TODO - make height fill view port:
        style={{ height: "88vh" }}
        mapStyle={
          isStreet
            ? "mapbox://styles/mapbox/streets-v12"
            : "mapbox://styles/mapbox/satellite-streets-v12"
        }
      >
        <Marker longitude={state.longitude} latitude={state.latitude} />
      </Map>

      <div className="navbar bg-white fixed bottom-0 z-10">
        <div className="navbar-start"></div>
        <div className="navbar-center"></div>
        <div className="navbar-end">
          <button
            className={`btn btn-sm mr-2 ${isStreet ? "btn-active" : ""}`}
            onClick={() => setIsStreet(true)}
          >
            Street
          </button>
          <button
            className={`btn btn-sm ${isStreet ? "" : "btn-active"}`}
            onClick={() => setIsStreet(false)}
          >
            Satellite
          </button>
        </div>
      </div>
    </>
  );
}
