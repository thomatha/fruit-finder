/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession } from "next-auth/react";

export default function UserBadge() {
  const { data, status } = useSession();

  if (status !== "authenticated") {
    return <></>;
  }

  return (
    <div className="p-3">
      <img
        src={data?.user?.image || ""}
        alt={data?.user?.name || ""}
        width={32}
        height={32}
        className="rounded-full border-solid border-current border inline-block mr-1"
      />
      {data?.user?.name}
    </div>
  );
}
