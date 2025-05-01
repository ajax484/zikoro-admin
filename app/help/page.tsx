"use client";

import {
  HelpBookings,
  HelpEng,
  HelpEvent,
  HelpFolder,
  HelpArticle,
  HelpCredential,
} from "@/constants";
import Link from "next/link";

export default function Help() {
  const categories = [
    {
      icon: <HelpEvent />,
      title: "Zikoro Events",
      categoriesNo: 6,
      articlesNo: 120,
      link: "/help/events",
    },
    {
      icon: <HelpEng />,
      title: "Zikoro Engagements",
      categoriesNo: 6,
      articlesNo: 120,
      link: "/help/engagements",
    },
    {
      icon: <HelpCredential />,
      title: "Zikoro Credentials",
      categoriesNo: 6,
      articlesNo: 120,
      link: "/help/credentials",
    },
    {
      icon: <HelpBookings />,
      title: "Zikoro Bookings",
      categoriesNo: 6,
      articlesNo: 120,
      link: "/help/bookings",
    },
  ];
  return (
    <div className="bg-[#F7F8FF] min-h-screen">
      <div className="flex justify-center mx-auto text-center pt-10 text-[#31353B]">
        <div>
          {/* top */}
          <div>
            <p className="text-xl font-semibold">
              Zikoro Help Center Dashboard
            </p>
            <p className="mt-[80px] text-base font-medium text-[#31353B]">
              Select A Product to proceed
            </p>
          </div>

          <div className="grid grid-cols-1  lg:grid-cols-2 gap-6 mt-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-[10px] w-full px-[30px] py-[31px]"
              >
                <Link href={category.link}>
                  <div className="flex justify-center mx-auto">
                    <>{category.icon}</>
                  </div>
                  <p className="text-center text-[20px] font-semibold mt-2">
                    {category.title}
                  </p>
                  <div className="flex gap-x-5 mt-1">
                    <div className="flex gap-x-1 items-center text-[12px] font-medium">
                      <HelpFolder />
                      <div className="flex gap-x-1">
                        {category.categoriesNo}
                        <p>Categories</p>
                      </div>
                    </div>
                    |{" "}
                    <div className="flex gap-x-1 items-center text-[12px] font-medium">
                      <HelpArticle />
                      <div className="flex gap-x-1">
                        {category.articlesNo}
                        <p>Articles</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
