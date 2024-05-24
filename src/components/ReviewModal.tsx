"use client";
import UserBadge from "@/components/UserBadge";
import { useSession } from "next-auth/react";
import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { toast } from "react-hot-toast";

function ReviewModal({ treeId, treeDesc, onReviewSubmit }) {
    const { data } = useSession();
    function handleSubmit(event: any) {
        event.preventDefault();
        let formElements = event.currentTarget.elements;
        let rating = selectedRating;
        let userId = data?.user?.id;
        let reviewData = JSON.stringify({
            treeId: treeId,
            userId: userId,
            rating: Number(rating),
            text: formElements.reviewText.value
        });
        const fetchData = async () => {
            // PUT request using fetch inside useEffect React hook
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: reviewData
                };
                const response = await fetch('/api/reviews', requestOptions);
                const data = await response.json();
                if (!response.ok) {
                    toast.error('The was an error submitting your review.');
                }
                else {
                    onReviewSubmit();
                    toast.success('Your review has been submitted!');
                }
            }
            catch (err) {
                toast.error('The was an error submitting your review.');
            }
        };
        fetchData();
        setOpen(false);
    }

    const [selectedRating, setSelectedRating] = useState('5');
    const [open, setOpen] = useState(false)
    const cancelButtonRef = useRef(null)

    return (
        <div>
            <button className="btn btn-outline" onClick={() => setOpen(true)}>
                Write a Review
            </button>
            <Transition.Root show={open} as={Fragment}>
                <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-0 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <form method="dialog" className="mt-3" onSubmit={handleSubmit} id="reviewForm">
                                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                            <div className="mx-auto flex flex-shrink-0 items-center justify-left">
                                                <UserBadge />
                                            </div>
                                            <div className="sm:flex sm:items-start mt-3">
                                                <div className="mt-3 text-center sm:ml-4 sm:mt-0">
                                                    <Dialog.Title as="h3" className="text-2xl leading-8 sm:text-center font-semibold text-gray-900">
                                                        {treeDesc}
                                                    </Dialog.Title>
                                                    <div className="mt-2 sm:text-left">


                                                        <input type="hidden" id="treeId" name="treeId" value="" />
                                                        <div id="reviewRating" className="rating">
                                                            <input type="radio" id="rating-1" value="1" name="rating-1" className="mask mask-star" onChange={(e) => setSelectedRating(e.target.value)} />
                                                            <input type="radio" id="rating-2" value="2" name="rating-1" className="mask mask-star" onChange={(e) => setSelectedRating(e.target.value)} />
                                                            <input type="radio" id="rating-3" value="3" name="rating-1" className="mask mask-star" onChange={(e) => setSelectedRating(e.target.value)} />
                                                            <input type="radio" id="rating-4" value="4" name="rating-1" className="mask mask-star" onChange={(e) => setSelectedRating(e.target.value)} />
                                                            <input type="radio" id="rating-5" value="5" name="rating-1" className="mask mask-star" onChange={(e) => setSelectedRating(e.target.value)} />
                                                        </div>
                                                        <div className="py-2">
                                                            <label htmlFor="reviewText" className="mb-8">Write Your Review:</label>
                                                            <textarea id="reviewText" placeholder="Leave your thoughts about the fruit here" className="textarea textarea-bordered textarea-md w-full" ></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                            <input className="mt-3 ml-3 inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-500 sm:mt-0 sm:w-auto" type="submit" value="Post" />
                                            <button
                                                type="button"
                                                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 sm:ml-3 sm:w-auto"
                                                onClick={() => setOpen(false)}
                                            > Close
                                            </button>
                                            <button type="button" onClick={() => setOpen(false)} className="btn btn-xs btn-square btn-ghost absolute right-2 top-2">✕</button>

                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}

export default ReviewModal;
