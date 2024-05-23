"use client";

import Biography from '@/components/Biography';
import UserReviews from '@/components/UserReviews';
import UserTrees from '@/components/UserTrees';
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Profile = () => {
  const activeTabClass = 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500';
  const inactiveTabClass = 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';
  const [bio, setBio] = useState("This is your bio! Make it yours...");
  /* Tab values:
    0: Fruit Trees
    1: Reviews
  */
  const [tab, setTab] = useState(0);
  const handleSaveBio = (newBio) => {
    setBio(newBio);

    // need to add code to save in the DB here
    // Bio would make sense as the new tab 0
  };

  const { data } = useSession();
  let id = data?.user?.id;

  return (
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content flex-col lg:flex-row">
    <div className="p-3">
    </div>
    <div>
      <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Hello, {data?.user.name}</h1>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a href="#" className={tab === 0 ? activeTabClass : inactiveTabClass} onClick={() => setTab(0)}>Fruit Trees</a>
          </li>
          <li className="me-2">
            <a href="#" className={tab === 1 ? activeTabClass : inactiveTabClass} onClick={() => setTab(1)}>Reviews</a>
          </li>
        </ul>
      </div>
      {/*<Biography bio={bio} onSaveBio={handleSaveBio} /> <br /> <br/>*/}
      {
        tab === 0 ?
          <UserTrees />
        :
          <UserReviews />
      }
      <button className='btn btn-sm' onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Back to top</button>
    </div>
    </div>
  </div>
  );
};

export default Profile