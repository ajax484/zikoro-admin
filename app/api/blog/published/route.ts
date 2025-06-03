import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
      .eq("status", "publish")
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


export const dynamic = "force-dynamic";
