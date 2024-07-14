'use client';

import UserTrees from '@/components/UserTrees';
import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data } = useSession();
  let id = data?.user?.id;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="p-3"></div>
        <div>
          <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Hello, {data?.user.name}
          </h1>

          {/*<Biography bio={bio} onSaveBio={handleSaveBio} /> <br /> <br/>*/}
          <UserTrees />
          <button
            className="btn btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
