'useClient';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useUserTrees } from '@/hooks/useUserTrees';
import Link from 'next/link';
import Image from 'next/image';
import defaultFruitImg from '../../public/img/default_fruit.png';

function UserTrees() {
  const { data } = useSession();
  const userID = data?.user?.id;

  const res = useUserTrees(userID);

  return (
    <div>
      <br />
      <h1 className="text-4xl font-extrabold dark:text-white">
        Your Fruit Trees:
      </h1>
      <br />
      {res.user ? (
        res.user.map((tree) => (
          <>
            <div
              className="card-bordered w-96 bg-base-100 shadow-xl"
              key={tree.id}
            >
              <div className="tree-img">
                {tree.s3_img_link ? (
                  <Image
                    src={tree.s3_img_link}
                    alt="fruit_tree_image"
                    height={250}
                    width={450}
                  ></Image>
                ) : (
                  <Image
                    src={defaultFruitImg}
                    alt="default_fruit_tree_image"
                    height={250}
                    width={450}
                  ></Image>
                )}
              </div>
              <br />
              <div>
                <p className="card-body">
                  <span className="font-semibold text-lg">{tree.name}</span>
                  <br />
                  {tree.description}
                  {tree.description ? <br /> : null}
                  Added {tree.created}
                </p>
              </div>
              <Link
                href={{
                  pathname: '/fruits',
                  query: {
                    data: JSON.stringify(tree.id),
                    lat: JSON.stringify(tree.latitude),
                    lng: JSON.stringify(tree.longitude),
                  },
                }}
                className="btn btn-sm btn-outline btn-primary inline-flex items-center mb-8 ml-8"
              >
                See Tree
              </Link>
            </div>
            <br />
          </>
        ))
      ) : (
        <>
          <div>Trees Loading...</div>
          <span className="loading loading-spinner loading-xs"></span>
        </>
      )}
    </div>
  );
}

export default UserTrees;
