"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useFetchArticle } from "@/hooks/services/help";
import { CustomTextEditor } from "@/components/editor/CustomTextEditor";

export default function EditArticle({ articleId }: { articleId: number }) {
  const { data } = useFetchArticle(articleId);
  const router = useRouter();
  const [editorContent, setEditorContent] = useState("");

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    criteriaMode: "all",
    mode: "onChange",
  });

  const content = watch("content");

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

  const setMessage = (content: string) => {
    setValue("content", content);
  };

  const save = async (formData: any) => {
    try {
      const response = await fetch("/api/help/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          ...formData,
          content,
        }),
      });

      if (response.ok) {
        toast.success("Article Updated");
        router.push("/help");
      } else {
        throw new Error("Post Not Updated");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        content: data?.Details,
        title: data?.title,
        category: data?.productCategory,
      });
      setEditorContent(data?.Details); // <--- sync to state for the editor
      setValue("content", data?.Details);
    }
  }, [data, reset, setValue]);

  const handleEditorChange = (html: string) => {
    setEditorContent(html);          // local state for editor display
    setValue("content", html);       // react-hook-form tracking
  };

  console.log("data", data);

  return (
    <div className="lg:max-w-[1180px] mx-auto">
      <div className="flex flex-col pl-3 lg:pl-10 pr-3 lg:pr-12 pt-28">
        <p className="text-3xl font-semibold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text pl-3">
          Edit Article
        </p>

        <section className="mt-4 lg:mt-6">
          <form onSubmit={handleSubmit(save)}>
            <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6 items-center gap-x-0 lg:gap-x-1 w-full">
              {/* left */}
              <div className="rounded-xl shadow-sm w-full lg:w-8/12">
                <div className="px-3 bg-transparent rounded-xl flex items-center">
                  <input
                    type="text"
                    {...register("title", { required: true })}
                    placeholder="Enter Blog Title"
                    className="pl-4 outline-none text-2xl text-gray-600 bg-transparent h-[44px] w-full"
                    required
                  />
                </div>
              </div>

              {/* right */}
              <div className="flex flex-col lg:flex-row items-center gap-x-1 gap-y-2 w-full lg:w-4/12">
                <select
                  {...register("category", { required: true })}
                  required
                  className="w-full h-[44px] bg-transparent rounded-lg border-[1px] text-[15px] border-indigo-600 px-4 outline-none hover:text-gray-50 hover:bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end cursor-pointer text-indigo-700 font-medium"
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  className="text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end w-full h-[44px] rounded-lg font-medium text-[15px] cursor-pointer"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </div>


            <div className="mt-8 lg:mt-[50px] bg-transparent flex-1 resize-none h-fit mb-10 ">
              {data &&
                <CustomTextEditor
                  key={articleId}
                  value={editorContent}
                  setValue={handleEditorChange}
                />
              }
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
