import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

type DraftRequestBody = {
  id: number;
  title: string;
  category: string;
  tags: string[];
  content: [];
  headerImageUrl: string;
  readingDuration: number;
  status: string;
};

const supabase = createClient();

// export async function GET(req: NextRequest) {

//   if (req.method === "GET") {
//     try {
//       const { data, error } = await supabase
//         .from("blog")
//         .select('*')
//         .eq("status", "draft")
//         .limit(10)
//         .order("created_at", { ascending: true }) // Order by created_at in descending order


//       if (error) throw error;

//       return NextResponse.json(
//         {
//           data,
//         },
//         {
//           status: 200,
//         }
//       );
//     } catch (error) {
//       console.error(error);
//       return NextResponse.json(
//         {
//           error: "An error occurred while making the request.",
//         },
//         {
//           status: 500,
//         }
//       );
//     }
//   } else {
//     return NextResponse.json({ error: "Method not allowed" });
//   }
// }

//UPDATE Funtionality


export async function GET(req: NextRequest) {
  const supabase = createClient();

  // Read limit and offset from query parameters
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "5", 10); // default 5
  const offset = parseInt(searchParams.get("offset") || "0", 10); // default 0


  try {
    const { data, error } = await supabase
      .from("blog")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1) // Supabase uses inclusive range


    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching blog posts." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  if (req.method === "PUT") {
    const body = (await req.json()) as DraftRequestBody | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid request body" });
    }
    const {
      id,
      title,
      category,
      tags,
      content,
      headerImageUrl,
      readingDuration,
      status,
    } = body;

    try {
      const { data, error } = await supabase
        .from("blog")
        .update({
          title,
          category,
          tags,
          headerImageUrl,
          readingDuration,
          status,
          content,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }
      return NextResponse.json(data);
    } catch (error: any) {
      console.error("Error updating blog post:", error.message);
      NextResponse.json({ message: "Internal server error" });
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export const dynamic = "force-dynamic";
