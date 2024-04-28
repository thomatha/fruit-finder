import UserBadge from "@/components/UserBadge";
import React from "react";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          Fruit Finder
        </a>
      </div>
      <UserBadge />
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Profile</a>
          </li>
          <li>
            <details>
              <summary>Main Menu</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li>
                  <a>Sign In</a>
                </li>
                <li>
                  <a href="/Register">Create New Account</a>
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
