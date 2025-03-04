"use client";

import Link from "next/link";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { cn } from "@/lib";
import { usePathname } from "next/navigation";
import { DateRange } from "@styled-icons/material/DateRange";

export function EventTopNav({
  query,
  setStartDate,
  startDate,
  endDate,
  setEndDate,
  setEndStartDate,
  endstartDate,
  endEndDate,
  setEndEndDate,
}: {
  query: any;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  startDate: Date | null;
  endDate: Date | null;
  setEndStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endstartDate: Date | null;
  endEndDate: Date | null;
}) {
  const pathname = usePathname();
  const [isDatePanel, setDatePanel] = useState(false);
  const [isEndDatePanel, setEndDatePanel] = useState(false)
  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setEndStartDate(null);
    setEndEndDate(null);
  };
  //onendDateChange
  const onendDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setEndStartDate(start);
    setEndEndDate(end);
    setStartDate(null);
    setEndDate(null);
  };
  // const search = useSearchParams();
  // const queryParam = search.get("e");

  const links = [
    {
      name: "Review",
      q: `review`,
    },
    {
      name: "New",
      q: `new`,
    },
    {
      name: "Published",
      q: `published`,
    },
  ];
  return (
    <nav className="w-full bg-white px-4 pt-4  border-b-2 ">
      <ul className="px-4 flex items-center gap-x-8 text-gray-700">
        {links.map(({ name, q }) => {
          return (
            <li
              className={cn(
                `pb-1 text-sm`,
                query === q &&
                  "text-basePrimary pb-2 border-b-2 border-basePrimary font-medium",
                !query &&
                  name === "Review" &&
                  "text-basePrimary pb-2 border-b-2 border-basePrimary font-medium"
              )}
            >
              <Link href={`/admin/events?e=${q}`}>{name}</Link>
            </li>
          );
        })}

        <li>
          <button
            onClick={() => setDatePanel((prev) => !prev)}
            className="flex py-2 relative hover:text-basePrimary items-center w-full justify-center text-gray-400  gap-x-2"
          >
            <DateRange size={22} />
            <p className="text-sm"> start Date </p>
            {isDatePanel && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="absolute top-8 right-[-95px] md:right-0"
              >
                <button
                  onClick={() => setDatePanel((prev) => !prev)}
                  className="w-full h-full fixed inset-0 z-[100] "
                ></button>
                <div
                  role="button"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-[120]"
                >
                  <DatePicker
                    selected={startDate}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={onChange}
                    selectsRange
                    inline
                  />
                </div>
              </div>
            )}
          </button>
        </li>

        <li>
          <button
            onClick={() => setEndDatePanel((prev) => !prev)}
            className="flex py-2 relative hover:text-basePrimary items-center w-full justify-center text-gray-400  gap-x-2"
          >
            <DateRange size={22} />
            <p className="text-sm"> End Date </p>
            {isEndDatePanel && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="absolute top-8 right-[-95px] md:right-0"
              >
                <button
                  onClick={() => setEndDatePanel((prev) => !prev)}
                  className="w-full h-full fixed inset-0 z-[100] "
                ></button>
                <div
                  role="button"
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-[120]"
                >
                  <DatePicker
                    selected={endstartDate}
                    startDate={endstartDate}
                    endDate={endEndDate}
                    onChange={onendDateChange}
                    selectsRange
                    inline
                  />
                </div>
              </div>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
}
