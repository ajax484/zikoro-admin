import { Help3dotsIcon, HelpArticle, HelpEyeIcon } from "@/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import { useFetchHelpArticles } from "@/hooks/services/help";
import { useRouter } from "next/navigation";

type ArticleProps = {
  id: number;
  title: string;
  createdAt: string;
  desc: string;
  views: number;
};

export default function Article({
  id,
  title,
  desc,
  views,
  createdAt,
}: ArticleProps) {
  //function that delete post

  const router = useRouter();
  const deletePost = async (id: number) => {
    try {
      const response = await fetch("/api/help/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        toast.success("Post Deleted");
        router.push("/help");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {}
  };

  function daysAgoText(timestamp: string | Date): string {
    const date = new Date(timestamp);
    const today = new Date();

    // Strip time for date-only comparison
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffTime = startOfToday.getTime() - startOfDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return `${diffDays} days ago`;
  }


  console.log(views, createdAt)

  return (
    <div>
      <div className=" bg-white rounded-[10px] p-3 flex gap-x-2 ">
        {/* left */}
        <div className="w-[5%] mt-1">
          <HelpArticle />
        </div>
        {/* right */}
        <div className="w-[95%]">
          <div>
            <div className="flex justify-between items-center">
              <p className="text-base font-semibold"> {title} </p>
              <div className="flex justify-between gap-x-1 items-center">
                <Popover>
                  <PopoverTrigger>
                    {" "}
                    <Help3dotsIcon />
                  </PopoverTrigger>
                  <PopoverContent className="text-[14px] font-medium flex flex-col gap-4 mr-3 w-[121px] rounded-[10px]">
                    <p
                      className="cursor-pointer"
                      onClick={() =>
                        window.open(
                          `https://help.zikoro.com/article/${id} `,
                          "_blank"
                        )
                      }
                    >
                      Open
                    </p>
                    <p
                      onClick={() =>
                        window.open(`/article/${id}/edit `, "_blank")
                      }
                      className="cursor-pointer"
                    >
                      Edit
                    </p>
                    <p
                      className="text-red-500 cursor-pointer"
                      onClick={() => deletePost(id)}
                    >
                      Delete
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <p className="text-[14px] w-full text-[#555555] truncate font-medium mt-2">
              {desc}
            </p>
            <div className="flex justify-between items-center text-[#555555] mt-[8px]">
              <div className="flex gap-x-1 items-center text-[12px] font-medium">
                <p>Added {daysAgoText(createdAt)}</p>
              </div>

              <div className="flex gap-x-1 items-center text-[12px] font-medium">
                <HelpEyeIcon />
                <div className="flex gap-x-1">
                  {views}
                  <p>Total Reads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
