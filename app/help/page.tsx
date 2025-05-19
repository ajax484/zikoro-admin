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
      desc: "Hosting and managing your events",
      categoriesNo: 6,
      articlesNo: 6,
      link: "/help/events",
    },
    {
      icon: <HelpEng />,
      title: "Zikoro Engagements",
      desc: "Issuing certificates and badges",
      categoriesNo: 6,
      articlesNo: 6,
      link: "/help/engagements",
    },
    {
      icon: <HelpCredential />,
      title: "Zikoro Credentials",
      desc: "Polls, quizzes & audience interaction",
      categoriesNo: 6,
      articlesNo: 6,
      link: "/help/credentials",
    },
    {
      icon: <HelpBookings />,
      title: "Zikoro Bookings",
      desc: "Scheduling and managing appointments",
      categoriesNo: 6,
      articlesNo: 6,
      link: "/help/bookings",
    },
    {
      icon: <HelpBookings />,
      title: "Billing & Subscription",
      categoriesNo: 6,
      articlesNo: 6,
      link: "/help/bookings",
    },

    {
      icon: <HelpBookings />,
      title: "Account & Settings",
      categoriesNo: 6,
      articlesNo: 6,
      link: "/help/bookings",
    },
  ];
  return (
    <div className="bg-[#F7F8FF] min-h-screen">
      <div className="flex justify-center mx-auto text-center pt-10 text-[#31353B]">
        <div>
          {/* top */}
          <div>
            <p className="text-xl lg:text-[32px] font-semibold">
              Zikoro Help Center Dashboard
            </p>
            <p className="mt-[65px] text-base font-semibold text-[#31353B]">
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
                  <p className="text-center text-[20px] font-semibold mt-4">
                    {category.title}
                  </p>
                  <p className="text-center text-[16px] text-[#555555] font-medium mt-2">
                    {category.desc}
                  </p>
                  <div className="flex gap-x-5 justify-center mt-[18px]">
                    <div className="flex gap-x-1 items-center text-[12px] font-medium">
                      <HelpFolder />
                      <div className="flex gap-x-1">
                        {category.categoriesNo}
                        <p>Categories</p>
                      </div>
                    </div>
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
