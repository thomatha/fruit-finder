'use client';

import React from 'react';
import { useState } from 'react';
import SlidingPanel from 'react-sliding-side-panel';
import Image from 'next/image';
import defaultFruitImg from '../../public/img/default_fruit.png';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useSession } from 'next-auth/react';
import useWindowWidth from '../hooks/useWindowWidth';

const SideBar = ({
  openPanel,
  setOpenPanel,
  selectedFruit,
  selectedLocation,
  setEditModalOpen,
  setDeleteModalOpen,
}) => {
  const { data } = useSession();
  const { width } = useWindowWidth();

  return (
    <SlidingPanel
      type={'left'}
      isOpen={openPanel}
      backdropClicked={() => setOpenPanel(false)}
      size={
        width > 1225
          ? 22
          : width > 1000
            ? 28
            : width > 850
              ? 34
              : width > 750
                ? 40
                : width > 600
                  ? 46
                  : 75
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
              {selectedFruit ? selectedFruit.name : ''}
            </span>
          </div>
        </div>
        <div className="text-start px-4">
          <div>
            <p className="whitespace-pre-wrap mb-4">
              {selectedFruit?.description}
            </p>
            {data?.user?.id && data?.user?.id === selectedFruit?.user_id ? (
              <div>
                <div>
                  <span className="font-semibold text-xs">
                    (You submitted this fruit tree)
                  </span>
                </div>
                <div>
                  <button
                    className="btn btn-sm mb-2"
                    onClick={() => {
                      setEditModalOpen(true);
                      setDeleteModalOpen(false);
                      if (width < 1225) {
                        setOpenPanel(false);
                      }
                    }}
                  >
                    <PencilSquareIcon className="h-6 w-6" />{' '}
                    <span className="hidden md:inline">Edit</span>
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setEditModalOpen(false);
                      if (width < 1225) {
                        setOpenPanel(false);
                      }
                    }}
                  >
                    <TrashIcon className="h-6 w-6" />{' '}
                    <span className="hidden md:inline">Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
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
