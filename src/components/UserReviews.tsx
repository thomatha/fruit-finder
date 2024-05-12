"useClient"
import { useSession } from 'next-auth/react'
import React from 'react'
import { useUserReviews } from '@/hooks/useUserReviews';
import UserBadge from './UserBadge';

function UserReviews() {

  const {data} = useSession();
  const userID = data?.user?.id;

  const res = useUserReviews(userID);

  return (
    <div>
      <br/>
      <h1 className='text-4xl font-extrabold dark:text-white'>Your Reviews:</h1> <br/>
      {res.user ? (
        res.user.map(review => (
          <>
          <div className='card w-96 bg-base-100 shadow-xl' key={review.id}>
            <UserBadge />
            <div id="reviewRating" className="rating">
                                <input type="radio" id="rating-1" className="mask mask-star" checked={review.rating == 1} readOnly />
                                <input type="radio" id="rating-2" className="mask mask-star" checked={review.rating == 2} readOnly />
                                <input type="radio" id="rating-3" className="mask mask-star" checked={review.rating == 3} readOnly />
                                <input type="radio" id="rating-4" className="mask mask-star" checked={review.rating == 4} readOnly />
                                <input type="radio" id="rating-5" className="mask mask-star" checked={review.rating == 5} readOnly />
                                </div>
            <p className='card-body'>{review.review_text}</p>
          </div>
          <br/>
          </>
        ))
      ) : (
        <div>Reviews Loading...</div>
      )}
    </div>
  )
}

export default UserReviews
