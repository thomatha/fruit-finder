"useClient"
import { useSession } from 'next-auth/react'
import React from 'react'
import { useUserReviews } from '@/hooks/useUserReviews';
import UserBadge from './UserBadge';
import Link from 'next/link';

function UserReviews() {

  const {data} = useSession();
  const userID = data?.user?.id;

  const res = useUserReviews(userID);
  console.log(res); 

  return (
    <div>
      <br/>
      <h1 className='text-4xl font-extrabold dark:text-white'>Your Reviews:</h1> <br/>
      {res.user ? (
        res.user.map(review => (
          <>
          <div className='card-bordered w-96 bg-base-100 shadow-xl' key={review.id}>
            <UserBadge />
            <div id="reviewRating" className="rating">
              <input type="radio" id="rating-1" className="mask mask-star" checked={review.rating == 1} readOnly />
              <input type="radio" id="rating-2" className="mask mask-star" checked={review.rating == 2} readOnly />
              <input type="radio" id="rating-3" className="mask mask-star" checked={review.rating == 3} readOnly />
              <input type="radio" id="rating-4" className="mask mask-star" checked={review.rating == 4} readOnly />
              <input type="radio" id="rating-5" className="mask mask-star" checked={review.rating == 5} readOnly />
            </div>
            <Link href={{ pathname: '/fruits', query: {data: JSON.stringify(review.tree_id) } }} 
                  className='btn btn-sm btn-outline btn-primary inline-flex items-center'>
                  See Tree</Link>
            <br/>
            <div>
              <p className='card-body'>{review.created}<br/>{review.review_text}</p>
            </div>
          </div>
          <br/>
          </>
        ))
      ) : (
        <>
        <div>Reviews Loading...</div>
        <span className="loading loading-spinner loading-xs"></span>
        </>
      )}
    </div>
  )
}

export default UserReviews
