"use client";

import Biography from '@/components/Biography';
import UserReviews from '@/components/UserReviews';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Profile = () => {

  
  const [bio, setBio] = useState("This is your bio! Make it yours...");
  const handleSaveBio = (newBio) => {
    setBio(newBio);

    // need to add code to save in the DB here

  };

  const { data } = useSession();
  let id = data?.user?.id;

  return (
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content flex-col lg:flex-row">
    <div className="p-3">
    </div>
    <div>
      <h1 className="text-5xl font-bold">Hello, {data?.user.name}</h1>
      <Biography bio={bio} onSaveBio={handleSaveBio} /> <br /> <br/>
      <UserReviews />
    </div>
  </div>
</div>
  );
};

export default Profile