import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
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

export async function GET(req: NextRequest) {

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("blog")
        .select()
        .eq("status", "draft");

      if (error) throw error;

      return NextResponse.json(
        {
          data,
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "An error occurred while making the request.",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

//UPDATE Funtionality
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
