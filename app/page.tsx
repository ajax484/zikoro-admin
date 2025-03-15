"use client"
import { useEffect } from "react";
import useUserStore from "@/store/globalUserStore";
import { useRouter, usePathname } from "next/navigation";

export default function Page() {
    const { user } = useUserStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
          router.push(`/login?redirectedFrom=blog/dashboard`);
        }},[])

  return (
    <div className="flex items-center justify-center mx-auto h-screen">
      <h1>Admin Page</h1>
    </div>
  );
}
