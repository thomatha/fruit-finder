'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useGeolocation } from '@uidotdev/usehooks';
import Map, { Marker, type MapRef } from 'react-map-gl';
import {
  PlusCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/16/solid';
import {
  GlobeEuropeAfricaIcon,
  MapIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import useNearbyFruits from '@/hooks/useNearbyFruits';
import useSpecificFruit from '@/hooks/useSpecificFruit';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Fruit, FruitLocation } from '@/types';
import fruitIcon from '@/utils/fruitIcon';
import AddModal from './AddModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import SideBar from './SideBar';
import SearchBar from './SearchBar';
import FruitFilter from './FruitFilter';
import ToasterAlert from '@/components/ToasterAlert';
import { toast } from 'react-hot-toast';
import useWindowWidth from '../hooks/useWindowWidth';

export default function FruitMap({ token, requestParams }) {
  const initialState = isNaN(Number(requestParams.data)) ? false : true;
  const mapRef = useRef<MapRef>();
  const state = useGeolocation({ enableHighAccuracy: true });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { status } = useSession();
  const [fruits, setBounds, setFruitFilter] = useNearbyFruits();
  const [isStreet, setIsStreet] = useState(true);
  const [selectedFruit, setSelectedFruit] = useSpecificFruit(
    initialState ? Number(requestParams.data) : 1,
  );
  const [openPanel, setOpenPanel] = useState(initialState ? true : false);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const { width } = useWindowWidth();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [followMe, setFollowMe] = useState(
    !(requestParams.lat && requestParams.lng),
  );
  const initialLat = requestParams.lat ? requestParams.lat : null;
  const initialLng = requestParams.lng ? requestParams.lng : null;

  useEffect(() => {
    if (followMe) {
      mapRef.current?.setCenter([state.longitude, state.latitude]);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  if (state.loading) {
    return (
      <div className="w-100 h-screen flex items-center justify-center text-2xl text-gray-500">
        <span className="loading loading-spinner loading-lg mr-2"></span>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="w-100 h-screen flex items-center justify-center text-2xl text-red-500">
        <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
        Enable permissions to access your location data
      </div>
    );
  }

  const updateBounds = () => {
    const bounds = mapRef.current?.getBounds();
    setBounds(
      bounds?._ne.lat,
      bounds?._ne.lng,
      bounds?._sw.lng,
      bounds?._sw.lat,
    );
  };

  const panelLoad = async (id: number) => {
    setSelectedFruit(id);
    setSelectedLocation(id);
    setOpenPanel(true);
  };

  const retrieveSearch = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let searchTxt = String(formData.get('searchText'));
    if (searchTxt != '') {
      const fetchSearch = async () => {
        const searchResponse = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchTxt}&types=place,country,region,city&access_token=${token}&session_token=${token}`,
        );
        const searchData = await searchResponse.json();
        if (!searchResponse.ok) {
          toast.error('Error retreiving your search suggestions.');
        } else {
          if (searchData.suggestions.length > 0) {
            let suggestionId = searchData.suggestions[0].mapbox_id;
            const fetchSuggestion = async () => {
              const suggestionResponse = await fetch(
                `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestionId}?access_token=${token}&session_token=${token}`,
              );
              const suggestionData = await suggestionResponse.json();
              if (!suggestionResponse.ok) {
                toast.error('Error retreiving your search location.');
              } else {
                if (suggestionData) {
                  let coords = suggestionData.features[0].properties.bbox;
                  mapRef.current?.fitBounds(coords);
                }
              }
            };
            fetchSuggestion();
          } else {
            toast.error('No locations found. Please try a new search.');
          }
        }
      };
      fetchSearch();
    }
  };

  return (
    <>
      <div>
        <Map
          ref={mapRef}
          mapboxAccessToken={token}
          initialViewState={{
            longitude: initialLng ? initialLng : state.longitude,
            latitude: initialLat ? initialLat : state.latitude,
            zoom: 16,
          }}
          // TODO - make height fill view port:
          style={{ height: '88vh' }}
          mapStyle={
            isStreet
              ? 'mapbox://styles/mapbox/streets-v12'
              : 'mapbox://styles/mapbox/satellite-streets-v12'
          }
          onDragEnd={updateBounds}
          onLoad={updateBounds}
          onZoomStart={() => setFollowMe(false)}
          onZoomEnd={updateBounds}
          onDragStart={() => {
            setOpenPanel(false);
            setFollowMe(false);
            setSelectedFruit(null);
          }}
        >
          <div className="mapboxgl-ctrl-top-right">
            <SearchBar onSearchSubmit={retrieveSearch} />
            <FruitFilter
              handleFilter={(fruit: Fruit) => {
                setFruitFilter(fruit.id === -1 ? undefined : fruit);
              }}
            />
          </div>
          {fruits.map((fruitLocation: FruitLocation) => (
            <Fragment key={fruitLocation.id}>
              <Marker
                latitude={fruitLocation.latitude}
                longitude={fruitLocation.longitude}
                color="white"
              />
              <Marker
                latitude={fruitLocation.latitude}
                longitude={fruitLocation.longitude}
                offset={[0, -20]}
                // Unsure about this behavior. Could see user wanting to keep panel on screen as they navigate around
                onClick={() => {
                  setSelectedFruit(null);
                  setOpenPanel(false);
                  panelLoad(fruitLocation.id);
                }}
              >
                <span className="text-xl">
                  {fruitIcon(fruitLocation.fruit)}
                </span>
              </Marker>
            </Fragment>
          ))}
          <Marker longitude={state.longitude} latitude={state.latitude} />
        </Map>
      </div>

      <div className="navbar bg-white fixed bottom-0 z-10">
        <div className="navbar-start">
          {!followMe && (
            <button
              className="btn btn-sm"
              onClick={() => {
                mapRef.current?.flyTo({
                  center: [state.longitude, state.latitude],
                });
                setFollowMe(true);
              }}
            >
              <MapPinIcon className="h-6 w-6" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
        <div className="navbar-center">
          {status === 'authenticated' ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                setAddModalOpen(true);
                if (width < 1225) {
                  setOpenPanel(false);
                }
              }}
            >
              <PlusCircleIcon className="h-6 w-6" />{' '}
              <span className="hidden md:inline">Add Fruit</span>
            </button>
          ) : (
            // TODO show log in button if user not logged in
            <></>
          )}
        </div>
        <div className="navbar-end">
          <div className="join">
            <button
              className={`btn btn-sm join-item ${isStreet ? 'btn-active' : ''}`}
              onClick={() => setIsStreet(true)}
            >
              <MapIcon className="h-6 w-6" />
              <span className="hidden md:inline">Street</span>
            </button>
            <button
              className={`btn btn-sm join-item ${isStreet ? '' : 'btn-active'}`}
              onClick={() => setIsStreet(false)}
            >
              <GlobeEuropeAfricaIcon className="h-6 w-6" />
              <span className="hidden md:inline">Satellite</span>
            </button>
          </div>
        </div>
      </div>
      <SideBar
        openPanel={openPanel && selectedFruit}
        setOpenPanel={setOpenPanel}
        selectedFruit={selectedFruit}
        selectedLocation={selectedLocation}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      />
      <div></div>
      <ToasterAlert />
      {/* Conditionally render modal so state is reset each time opened */}
      {addModalOpen ? (
        <AddModal
          token={token}
          lat={state.latitude}
          lng={state.longitude}
          onAdd={() => {
            setAddModalOpen(false);
            updateBounds();
            // TODO notify user of successful add
          }}
          onClose={() => setAddModalOpen(false)}
        />
      ) : (
        <></>
      )}

      {editModalOpen ? (
        <EditModal
          token={token}
          tree={selectedFruit}
          onEdit={() => {
            setEditModalOpen(false);
            updateBounds();
            setOpenPanel(false);
            setSelectedFruit(null);
            // TODO notify user of successful edit
          }}
          onClose={() => setEditModalOpen(false)}
        />
      ) : (
        <></>
      )}

      {deleteModalOpen ? (
        <DeleteModal
          tree={selectedFruit}
          onDelete={() => {
            setDeleteModalOpen(false);
            updateBounds();
            setOpenPanel(false);
            setSelectedFruit(null);
            // TODO notify user of successful delete
          }}
          onClose={() => setDeleteModalOpen(false)}
        />
      ) : (
        <></>
      )}
    </>
  );
}
