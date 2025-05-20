"use client";
import {
  EngIssues,
  EngLive,
  EngCustomize,
  EngManage,
  HelpNote,
  HelpFolder,
} from "@/constants/icons";
import { GreaterThan } from "styled-icons/fa-solid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFetchHelpArticles } from "@/hooks/services/help";

export default function EngagementHelp() {
  const {
    articles,
    loading: helpLoading,
    fetchHelpArticles,
  } = useFetchHelpArticles();

  const categories = [
    {
      icon: <EngLive />,
      title: "Creating Live Interactions",
      key: "liveEng",
      link: "/help/engagements/live",
    },
    {
      icon: <EngCustomize />,
      title: "Customizing Your Engagement",
      key: "cusomizeEng",
      link: "/help/engagements/customize",
    },
    {
      icon: <EngManage />,
      title: "Managing Live Sessions",
      key: "manageEng",
      link: "/help/engagements/manage",
    },
    {
      icon: <EngIssues />,
      title: "FAQs",
      key: "faqEng",
      link: "/help/engagements/faqs",
    },
  ];

  //Get only Ev-related articles:
  const eventArticles =
    articles?.filter((a) => a.productCategory?.includes("Event")) || [];

  //Attach the article count dynamically
  const eventCategories = categories.map((category) => {
    const articlesNo = eventArticles.filter(
      (a) => a.productCategory === category.key
    ).length;

    return { ...category, articlesNo };
  });
  const router = useRouter();
  return (
    <div className="pt-[40px] px-3 lg:px-[56px]">
      {/* top */}
      <div className=" flex items-center gap-x-1 ">
        <Link href="/help">
          <p className="text-[#555555] font-medium capitalize flex items-center gap-x-1 text-[14px]">
            Help Center <GreaterThan size={14} />
          </p>
        </Link>
      </div>

      {/* mid */}
      <div className=" mt-8">
        <div>
          {/* 1st section */}
          <div className="flex justify-center mx-auto">
            <div className="">
              <p className="text-center font-semibold text-[20px]">
                Zikoro Engagements
              </p>
              <div className="flex gap-x-6 mt-2">
                <div className="flex gap-x-1 text-[14px] font-medium items-center">
                  <HelpFolder />
                  <div className="flex gap-x-1">
                    <p>4</p>
                    <p>Categories</p>
                  </div>
                </div>
                <div className="flex gap-x-1 text-[14px] font-medium items-center">
                  <HelpNote />

                  <div className="flex gap-x-1">
                    <p>{eventArticles.length}</p>
                    <p>Articles</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-[#31353B] font-semibold text-base mt-8">
                Select a Category{" "}
              </p>
            </div>
          </div>

          {/* bottom */}
          <div className="grid grid-cols-1  lg:grid-cols-2 max-w-full lg:max-w-[744px] mx-auto gap-6 mt-6">
            {eventCategories.map((category, index) => (
              <div
                key={index}
                className=" bg-white rounded-[10px] w-full lg:w-[360px] flex justify-center py-[34px] border-[1px] border-[#EAEAEA]"
              >
                <Link href={category.link}>
                  <div className="flex justify-center mx-auto">
                    <>{category.icon}</>
                  </div>
                  <p className="text-center text-[20px] px-[2px] font-semibold mt-4">
                    {category.title}
                  </p>

                  <div className="flex justify-center gap-x-5 mt-[46px]">
                    <div className="flex gap-x-1 items-center text-[12px] font-medium">
                      <HelpNote />
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
