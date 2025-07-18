"use client";
import { HelpEyeColorIcon, HelpUploadIcon } from "@/constants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { GreaterThan } from "styled-icons/fa-solid";
import { useState } from "react";
import toast from "react-hot-toast";
import Editor2 from "../editor/CustomTextEditor/Editor";
import { CustomTextEditor } from "../editor/CustomTextEditor";

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

  //categories list
  const categories = [
    { name: "Select a category", value: "" },
    { name: "Creating an event", value: "createEvent" },
    { name: "Event promotion and registration", value: "promoteEvent" },
    { name: "Live event tools", value: "liveEvent" },
    { name: "Engage your audience", value: "engageEvent" },
    { name: "Post event analytics", value: "analyseEvent" },
    { name: "Events tickets and payments", value: "payEvent" },
    { name: "FAQs - Events", value: "faqEvent" },
    { name: "Getting started with credentials", value: "startCredential" },
    { name: "Designing certificates & badges", value: "designCredential" },
    { name: "Issuing and sharing credentials", value: "issueCredential" },
    { name: "Credential settings", value: "setCredential" },
    { name: "Team and role management", value: "teamCredential" },
    { name: "Verify credential", value: "verifyCredential" },
    { name: "FAQs - Credential", value: "faqCredential" },
    { name: "Creating live", value: "liveEng" },
    { name: "Managing live sessions", value: "manageEng" },
    { name: "Customizing your engagement", value: "customizeEng" },
    { name: "FAQs - Engagements", value: "faqEng" },
    { name: "Setting up booking pages", value: "setBookings" },
    { name: "Managing appointments", value: "manageBookings" },
    { name: "Customizing availability", value: "customizeBookings" },
    { name: "Notifications and reminders", value: "notifyBookings" },
    { name: "FAQs - Bookings", value: "faqBookings" },
  ];

  //form data
  const [formData, setFormData] = useState<any>({
    title: "",
    category: "",
    content: [],
  });

  const handleEditorChange = (html: string) => {
    setValue("content", html); // react-hook-form will track this
  };

  //handle change function
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //save article function
  const publishArticle = async (e: any) => {
    e.preventDefault();
    if (!content) {
      toast.error("Please write your article content");
      return;
    }

    fetch("/api/help/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: formData.title,
        category: formData.category,
        content: content,
      }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Article Published");
          window.open("/help", "_self");
        } else {
          throw new Error("Article Not Published ");
        }
      })
      .catch((error) => {
        toast.error(`${error}`);
      });
  };

  const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();

  const isFormInvalid =
    !formData.title.trim() ||
    !formData.category.trim()


  return (
    <form onSubmit={publishArticle} className="pt-[40px] px-3 lg:px-[56px]">
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
          {/* <button
            className=" text-indigo-600 bg-transparent  py-[10px] px-4 rounded-[10px] flex gap-x-1 text-base font-semibold items-center h-full border-[1px] border-indigo-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // preview();
            }}
          >
            {" "}
            Preview
            <HelpEyeColorIcon />
          </button> */}

          {/* <Dialog>
            <DialogTrigger
              disabled={!formData.title || !formData.category || !content}
            >
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
                Publish{" "}
                <span className="font-semibold capitalize">
                  {" "}
                  {formData.title}{" "}
                </span>{" "}
                to{" "}
                <span className="font-semibold capitalize">
                  {formData.category}
                </span>{" "}
                .
              </p>
              <button
                className="text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-4 rounded-[10px] mt-4 text-base font-semibold items-center border-[1px] border-indigo-500 mx-auto"
                onClick={(e) => publishArticle(e)}
              >
                {" "}
                Publish
              </button>
            </DialogContent>
          </Dialog> */}

          <Dialog>
            <DialogTrigger asChild>
              <button
                disabled={isFormInvalid}
                className={`py-[10px] px-4 rounded-[10px] flex gap-x-1 text-base font-semibold items-center h-full transition-colors
        ${isFormInvalid
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end hover:opacity-90"}`}
              >
                Publish
                <HelpUploadIcon />
              </button>
            </DialogTrigger>

            <DialogContent className="py-8 px-3">
              <p className="text-indigo-600 text-2xl font-bold text-center">
                Publish article
              </p>
              <p className="mt-6 text-center text-base text-[#555555]">
                Publish{" "}
                <span className="font-semibold capitalize">{formData.title}</span> to{" "}
                <span className="font-semibold capitalize">{formData.category}</span>.
              </p>
              <button
                disabled={isFormInvalid}
                className={`py-[10px] px-4 rounded-[10px] mt-4 text-base font-semibold border-[1px] mx-auto block transition-colors
        ${isFormInvalid
                    ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
                    : "text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end border-indigo-500 hover:opacity-90"}`}
                onClick={(e) => publishArticle(e)}
              >
                Publish
              </button>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* mid */}

      <section className="mt-4 lg:mt-6 ">
        <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-4">
          <div className="w-full flex items-center justify-between">
            <div className="px-3 bg-transparent flex items-center w-full lg:w-10/12">
              <input
                type="text"
                value={formData.title}
                name="title"
                onChange={handleChange}
                placeholder="Title"
                className="outline-none text-2xl text-[#31353B] font-semibold  bg-transparent h-[44px] w-full placeholder-black"
                required
              />
            </div>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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
          <CustomTextEditor
            value={watch("content") || ""}
            setValue={handleEditorChange}
          />
        </div>
      </section>
    </form>
  );
}


