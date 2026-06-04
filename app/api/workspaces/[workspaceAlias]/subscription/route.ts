import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { workspaceAlias: string } }
) {
  const supabase = createClient();
  const { workspaceAlias } = params;
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Fetch the latest active subscription for this org
    const { data: subscription, error: subError } = await supabase
      .from("inventorySubscription")
      .select("*")
      .eq("organizationAlias", workspaceAlias)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) throw subError;

    // Fetch payment/history records for this org with pagination
    const { data: history, error: histError, count } = await supabase
      .from("inventorySubscriptionHistoryAndPayment")
      .select("*", { count: "exact" })
      .eq("organizationAlias", workspaceAlias)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (histError) throw histError;

    return NextResponse.json(
      {
        data: {
          subscription: subscription || null,
          history: {
            data: history || [],
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in workspaces/[workspaceAlias]/subscription:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
