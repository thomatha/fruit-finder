"use client";

import UserProfile from '@/components/Profile'
import UserBadge from '@/components/UserBadge'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Profile = () => {

  const {data } = useSession();

  return (
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content flex-col lg:flex-row">
    <div className="p-3">
      <img
        src={data?.user?.image || ""}
        alt={data?.user?.name || ""}
        width={150}
        height={150}
        className="rounded-full border-solid border-current border inline-block mr-1"
      />
    </div>
    <div>
      <h1 className="text-5xl font-bold">Hello, {data?.user.name}</h1>
      <p className="py-6">This is where your bio will go!</p>
      <button className="btn btn-primary float-left mr-auto">View My Reviews</button>
    </div>
  </div>
</div>
  )
}

export default Profile