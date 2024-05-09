"useClient"
import { useSession } from 'next-auth/react'
import React from 'react'
import { useUserReviews } from '@/hooks/useUserReviews';

function UserReviews() {

  const {data} = useSession();
  const userID = data?.user?.id;

  const res = useUserReviews(userID);
  console.log(res.user);

  return (
    <div>
      <br/>
      <h2>Your Reviews: </h2> <br/>
      {res.user ? (
        res.user.map(review => (
          <div key={review.id}>
            <h3>{review.review_text}</h3>
            <p>Rating: {review.rating} / 5</p>
          </div>
        ))
      ) : (
        <div>Reviews Loading...</div>
      )}
    </div>
  )
}

export default UserReviews
