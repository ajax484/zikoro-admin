import { RouteHeader } from "@/components/admin/_components";
import { EventTopNav } from "..";
import React from "react";

export function EventLayout({
  query,
  children,
  startDate,
  endDate,
  setEndDate,
  setStartDate,
  endEndDate,
  endStartDate,
  setEndStartDate,
  setEndEndDate
}: {
  query: any;
  children: React.ReactNode;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  startDate: Date | null;
  endDate: Date | null;
  setEndStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endStartDate: Date | null;
  endEndDate: Date | null;
}) {
  return (
    <div className="w-full pt-12 sm:pt-16">
      <div className="w-full flex items-center gap-x-4">
        <RouteHeader
          header="Events"
          description="See all events, review, new and publish"
        />
      </div>
      <EventTopNav
        query={query}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        endEndDate={endEndDate}
        endstartDate={endStartDate}
        setEndStartDate={setEndStartDate}
        setEndEndDate={setEndEndDate}        
      />
      {children}
    </div>
  );
}
