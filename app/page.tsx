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
        
    </div>
  );
}
