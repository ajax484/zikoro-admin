"use client";
import { useEffect } from "react";
import useUserStore from "@/store/globalUserStore";
import { useRouter, usePathname } from "next/navigation";
import { Logout } from "styled-icons/material-outlined";
import { useLogOut } from "@/hooks";

export default function Page() {
  // redirect to login page if user is not logged in
  const { user } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center mx-auto h-screen text-center"></div>
  );
}
