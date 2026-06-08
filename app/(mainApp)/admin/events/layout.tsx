import React from "react";
import { EventsSideBar } from "@/components/admin/EventsSideBar/EventsSideBar";

export default function EventsModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative w-full h-full bg-[#F7F8FF]">
      <EventsSideBar />
      <div className="lg:w-[calc(100%-250px)] min-[1024px]:float-right bg-[#F7F8FF] pb-12">
        {children}
      </div>
    </main>
  );
}
