"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFetchArticle } from "@/hooks/services/help";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import { useUpdatePostView, useUpdatePostshare } from "@/hooks/services/post";
import toast from "react-hot-toast";

type DBBlogPost = {
  id: number;
  title: string;
  created_at: string;
  productCategory: string;
  section: string;
  Details: JSON;
  createdBy: string;
  lastEditedBy: string;
};

export default function FullPost({ articleId }: { articleId: number }) {
  const {
    data,
    refetch,
  }: {
    data: DBBlogPost | null;
    loading: boolean;
    refetch: () => Promise<null | undefined>;
  } = useFetchArticle(articleId);

  //for side bar links
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  // Extracting the date only
  function extractAndFormatDate(dateTimeString: any): any {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        // throw new Error("Invalid date");
      }
      const formattedDate: string = formatDate(date);
      return formattedDate;
    } catch (error) {
      console.error("Error extracting date:", error);
      return "Invalid Date";
    }
  }

  //formatDate
  function formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Month is zero-based, so add 1
    const day: number = date.getDate();

    const monthNames: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedDate: string = `${day} ${monthNames[month - 1]} ${year}`;
    return formattedDate;
  }

  //useEffect for side bar links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === "A") {
        e.preventDefault();
        const targetId = target.getAttribute("href");
        if (targetId) {
          const targetElement = document.getElementById(targetId.slice(1));
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
            router.push(`#${targetId.slice(1)}`);
          }
        }
      }
    };

    const contentDiv = contentRef.current;
    if (contentDiv) {
      contentDiv.addEventListener("click", handleAnchorClick);
      return () => {
        contentDiv.removeEventListener("click", handleAnchorClick);
      };
    }
  }, [router]);

  const headings = data?.section?.match(/<h[1](.*?)>(.*?)<\/h[1]>/g) || [];

  //update post view
  // useEffect(() => {
  //   if (data) {
  //     updatePostView(data.views, data.id);
  //   }
  // });

  return (
    <>
      {data && (
        <div>
          <div className="mt-[50px] lg:mt-[64px] px-3 lg:px-0 ">
            {/* header section */}

            <div className="max-w-full lg:max-w-[982px] mx-auto flex flex-col gap-y-6 lg:gap-y-10 ">
              <div className="max-w-full lg:max-w-2xl lg:mx-auto flex flex-col gap-y-2 text-center ">
                <p className="text-[#31353B] text-[18px] font-semibold">
                  {data?.title}
                </p>
                <p className="capitalize text-[12px] font-medium text-[#555555] ">
                  Added 2 days ago
                </p>
              </div>
            </div>

            {/* body section */}
            <div
              // ref={existingElement}
              className="w-full h-fit"
            >
              <div className="max-w-full lg:max-w-6xl lg:mx-auto flex gap-x-0 lg:gap-x-28 mt-5 mb-10 lg:mt-[22px] lg:mb-24  ">
                {/* Left */}
                <div
                  className={`hidden lg:inline sticky top-[120px] transform transition-all duration-200 pb-12 w-full flex-col lg:w-3/12 h-fit`}
                  id="left"
                >
                  {/* section links */}
                  <div className="flex-col border-[1px] border-gray-100 rounded-lg px-3 pt-3">
                    {/* Top */}
                    <p className="text-[12px] text-[#555555] font-semibold">
                      In this article
                    </p>
                    {/* Links */}

                    {headings.map((heading, index) => {
                      const id = `section-${index}`;
                      return (
                        <div key={id} id={id}>
                          <Link href={`#${id}`}>
                            <div className="text-[12px] font-medium  mt-8">
                              <div
                                className="blackLink"
                                dangerouslySetInnerHTML={{
                                  __html: heading ?? "",
                                }}
                              />
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  ref={contentRef}
                  className={` w-full min-h-[50%]  flex-col pb-0 lg:pb-[50px] blogPost ${"lg:w-9/12"}`}
                  id="right"
                >
                  <div
                    className="blog no-scrollbar text-[14px]"
                    dangerouslySetInnerHTML={{ __html: data?.Details ?? "" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
