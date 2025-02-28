import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params: { workspaceAlias } }: { params: { workspaceAlias: number } }
) {
  const supabase = createRouteHandlerClient({ cookies });

  if (req.method !== "PATCH") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const bodyParams = await req.json();

    const { data, error } = await supabase
      .from("organizationVerification")
      .update(bodyParams)
      .eq("workspaceAlias", workspaceAlias)
      .select("*, workspace:organization!inner(*)")
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(
      {
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the request.",
      },
      {
        status: 500,
      }
    );
  }
}

export const dynamic = "force-dynamic";
