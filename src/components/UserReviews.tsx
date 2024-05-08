"use client";
import { useSession } from 'next-auth/react';
import React from 'react'
import { sql } from '@vercel/postgres';

const UserReviews = ({reviews}) => {
    const {data} = useSession();
    console.log(data)
    let rev = reviews

  return (
    <div>
      <p></p>
    </div>
  )
}

export default UserReviews


