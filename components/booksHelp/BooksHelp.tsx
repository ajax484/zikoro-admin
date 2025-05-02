"use client";
import {
  Help3dotsIcon,
  HelpArticle,
  HelpEyeIcon,
  HelpFilter,
  HelpFolder,
  HelpPencil,
  HelpWhiteFileIcon,
} from "@/constants";
import { GreaterThan } from "styled-icons/fa-solid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";


export default function BooksHelp() {
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
  ];
const router = useRouter()
  return (
    <div className="pt-[40px] px-3 lg:px-[56px]">
      {/* top */}
      <div className=" flex items-center gap-x-1 ">
        <p className="text-[#555555] font-semibold text-opacity-50 text-[14px]">
          Help center <GreaterThan size={14} />
        </p>
        <p className="text-[#555555] font-semibold text-[14px] text-opacity-100">
          {" "}
          Zikoro Bookings
        </p>
      </div>

      {/* mid */}
      <div className=" mt-8">
        <div>
          {/* 1st section */}
          <div className="flex justify-center mx-auto">
            <div className="">
              <p className="text-center font-semibold text-[20px]">
                Zikoro Bookings
              </p>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 text-[12px] font-medium items-center">
                  <HelpFolder />
                  <div className="flex gap-x-1">
                    <p>100</p>
                    <p>Categories</p>
                  </div>
                </div>
                <div className="flex gap-x-1 text-[12px] font-medium items-center">
                  <HelpEyeIcon />

                  <div className="flex gap-x-1">
                    <p>120</p>
                    <p>Articles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2nd section */}
          <div className="h-[33px] flex flex-col lg:flex-row items-center gap-6 mt-4">
            {/* left */}
            <div className="w-full lg:w-[50%] ">
              <input
                type="text"
                placeholder="Search"
                className="pl-3 py-2 w-full bg-transparent text-[14px] border-b-[1px] outline-none border-[#EAEAEA]"
              />
            </div>
            {/* right */}
            <div className="flex justify-between gap-x-1 w-full lg:w-[50%] items-center ">
              <Popover>
                <PopoverTrigger>
                  {" "}
                  <HelpFilter />
                </PopoverTrigger>
                <PopoverContent>
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

              <button className=" text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-4 rounded-[10px] flex gap-x-1 text-base font-semibold items-center" onClick={() => router.push('/help/bookings/categories')}>
                {" "}
                Write An Article <HelpPencil />
              </button>
            </div>
          </div>

          <p className="mt-24 lg:mt-8 text-[#31353B] text-center text-base font-medium">
            Group related articles with category{" "}
          </p>

          {/* bottom */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <Dialog>
              <DialogTrigger>
                {" "}
                <div className="flex flex-col items-center justify-center w-full  gap-2 py-[36px] bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[10px] cursor-pointer ">
                  <HelpWhiteFileIcon />
                  <p className="text-base font-semibold text-white">
                    Create a new category
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Category</DialogTitle>
                  <DialogDescription>
                    <form action="" className="mt-8">
                      {/* 1st form */}
                      <div>
                        <p className="text-[12px] font-semibold">
                          Category Name
                        </p>
                        <div className="w-full mt-3 ">
                          <input
                            type="text"
                            placeholder="Enter Category Name"
                            className="pl-3 py-2 w-full bg-transparent text-[14px] rounded-[10px] border-[1px] outline-none border-[#EAEAEA]"
                          />
                        </div>
                      </div>

                      {/* 2nd form */}
                      <div className="mt-8">
                        <p className="text-[12px] font-semibold">Description</p>
                        <div className="w-full mt-3 ">
                          <input
                            type="text"
                            placeholder="Enter Description"
                            className="pl-3 py-2 w-full bg-transparent text-[14px] rounded-[10px] border-[1px] outline-none border-[#EAEAEA]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-8 ">
                        <button className=" text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-4 rounded-[10px] flex text-base font-semibold ">
                          {" "}
                          Create
                        </button>
                      </div>
                    </form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

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
