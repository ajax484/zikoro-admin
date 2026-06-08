import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
const supabase = createClient();

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url || "");
      const workspaceAlias = searchParams.get("workspaceAlias");
      console.log(workspaceAlias);
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const search = searchParams.get("search") || "";

      console.log(page, limit);

      if (isNaN(page) || isNaN(limit)) {
        console.log("invalid pagination parameters");
        return NextResponse.json(
          { error: "Invalid pagination parameters" },
          { status: 400 }
        );
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const query = supabase
        .from("organization")
        .select(
          `*,
          verification:organizationVerification(*)
          `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (search !== "") {
        const term = `%${search.trim()}%`;
        query.or(
          `organizationName.ilike.${term},organizationAlias.ilike.${term},organizationOwner.ilike.${term},eventContactEmail.ilike.${term}`
        );
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return NextResponse.json(
        {
          data: {
            data,
            page,
            limit,
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
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
