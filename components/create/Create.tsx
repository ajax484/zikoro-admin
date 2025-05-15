"use client";
import {
  Help3dotsIcon,
  HelpArticle,
  HelpEyeColorIcon,
  HelpEyeIcon,
  HelpFilter,
  HelpPencil,
  HelpUploadIcon,
} from "@/constants";
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

  return (
    <div className="pt-[40px] px-3 lg:px-[56px]">
      {/* top */}
      <div className="flex flex-col lg:flex-row gap-y-4 justify-between w-full items-center">
        {/* left */}
        <div className=" w-full flex items-center gap-x-1 ">
          <p className="text-[#555555] font-semibold text-opacity-50 text-[14px]">
            Help center <GreaterThan size={14} />
          </p>
          <p className="text-[#555555] font-semibold text-[14px] text-opacity-100">
            {" "}
            Create{" "}
          </p>
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
          <button
            className=" text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-4 rounded-[10px] flex gap-x-1 text-base font-semibold items-center h-full "
            onClick={() => router.push("/help/create")}
          >
            {" "}
            Publish
            <HelpUploadIcon />
          </button>
        </div>
      </div>

      {/* mid */}

      <section className="mt-4 lg:mt-6 ">
        <form>
          <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-4">
            <div className=" rounded-xl w-full   ">
              <div className="px-3 bg-transparent rounded-xl flex items-center ">
                <input
                  type="text"
                  value=""
                  name="title"
                  placeholder="Title"
                  className="outline-none text-2xl text-[#31353B] font-semibold  bg-transparent h-[44px] w-full placeholder-black"
                  required
                />
              </div>
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
