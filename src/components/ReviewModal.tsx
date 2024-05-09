"use client";
import { useState } from 'react';
import UserBadge from "@/components/UserBadge";
import { useSession } from "next-auth/react";
import { toast } from 'react-toastify';

function Modal({ treeId, treeDesc, onReviewSubmit }) {
    const { data } = useSession();

    function handleClose() {
        (document.getElementById('review_modal') as HTMLDialogElement).close();
        (document.getElementById("reviewForm") as HTMLFormElement).reset();
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        let formElements = event.currentTarget.elements;
        let rating = selectedRating;
        let userId = data?.user?.id;
        console.log(data);
        console.log(userId);
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
        (document.getElementById('review_modal') as HTMLDialogElement).close();
        (document.getElementById("reviewForm") as HTMLFormElement).reset();
    }

    const [selectedRating, setSelectedRating] = useState('5');

    return (
        <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Leave a Review!</h3>
                <UserBadge />
                <p id="treeModal">{treeDesc}</p>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <form method="dialog" onSubmit={handleSubmit} id="reviewForm">
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
                        <div className="modal-action">
                            {/* if there is a button in form, it will close the modal */}
                            <button type="button" onClick={() => { handleClose(); }} className="btn btn-xs btn-square btn-ghost absolute right-2 top-2">✕</button>
                            <button type="button" className="btn" onClick={() => { handleClose(); }}>Close</button>
                            <input className="btn btn_primary modal-btn" type="submit" value="Post" />
                        </div>
                    </div>
                </form>
            </div>
        </dialog >
    );
}

export default Modal;
