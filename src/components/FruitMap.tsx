"use client";

import { useState } from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function FruitMap({ token }) {
  const state = useGeolocation();
  const [isStreet, setIsStreet] = useState(true);

  if (state.loading) {
    return <p>loading... (you may need to enable permissions)</p>;
  }

  if (state.error) {
    return <p>Enable permissions to access your location data</p>;
  }

  return (
    <>
      <div className="mb-2">
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
      <Map
        mapboxAccessToken={token}
        initialViewState={{
          longitude: state.longitude,
          latitude: state.latitude,
          zoom: 16,
        }}
        // TODO - make height fill view port:
        style={{ height: "90vh" }}
        mapStyle={
          isStreet
            ? "mapbox://styles/mapbox/streets-v12"
            : "mapbox://styles/mapbox/satellite-streets-v12"
        }
      >
        <Marker longitude={state.longitude} latitude={state.latitude} />
      </Map>
    </>
  );
}
