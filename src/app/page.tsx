import Image from "next/image";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200 bg-[url('../../public/img/hero_oranges.jpg')]">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-base-100">Welcome to Fruit Finder</h1>
          <label className="input input-bordered flex items-center gap-2 mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            <input type="text" className="grow" placeholder="Search by city, neighborhood, or fruit type" />
          </label>
          <p className="link py-6 text-base-100">Explore nearby fruit trees</p>
        </div>
      </div>
    </div>
  );
}
