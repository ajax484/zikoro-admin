export const dynamic = "force-dynamic"; // Important for dynamic data

import React from "react";
import { createClient } from "@supabase/supabase-js";
import AdminPublishedBlog from "@/components/blog/AdminBlogTemplate";
import {
  AdminBlogPostIcon,
  AdminBlogShareIcon,
  AdminBlogViewIcon,
} from "@/constants/icons";
import "react-datepicker/dist/react-datepicker.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchPublishedBlogPosts() {
  const { data, error } = await supabase
    .from("blog")
    .select(
      "id, title, created_at, category, headerImageUrl, readingDuration, status, statusDetails, content, views, shares, tags"
    )
    .eq("status", "publish")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error.message);
    return [];
  }

  return data ?? [];
}

export default async function AdminDashboard() {
  const blogData = await fetchPublishedBlogPosts();

  const totalViews = blogData.reduce((acc, post) => acc + post.views, 0);
  const totalShares = blogData.reduce((acc, post) => acc + post.shares, 0);
  const totalPosts = blogData.length;

  return (
    <div className="pl-3 lg:pl-10 pr-3 lg:pr-28 pt-28 pb-7 lg:pb-10">
      {/* Header */}
      <div className="flex pb-[44px] gap-x-10 overflow-x-auto lg:overflow-x-hidden no-scrollbar">
        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg">
          <AdminBlogPostIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">{totalPosts}</p>
            <p className="text-base font-normal">Blog Posts</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg">
          <AdminBlogViewIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">{totalViews}</p>
            <p className="text-base font-normal">Total Visits</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg">
          <AdminBlogShareIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">{totalShares}</p>
            <p className="text-base font-normal">Shares</p>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <section className="mt-4 lg:mt-10">
        <p className="font-semibold text-2xl lg:text-3xl text-center lg:text-left gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end">
          Published Blog Post
        </p>
        <p className="font-normal text-sm lg:text-xl text-center lg:text-left mt-2">
          View all published blog posts
        </p>
      </section>

      {/* Blog List */}
      <section className="flex flex-col gap-y-[48px] lg:gap-y-[100px] lg:max-w-[1160px] mx-auto mt-[52px] lg:mt-[100px] min-h-[30vh]">
        {blogData.length > 0 ? (
          blogData.map((blogPost: any) => (
            <AdminPublishedBlog
              key={blogPost.id}
              scheduled={false}
              draft={false}
              id={blogPost.id}
              title={blogPost.title}
              createdAt={blogPost.created_at}
              category={blogPost.category}
              status={blogPost.status}
              statusDetails={blogPost.statusDetails}
              readingDuration={blogPost.readingDuration}
              content={blogPost.content}
              views={blogPost.views}
              shares={blogPost.shares}
              tags={blogPost.tags}
              headerImageUrl={blogPost.headerImageUrl}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 mt-10">No published blog posts yet.</p>
        )}
      </section>
    </div>
  );
}


