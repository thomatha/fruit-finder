"use client";

import { useRef, useState } from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import Map, { Marker, type MapRef } from "react-map-gl";
import useNearbyFruits from "@/hooks/useNearbyFruits";
import "mapbox-gl/dist/mapbox-gl.css";
import { FruitLocation } from "@/types";
import fruitIcon from "@/utils/fruitIcon";

export default function FruitMap({ token }) {
  const mapRef = useRef<MapRef>();
  const state = useGeolocation();
  const [fruits, setBounds] = useNearbyFruits();
  const [isStreet, setIsStreet] = useState(true);

  if (state.loading) {
    // TODO show spinner or loading indicator
    return <p>Loading... (you may need to enable permissions)</p>;
  }

  if (state.error) {
    return <p>Enable permissions to access your location data</p>;
  }

  const updateBounds = () => {
    const bounds = mapRef.current?.getBounds();
    setBounds(
      bounds?._ne.lat,
      bounds?._ne.lng,
      bounds?._sw.lng,
      bounds?._sw.lat
    );
  };

  return (
    <>
      <Map
        ref={mapRef}
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
        onDragEnd={updateBounds}
        onLoad={updateBounds}
        onZoomEnd={updateBounds}
      >
        {fruits.map((fruitLocation: FruitLocation) => (
          <>
            <Marker
              key={`${fruitLocation.id}-bg`}
              latitude={fruitLocation.latitude}
              longitude={fruitLocation.longitude}
              color="white"
            />
            <Marker
              key={fruitLocation.id}
              latitude={fruitLocation.latitude}
              longitude={fruitLocation.longitude}
              offset={[0, -20]}
            >
              <span className="text-xl">{fruitIcon(fruitLocation.fruit)}</span>
            </Marker>
          </>
        ))}
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
