"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useGeolocation } from "@uidotdev/usehooks";
import Map, { Marker, type MapRef } from "react-map-gl";
import { PlusCircleIcon } from "@heroicons/react/16/solid";
import useNearbyFruits from "@/hooks/useNearbyFruits";
import useSpecificFruit from "@/hooks/useSpecificFruit";
import useLocationReviews from "@/hooks/useLocationReviews";
import "mapbox-gl/dist/mapbox-gl.css";
import { FruitLocation } from "@/types";
import { FruitLocationReview } from "@/types";
import fruitIcon from "@/utils/fruitIcon";

import SlidingPanel from "react-sliding-side-panel";
import Image from "next/image";
import AddModal from "./AddModal";
import Modal from "../components/ReviewModal";

export default function FruitMap({ token }) {
  const mapRef = useRef<MapRef>();
  const state = useGeolocation();
  const [modalOpen, setModalOpen] = useState(false);
  const { status } = useSession();
  const [fruits, setBounds] = useNearbyFruits();
  const [isStreet, setIsStreet] = useState(true);
  const [selectedFruit, setSelectedFruit] = useSpecificFruit();
  const [selectedReviews, avgRating, reviewCount, setSelectedReviews] = useLocationReviews();
  const [openPanel, setOpenPanel] = useState(false);
  const [panelSection, setPanelSection] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(false);

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

  const panelLoad = async (id: number) => {
    setSelectedFruit(id);
    setSelectedReviews(id, forceRefresh);
    setSelectedLocation(id);
    setOpenPanel(true);
  };

  function reviewModal() {
    (document.getElementById('review_modal') as HTMLDialogElement).showModal();
  };

  const refreshReviewData = () => {
    setForceRefresh(!forceRefresh);
    setTimeout(() => {
      setSelectedReviews(selectedLocation, forceRefresh);
    }, 0);
  };

  return (
    <>
      <div>
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
          onDragStart={() => {
            setOpenPanel(false);
          }}
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
                key={fruitLocation.id} //TODO: this is causing a lot of Warning: Each child in a list should have a unique "key" prop. errors in the log
                latitude={fruitLocation.latitude}
                longitude={fruitLocation.longitude}
                offset={[0, -20]}
                // Unsure about this behavior. Could see user wanting to keep panel on screen as they navigate around
                onClick={() => {
                  setOpenPanel(false);
                  panelLoad(fruitLocation.id);
                }}
              >
                <span className="text-xl">
                  {fruitIcon(fruitLocation.fruit)}
                </span>
              </Marker>
            </>
          ))}
          <Marker longitude={state.longitude} latitude={state.latitude} />
        </Map>
      </div>

      <div className="navbar bg-white fixed bottom-0 z-10">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          {status === "authenticated" ? (
            <button
              className="btn btn-primary"
              onClick={() => setModalOpen(true)}
            >
              <PlusCircleIcon className="h-6 w-6" /> Add Fruit
            </button>
          ) : (
            // TODO show log in button if user not logged in
            <></>
          )}
        </div>
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
      <SlidingPanel
        type={"left"}
        isOpen={openPanel}
        backdropClicked={() => setOpenPanel(false)}
        size={22}
        panelClassName=""
        panelContainerClassName="my-20 bg-base-100"
        noBackdrop={true}
      >
        {/* TODO:
         * Remove panel close button, or stick it to bottom of panel (with relative positioning?)
         * Build out review list interface, with each review probably needing username, rating, and comment (optional)
         * Edit button - probably far easier if this takes user to a route w/ a form. Only visible if user created this location
         */}
        <div className="panel-container grid grid-cols-1 gap-4 content-evenly text-center">
          <Image
            src={selectedFruit ? selectedFruit.img_link : ""}
            alt="fruit_tree_image"
            height={250}
            width={450}
          ></Image>
          <div className="px-4 text-start">
            <div>
              <span className="font-semibold text-lg">
                {selectedFruit ? selectedFruit.name : ""}
              </span>
            </div>
            {/*Reviews average, placeholder until fleshing out that system more*/}
          </div>
          <div className="grid grid-cols-2 px-4">
            <div>
              <button
                className="btn btn-sm col-span-1"
                onClick={() => setPanelSection(0)}
              >
                Overview
              </button>
            </div>
            <div>
              <button
                className="btn btn-sm col-span-1"
                onClick={() => setPanelSection(1)}
              >
                Reviews
              </button>
            </div>
          </div>
          <div className="text-start px-4">
            {panelSection === 0 ? (
              <div>
                <p>{selectedFruit ? selectedFruit.description : ""}</p>
              </div>
            ) : (
                <div>
                  <div className="flex stats shadow mt-2 mb-4 justify-center">
                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <div className="rating rating-md rating-half">
                          <input type="radio" name="rating-10" className="rating-hidden" />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-1" checked={avgRating == 0.5} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-2" checked={avgRating == 1.0} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-1" checked={avgRating == 1.5} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-2" checked={avgRating == 2.0} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-1" checked={avgRating == 2.5} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-2" checked={avgRating == 3.0} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-1" checked={avgRating == 3.5} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-2" checked={avgRating == 4.0} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-1" checked={avgRating == 4.5} readOnly />
                          <input type="radio" name="rating-10" className="mask mask-star-2 mask-half-2" checked={avgRating == 5.0} readOnly />
                        </div>
                      </div>   
                      <div className="stat-value">{avgRating}</div>
                      <div className="stat-desc">{reviewCount} reviews</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Modal treeId={selectedLocation} treeDesc={selectedFruit ? selectedFruit.name : ''} onReviewSubmit={refreshReviewData} />
                    <button className="btn btn-outline" onClick={() => reviewModal()}>Write a Review</button>
                  </div>
                  <div id="reviewList">
                    {selectedReviews.map((locationReview: FruitLocationReview) => (
                      <>
                        <div className="card bg-base-100 shadow-xl my-2">
                          <div className="card-body px-2">
                            <div className="p-3">
                              <img
                                src={locationReview.user_img}
                                alt={locationReview.user_name}
                                width={32}
                                height={32}
                                className="rounded-full border-solid border-current border inline-block mr-1"
                              />
                              {locationReview.user_name}
                            </div>
                            <div id="reviewRating" className="rating">
                              <input type="radio" id="rating-1" className="mask mask-star" checked={locationReview.rating == 1} readOnly />
                              <input type="radio" id="rating-2" className="mask mask-star" checked={locationReview.rating == 2} readOnly />
                              <input type="radio" id="rating-3" className="mask mask-star" checked={locationReview.rating == 3} readOnly />
                              <input type="radio" id="rating-4" className="mask mask-star" checked={locationReview.rating == 4} readOnly />
                              <input type="radio" id="rating-5" className="mask mask-star" checked={locationReview.rating == 5} readOnly />
                            </div>
                            <p>{locationReview.created}</p>
                            <p>{locationReview.review_text}</p>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
            )}
          </div>
          <button
            type="button"
            className="close-button btn btn-sm mx-4 mt-18"
            onClick={() => setOpenPanel(false)}
          >
            Close Panel
          </button>
        </div>
      </SlidingPanel>
      <div></div>

      {/* Conditionally render modal so state is reset each time opened */}
      {modalOpen ? (
        <AddModal
          token={token}
          lat={state.latitude}
          lng={state.longitude}
          onAdd={() => {
            setModalOpen(false);
            updateBounds();
            // TODO notify user of successful add
          }}
          onClose={() => setModalOpen(false)}
        />
      ) : (
        <></>
      )}
    </>
  );
}
