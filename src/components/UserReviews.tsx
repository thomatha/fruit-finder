"useClient"
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import React from 'react'
import {useUserReviews} from '@/hooks/useUserReviews';

function UserReviews() {

  const {data} = useSession();
  const id = data?.user?.id;

  const {user, isLoading, isError} = useUserReviews(id);

  if(isError) console.log(isError);

  return (
    <div>
      <ul>
        <p></p>
      </ul>
    </div>
  )
}

export default UserReviews
