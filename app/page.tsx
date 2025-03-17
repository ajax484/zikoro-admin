"use client";
import { useEffect } from "react";
import useUserStore from "@/store/globalUserStore";
import { useRouter, usePathname } from "next/navigation";
import { Logout } from "styled-icons/material-outlined";
import { useLogOut } from "@/hooks";

export default function Page() {
  const { user } = useUserStore();
  const pathname = usePathname();
  const router = useRouter();
  const { logOut } = useLogOut();

  return (
    <div className="flex items-center justify-center mx-auto h-screen text-center">
      {user && (
        <div className="">
          <h1 className="text-3xl">
            Welcome <span className="font-bold">{user?.firstName}</span>{" "}
          </h1>
          <p className="text-base mt-6 cursor-pointer" onClick={() => logOut()}>
            <Logout size={18} /> Logout
          </p>
        </div>
      )}
    </div>
  );
}
