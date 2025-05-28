"use client";
import {
  Help3dotsIcon,
  HelpArticle,
  HelpEyeIcon,
  HelpFilter,
  HelpPencil,
} from "@/constants";
import { useRouter } from "next/navigation";
import { GreaterThan } from "styled-icons/fa-solid";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFetchHelpArticles } from "@/hooks/services/help";
import Article from "../article/Article";

export default function BooksSetting() {
  const {
    articles,
    loading: helpLoading,
    fetchHelpArticles,
  } = useFetchHelpArticles();

  const filteredData = articles.filter(
    (article) => article.productCategory.trim() === "setBookings"
  );

  const router = useRouter();

  return (
    <div className="pt-[40px] px-3 lg:px-[56px]">
      {/* top */}
      <div className="flex flex-col lg:flex-row gap-y-4 justify-between w-full items-center">
        {/* left */}
        <div className=" w-full flex items-center gap-x-1 ">
          <p className="text-[#555555] font-medium flex gap-x-1  text-[14px]">
            <span
              className="cursor-pointer flex gap-x-1 items-center"
              onClick={() => router.push("/help")}
            >
              Help Center <GreaterThan size={14} />{" "}
            </span>{" "}
            <span
              className="cursor-pointer flex gap-x-1 items-center"
              onClick={() => router.push("/help/bookings")}
            >
              {" "}
              Zikoro Bookings <GreaterThan size={14} />
            </span>
          </p>
        </div>
      </div>

      {/* mid */}
      <div className=" mt-8">
        <div>
          {/* 1st section */}
          <div className="flex justify-center mx-auto">
            <div className="">
              <p className="text-center font-semibold text-[18px]">
                Setting Up Booking Pages{" "}
              </p>

              <div className="flex gap-x-4 justify-center mt-2">
                <div className="flex gap-x-1 text-[12px] font-medium items-center">
                  <HelpArticle />
                  <div className="flex gap-x-1">
                    <p>{filteredData.length}</p>
                    <p>Articles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2nd section */}
          <div className=" flex flex-col justify-center items-center gap-6 mt-5 lg:mt-[24px]">
            <div className="flex justify-between items-center gap-x-6 ">
              <div className="w-full lg:w-[536px] ">
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-3 py-2 w-full bg-transparent text-[14px] border-b-[1px] outline-none border-[#EAEAEA]"
                />
              </div>
              <Popover>
                <PopoverTrigger>
                  {" "}
                  <HelpFilter />
                </PopoverTrigger>
                <PopoverContent className="w-[241px]">
                  <p className="text-[14px] font-semibold">Sort by</p>
                  <RadioGroup defaultValue="option-one" className="mt-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Recently Updated</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Highest Reads</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">Lowest Reads</Label>
                    </div>
                  </RadioGroup>
                </PopoverContent>
              </Popover>
            </div>

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

          {/* bottom */}
          <div className="mt-6 grid grid-cols-1 gap-4 w-full">
            {filteredData.map((data, index) => (
              <Article
                id={data.id}
                title={data.title}
                desc={data.desc}
                views={data.views}
                createdAt={data.created_at}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
