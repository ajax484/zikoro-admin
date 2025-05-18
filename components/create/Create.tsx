"use client";
import { HelpEyeColorIcon, HelpUploadIcon } from "@/constants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GreaterThan } from "styled-icons/fa-solid";
import { TextEditor } from "../TextEditor";

export default function Create() {
  const router = useRouter();

  const setMessage = (content: string) => {
    setValue("content", content);
  };
  const form = useForm({
    criteriaMode: "all",
    defaultValues: { content: "" },
    mode: "onSubmit", // Change this from "onChange"
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const content = watch("content");

  const categories = [
    { name: "Select A Category", value: "" },
    // { name: "Event tips", value: "Event" },
    // { name: "Product Updates", value: "Product" },
    // { name: "Guides and Tutorial", value: "Guide" },
    // { name: "Case Study", value: "Case" },
  ];

  return (
    <div className="pt-[40px] px-3 lg:px-[56px]">
      {/* top */}
      <div className="flex flex-col lg:flex-row gap-y-4 justify-between w-full items-center">
        {/* left */}
        <div className=" w-full flex items-center gap-x-1 ">
          <Link href="/help">
            <p className="text-[#555555] flex items-center gap-x-1 font-medium text-[14px]">
              Help Center <GreaterThan size={14} />
            </p>
          </Link>

          <p className="text-[#555555] font-medium text-[14px]"> Create </p>
        </div>
        {/* right */}
        <div className=" w-full h-10 gap-x-3 items-center flex justify-end ">
          <button
            className=" text-indigo-600 bg-transparent  py-[10px] px-4 rounded-[10px] flex gap-x-1 text-base font-semibold items-center h-full border-[1px] border-indigo-500"
            onClick={() => router.push("/help/create")}
          >
            {" "}
            Preview
            <HelpEyeColorIcon />
          </button>

          <Dialog>
            <DialogTrigger>
              <div
                className=" text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-4 rounded-[10px] flex gap-x-1 text-base font-semibold items-center h-full "
                onClick={() => router.push("/help/create")}
              >
                {" "}
                Publish
                <HelpUploadIcon />
              </div>
            </DialogTrigger>
            <DialogContent className="py-8 px-3">
              <p className="text-indigo-600 text-2xl font-bold text-center">
                Publish article
              </p>
              <p className="mt-6 text-center text-base text-[#555555]">
                Publish <span className="font-semibold"> Article name </span> to{" "}
                <span className="font-semibold">Category Name</span> .
              </p>
              <button className="text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-4 rounded-[10px] mt-4 text-base font-semibold items-center border-[1px] border-indigo-500 mx-auto">
                {" "}
                Publish
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* mid */}

      <section className="mt-4 lg:mt-6 ">
        <form>
          <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-4">
            <div className="w-full flex items-center justify-between">
              <div className="px-3 bg-transparent flex items-center ">
                <input
                  type="text"
                  value=""
                  name="title"
                  placeholder="Title"
                  className="outline-none text-2xl text-[#31353B] font-semibold  bg-transparent h-[44px] w-full placeholder-black"
                  required
                />
              </div>
              <select
                name="category"
                value=""
                required
                className="w-full lg:w-2/12 h-[40px] bg-transparent rounded-lg border-[1px] text-[14px] border-indigo-600 px-4 outline-none  hover:text-gray-50 hover:bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end cursor-pointer text-indigo-600 font-medium"
              >
                {categories.map((category, index) => (
                  <option
                    key={index}
                    value={category.value}
                    className="bg-transparent text-black text-[15px]"
                  >
                    {" "}
                    {category.name}{" "}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 lg:mt-[50px] bg-transparent flex-1 resize-none h-fit mb-10 ">
            <TextEditor
              defaultValue={content}
              placeholder="Type your blog content..."
              onChange={setMessage}
              isBlog
            />
          </div>
        </form>
      </section>
    </div>
  );
}
