"use client";

import Image from "next/image";
import AdminBlogActions from "./AdminBlogActions";

interface AdminPublishedBlogProps {
  id: number;
  title: string;
  createdAt: string;
  category: string;
  status: string;
  statusDetails: any;
  readingDuration: number;
  content: any;
  views: number;
  shares: number;
  tags: string[];
  headerImageUrl: string;
  draft?: boolean;
  scheduled?: boolean;
}

export default function AdminPublishedBlog({
  id,
  title,
  createdAt,
  category,
  status,
  statusDetails,
  readingDuration,
  content,
  views,
  shares,
  tags,
  headerImageUrl,
  draft = false,
  scheduled = false,
}: AdminPublishedBlogProps) {
  return (
    <div className="flex flex-col md:flex-row border rounded-xl shadow-sm overflow-hidden bg-white">
      {/* Thumbnail */}
      <div className="relative w-full md:w-[240px] h-[160px] md:h-auto">
        <Image
          src={headerImageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-indigo-600 uppercase mt-1">{category}</p>
          </div>

          {/* Actions */}
          <AdminBlogActions id={id} status={status} />
        </div>

        {/* Metadata */}
        <div className="mt-4 text-sm text-gray-600 flex flex-wrap gap-4">
          <span>{readingDuration} min read</span>
          <span>{views} views</span>
          <span>{shares} shares</span>
          {tags && tags.length > 0 && (
            <span className="truncate">Tags: {tags.join(", ")}</span>
          )}
        </div>

        {/* Status Flags */}
        <div className="mt-3">
          {draft && (
            <span className="inline-block text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
              Draft
            </span>
          )}
          {scheduled && (
            <span className="inline-block text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded ml-2">
              Scheduled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
