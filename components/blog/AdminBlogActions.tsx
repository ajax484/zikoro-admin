"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AdminBlogActionsProps {
  id: number;
  status: string;
}

export default function AdminBlogActions({ id, status }: AdminBlogActionsProps) {
  const router = useRouter();

  const deletePost = async () => {
    try {
      const response = await fetch("/api/blog/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast.success("Post deleted");
        router.refresh(); // ✅ Refresh the page content without reload
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <button
          onClick={deletePost}
          className="flex w-full items-center justify-start gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </PopoverContent>
    </Popover>
  );
}
