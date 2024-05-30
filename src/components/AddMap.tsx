import { useRef, useState } from 'react';
import Map, { Marker, type MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import fruitIcon from '@/utils/fruitIcon';

export default function AddMap({ fruit, latitude, longitude, token, onClick }) {
  const mapRef = useRef<MapRef>();
  const [isStreet, setIsStreet] = useState(false);

  return (
    <>
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: 19,
        }}
        style={{ height: '30vh' }}
        mapStyle={
          isStreet
            ? 'mapbox://styles/mapbox/streets-v12'
            : 'mapbox://styles/mapbox/satellite-streets-v12'
        }
        onClick={(e) => {
          onClick(e.lngLat.lat, e.lngLat.lng);
        }}
      >
        <Marker latitude={latitude} longitude={longitude} color="white" />
        <Marker latitude={latitude} longitude={longitude} offset={[0, -20]}>
          <span className="text-xl">{fruitIcon(fruit)}</span>
        </Marker>
      </Map>
    </>
  );
}
