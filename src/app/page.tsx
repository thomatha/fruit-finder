'use client';
import Image from "next/image";
import locationImg from '../../public/img/location_icon.png';
import searchImg from '../../public/img/search_icon.png';
import treeImg from '../../public/img/tree_icon.png';
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200 bg-[url('../../public/img/hero_oranges.jpg')]">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold text-base-100 dark:text-white mix-blend-difference">Welcome to Fruit Finder</h1>
            <label className="input input-bordered flex items-center gap-2 mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
              <input type="text" className="grow" placeholder="Search by city, neighborhood, or fruit type" />
            </label>
            <Link href="/fruits" className="flex-center text-base-100 dark:text-white mix-blend-difference hover:underline">Explore nearby fruit trees</Link>
          </div>
        </div>
      </div>


      <div className="bg-[#efb61c] p-4">
        <h2 className="text-center text-2xl font-semibold pt-10 mb-8">How to get started</h2>
        <div className="flex justify-center pb-10">
          {/*Card 1*/}
          <div className="card w-96 bg-base-100 shadow-xl mr-5">
            <figure className="px-10 pt-10">
              <Image src={searchImg} alt="Search Icon" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Step 1</h2>
              <p>Search for a fruit. Try searching for an apple tree!</p>
            </div>
          </div>

          {/*Card 2*/}
          <div className="card w-96 bg-base-100 shadow-xl mr-5">
            <figure className="px-10 pt-10">
              <Image src={locationImg} alt="Map Icon" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Step 2</h2>
              <p>Allow us to use your location to find nearby fruit trees</p>
            </div>
          </div>

          {/*Card 3*/}
          <div className="card w-96 bg-base-100 shadow-xl">
            <figure className="px-10 pt-10">
              <Image src={treeImg} alt="Apple Tree Icon" className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Step 3</h2>
              <p>Pick out a tree to visit!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
