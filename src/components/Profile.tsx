"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import UserProfileCard from "./UserProfileCard";


const UserProfile = () => {

  const { data } = useSession();

  return (
    <section className="w-full;">
      <UserProfileCard />
    </section>
  )
}

export default UserProfile
