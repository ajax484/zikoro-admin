"use client";
import {
  Help3dotsIcon,
  HelpArticle,
  HelpEyeIcon,
  HelpFilter,
  HelpPencil,
} from "@/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GreaterThan } from "styled-icons/fa-solid";

export default function EventsCategories() {
  const datas = [
    {
      title: "Category",
      date: "1/11/2025",
      articleNo: 120,
      viewNo: 120,
    },
    {
      title: "Category",
      date: "1/11/2025",
      articleNo: 120,
      viewNo: 120,
    },
    {
      title: "Category",
      date: "1/11/2025",
      articleNo: 120,
      viewNo: 120,
    },
    {
      title: "Category",
      date: "1/11/2025",
      articleNo: 120,
      viewNo: 120,
    },
    {
      title: "Category",
      date: "1/11/2025",
      articleNo: 120,
      viewNo: 120,
    },
    {
      title: "Category",
      date: "1/11/2025",
      articleNo: 120,
      viewNo: 120,
    },
  ];

  const router = useRouter();

  return (
    <div className="pt-[40px] px-3 lg:px-[56px]">
      {/* top */}
      <div className="flex flex-col lg:flex-row gap-y-4 justify-between w-full items-center">
        {/* left */}
        <div className=" w-full flex items-center gap-x-1 ">
          <p className="text-[#555555] font-semibold text-opacity-50 text-[14px]">
            Help center <GreaterThan size={14} /> Zikoro Events{" "}
            <GreaterThan size={14} />
          </p>
          <p className="text-[#555555] font-semibold text-[14px] text-opacity-100">
            {" "}
            Categories
          </p>
        </div>
        {/* right */}
        <div className=" w-full h-10 items-center flex justify-end ">
          <button
            className=" text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-4 rounded-[10px] flex gap-x-1 text-base font-semibold items-center h-full"
            onClick={() => router.push("/help/create")}
          >
            {" "}
            Write In This Categories <HelpPencil />
          </button>
        </div>
      </div>

      {/* mid */}
      <div className=" mt-8">
        <div>
          {/* 1st section */}
          <div className="flex justify-center mx-auto">
            <div className="">
              <p className="text-center font-semibold text-[20px]">
                Categories
              </p>

              <p className="text-center font-medium text-[14px]">
                Last updated: 1/11/2025{" "}
              </p>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 text-[12px] font-medium items-center">
                  <HelpArticle />
                  <div className="flex gap-x-1">
                    <p>6</p>
                    <p>Articles</p>
                  </div>
                </div>
                <div className="flex gap-x-1 text-[12px] font-medium items-center">
                  <HelpEyeIcon />

                  <div className="flex gap-x-1">
                    <p>720</p>
                    <p>Total Reads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2nd section */}
          <div className=" flex flex-col justify-center items-center gap-6 mt-5 lg:mt-[52px]">
            {/* left */}
            <p className=" text-[#31353B] text-center text-base font-medium">
              Articles in this category{" "}
            </p>

            {/* right */}
            <div className="flex justify-between items-center gap-x-6 ">
              <div className="w-full lg:w-[536px] ">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-3 py-2 w-full bg-transparent text-[14px] border-b-[1px] outline-none border-[#EAEAEA]"
                />
              </div>
              <HelpFilter />
            </div>
          </div>

          {/* bottom */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {datas.map((data, index) => (
              <div className=" bg-white rounded-[10px] p-3">
                <div className="flex justify-between items-center">
                  <p className="text-base font-semibold"> {data.title} </p>
                  <Help3dotsIcon />
                </div>
                <p className="text-[12px] font-medium mt-1">
                  Last Updated: {data.date}
                </p>
                <div className="flex gap-x-5 mt-[47px]">
                  <div className="flex gap-x-1 items-center text-[12px] font-medium">
                    <HelpArticle />
                    <div className="flex gap-x-1">
                      {data.articleNo}
                      <p>Articles</p>
                    </div>
                  </div>

                  <div className="flex gap-x-1 items-center text-[12px] font-medium">
                    <HelpEyeIcon />
                    <div className="flex gap-x-1">
                      {data.viewNo}
                      <p>Articles</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
