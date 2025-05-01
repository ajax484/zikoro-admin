"use client";
import { HelpArticle, HelpFolder } from "@/constants";
import { GreaterThan } from "styled-icons/fa-solid";

export default function EventsHelp() {
  return (
    <div className="pt-[40px] pl-3 lg:pl-[56px]">
      {/* top */}
      <div className=" flex items-center gap-x-1 ">
        <p className="text-[#555555] font-semibold text-opacity-50 text-[14px]">
          Help center <GreaterThan size={14} />
        </p>
        <p className="text-[#555555] font-semibold text-[14px] text-opacity-100">
          {" "}
          Zikoro Events
        </p>
      </div>

      {/* mid */}
      <div className="flex justify-center mx-auto mt-8">
        {/* 1st section */}
        <div>
          <p className="text-center font-semibold text-[20px]">Zikoro Events</p>
          <div className="flex gap-x-4">
            <div className="flex gap-x-1 text-[12px] font-medium items-center">
              <HelpFolder />
              <div className="flex gap-x-1">
                <p>100</p>
                <p>Categories</p>
              </div>
            </div>
            <div className="flex gap-x-1 text-[12px] font-medium items-center">
              <HelpArticle />
              <div className="flex gap-x-1">
                <p>120</p>
                <p>Articles</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2nd section */}
        
      </div>


    </div>
  );
}
