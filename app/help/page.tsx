"use client";

import {
  HelpBookings,
  HelpEng,
  HelpEvent,
  HelpFolder,
  HelpArticle,
  HelpCredential,
  HelpBilings,
  HelpSettings,
} from "@/constants";
import Link from "next/link";
// Create a utility function for fetching articles
import { useFetchHelpArticles } from "@/hooks/services/help";

export default function Help() {
  const {
    articles,
    loading: helpLoading,
    fetchHelpArticles,
  } = useFetchHelpArticles();

  //get Product Category stat
  const getProductCategoryStats = () => {
    let stats = {
      event: { articles: 0, categories: new Set<string>() },
      engagement: { articles: 0, categories: new Set<string>() },
      credential: { articles: 0, categories: new Set<string>() },
      bookings: { articles: 0, categories: new Set<string>() },
    };

    articles.forEach((article) => {
      const category = article.productCategory;

      if (category.includes("Event")) {
        stats.event.articles += 1;
        stats.event.categories.add(category);
      }

      if (category.includes("Credential")) {
        stats.credential.articles += 1;
        stats.credential.categories.add(category);
      }

      if (category.includes("Bookings")) {
        stats.bookings.articles += 1;
        stats.bookings.categories.add(category);
      }

      if (category.includes("Eng")) {
        stats.engagement.articles += 1;
        stats.engagement.categories.add(category);
      }
    });

    return {
      event: {
        articlesNo: stats.event.articles,
        categoriesNo: stats.event.categories.size,
      },
      engagement: {
        articlesNo: stats.engagement.articles,
        categoriesNo: stats.engagement.categories.size,
      },
       credentials: {
        articlesNo: stats.credential.articles,
        categoriesNo: stats.credential.categories.size,
      },
       bookings: {
        articlesNo: stats.bookings.articles,
        categoriesNo: stats.bookings.categories.size,
      },
    };
  };

  const { event, engagement, credentials, bookings } =
    getProductCategoryStats();

    console.log(articles);

  //categories list
  const categories = [
    {
      icon: <HelpEvent />,
      title: "Zikoro Events",
      desc: "Hosting and managing your events",
      categoriesNo: event.categoriesNo,
      articlesNo: event.articlesNo,
      link: "/help/events",
    },
    {
      icon: <HelpEng />,
      title: "Zikoro Engagements",
      desc: "Issuing certificates and badges",
      categoriesNo: engagement.categoriesNo,
      articlesNo: engagement.articlesNo,
      link: "/help/engagements",
    },
    {
      icon: <HelpCredential />,
      title: "Zikoro Credentials",
      desc: "Polls, quizzes & audience interaction",
      categoriesNo: credentials.categoriesNo,
      articlesNo: credentials.articlesNo,
      link: "/help/credentials",
    },
    {
      icon: <HelpBookings />,
      title: "Zikoro Bookings",
      desc: "Scheduling and managing appointments",
      categoriesNo: bookings.categoriesNo,
      articlesNo: bookings.articlesNo,
      link: "/help/bookings",
    },
    {
      icon: <HelpBilings />,
      title: "Billing & Subscription",
      categoriesNo: 0,
      articlesNo: 0,
      link: "/help/bookings",
    },

    {
      icon: <HelpSettings />,
      title: "Account & Settings",
      categoriesNo: 0,
      articlesNo: 0,
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
