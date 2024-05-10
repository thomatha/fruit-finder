"use client";

import UserBadge from "@/components/UserBadge";
import React from "react";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

const NavBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setUser(session.user);
      } else {
        // need to add error handling here for if user isn't signed in
      }
    };

    fetchSession();
  }, []);

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          Fruit Finder
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <details>
              <summary className="py-1">
                <UserBadge />
              </summary>
              <ul className="p-2 bg-base-100 rounded-t-none min-w-40 end-0">
                <li>
                  {user ? (
                    // UPDATE THESE WHEN YOU HAVE SIGN IN/OUT FUNCTIONALITY
                    <Link href="/">Sign Out</Link>
                  ) : (
                    <Link href="/">Sign In</Link>
                  )}
                </li>
                <li>
                  {user ? (
                    <Link href="/UserProfile">Profile Page</Link>
                  ) : (
                    <Link href="/Register">Register</Link>
                  )}
                </li>
                <li>
                  <a href="/fruits">View Fruit Map</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
