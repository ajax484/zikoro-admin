import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { status: string } }
) {
  const { status: eventStatus } = params;
  const supabase = createClient();

  if (req.method === "GET") {
    try {
      const searchParams = new URLSearchParams(req.url);
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      let totalPages = 0;
      const { data, error, status, count } = await supabase
        .from("events")
        .select("* , organization!inner(*)",  { count: "exact" })
        .eq("eventStatus", eventStatus)
        .range(Number(from || 0), Number(to || 50));
       
       
        if (data && data?.length > 0 && count) totalPages = Math.ceil(count / 50);

        if (error) {
          return NextResponse.json({
            error: error?.message
          },
        {status: 400}
        )
        }

      if (error) throw error;

      return NextResponse.json(
        {
          data : {responseData: data, totalPages},
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

export const dynamic = "force-dynamic";
