import React from "react";
import { InventorySideBar } from "@/components/admin/InventorySideBar/InventorySideBar";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative w-full h-full bg-[#F7F8FF]">
      <InventorySideBar />
      <div className="lg:w-[calc(100%-250px)] min-[1024px]:float-right bg-[#F7F8FF] pb-12">
        {children}
      </div>
    </main>
  );
}
