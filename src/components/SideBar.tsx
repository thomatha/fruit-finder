"use client";

import React from "react";
import { useState } from "react";
import SlidingPanel from "react-sliding-side-panel";
import Image from "next/image";
import defaultFruitImg from "../../public/img/default_fruit.png";
import Modal from "../components/ReviewModal";
import { FruitLocationReview } from "@/types";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useSession } from "next-auth/react";
import useWindowDimensions from "../hooks/useWindowDimensions";

const SideBar = ({
  openPanel,
  setOpenPanel,
  selectedFruit,
  selectedReviews,
  avgRating,
  reviewCount,
  refreshReviewData,
  reviewModal,
  selectedLocation,
  setEditModalOpen,
  setDeleteModalOpen,
}) => {
  const [panelSection, setPanelSection] = useState(0);
  const { data } = useSession();
  const { width } = useWindowDimensions();
  // const [selectedReviews, avgRating, reviewCount, setSelectedReviews] = useLocationReviews();
  return (
    <SlidingPanel
      type={"left"}
      isOpen={openPanel}
      backdropClicked={() => setOpenPanel(false)}
      size={
        width > 1225 ?
          22
        : 
        width > 1000 ?
          28
        :
        width > 850 ?
          34
        :
        width > 750 ?
          40
        :
        width > 600 ?
          46
        :
          75
      }
      panelClassName=""
      panelContainerClassName="my-20 bg-base-100"
      noBackdrop={true}
    >
      {/* TODO:
       * Remove panel close button, or stick it to bottom of panel (with relative positioning?)
       */}
      <div className="panel-container grid grid-cols-1 gap-4 content-evenly text-center">
        {selectedFruit && selectedFruit.img_link ? (
          <Image
            src={selectedFruit.img_link}
            alt="fruit_tree_image"
            height={250}
            width={450}
          ></Image>
        ) : (
          <Image
            src={defaultFruitImg}
            alt="default_fruit_tree_image"
            height={250}
            width={450}
          ></Image>
        )}
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
              <p className="whitespace-pre-wrap mb-4">
                {selectedFruit?.description}
              </p>
              {data?.user?.id && data?.user?.id === selectedFruit?.user_id ?
              <div>
                <div><span className="font-semibold text-xs">(You submitted this fruit tree)</span></div>
                <div>
                    <button className="btn btn-sm mb-2" onClick={() => {
                        setEditModalOpen(true);
                        setDeleteModalOpen(false);
                    }}>
                        <PencilSquareIcon className="h-6 w-6" />{" "}
                        <span className="hidden md:inline">Edit</span>
                    </button>
                </div>
                <div>
                    <button className="btn btn-sm" onClick={() => {
                        setDeleteModalOpen(true);
                        setEditModalOpen(false);
                    }}>
                        <TrashIcon className="h-6 w-6" />{" "}
                        <span className="hidden md:inline">Delete</span>
                    </button>
                </div>
              </div>
              : <></>}
            </div>
          ) : (
            <div>
              <div className="flex stats shadow mt-2 mb-4 justify-center">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <div className="rating rating-md rating-half">
                      <input
                        type="radio"
                        name="rating-10"
                        className="rating-hidden"
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-1"
                        checked={avgRating == 0.5}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-2"
                        checked={avgRating == 1.0}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-1"
                        checked={avgRating == 1.5}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-2"
                        checked={avgRating == 2.0}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-1"
                        checked={avgRating == 2.5}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-2"
                        checked={avgRating == 3.0}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-1"
                        checked={avgRating == 3.5}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-2"
                        checked={avgRating == 4.0}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-1"
                        checked={avgRating == 4.5}
                        readOnly
                      />
                      <input
                        type="radio"
                        name="rating-10"
                        className="mask mask-star-2 mask-half-2"
                        checked={avgRating == 5.0}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="stat-value">{avgRating}</div>
                  <div className="stat-desc">{reviewCount} reviews</div>
                </div>
              </div>
              <div className="flex justify-center">
                <Modal
                  treeId={selectedLocation}
                  treeDesc={selectedFruit ? selectedFruit.name : ""}
                  onReviewSubmit={refreshReviewData}
                />
                <button
                  className="btn btn-outline"
                  onClick={() => reviewModal()}
                >
                  Write a Review
                </button>
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
                          <input
                            type="radio"
                            id="rating-1"
                            className="mask mask-star"
                            checked={locationReview.rating == 1}
                            readOnly
                          />
                          <input
                            type="radio"
                            id="rating-2"
                            className="mask mask-star"
                            checked={locationReview.rating == 2}
                            readOnly
                          />
                          <input
                            type="radio"
                            id="rating-3"
                            className="mask mask-star"
                            checked={locationReview.rating == 3}
                            readOnly
                          />
                          <input
                            type="radio"
                            id="rating-4"
                            className="mask mask-star"
                            checked={locationReview.rating == 4}
                            readOnly
                          />
                          <input
                            type="radio"
                            id="rating-5"
                            className="mask mask-star"
                            checked={locationReview.rating == 5}
                            readOnly
                          />
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
  );
};

export default SideBar;
