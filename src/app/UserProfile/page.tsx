"use client";

import UserReviews from "@/components/UserReviews";
import { fetchReviews } from "../lib/data";
import { getSession, useSession } from "next-auth/react";

export default function Page() {
  const { data } = useSession();
  console.log(data);
  // const rev = await fetchReviews();
  
  
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Reviews</h1>
      <div className="grid gap-6">    
       
      </div>
    </main>
    
  );
};