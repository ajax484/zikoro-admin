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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { workspaceAlias: string } },
) {
  const supabase = createClient();
  const { workspaceAlias } = params;

  try {
    const payload = await req.json();
    const { adminUserId, ...subscriptionFields } = payload;

    const { data: existingSubs, error: existingError } = await supabase
      .from("inventorySubscription")
      .select("id")
      .eq("organizationAlias", workspaceAlias)
      .order("created_at", { ascending: false });

    if (existingError) throw existingError;

    let result;
    if (existingSubs && existingSubs.length > 0) {
      const latestId = existingSubs[0].id;
      result = await supabase
        .from("inventorySubscription")
        .update(subscriptionFields)
        .eq("id", latestId)
        .select("*")
        .maybeSingle();

      if (existingSubs.length > 1) {
        const oldIds = existingSubs.slice(1).map((r: any) => r.id);
        await supabase.from("inventorySubscription").delete().in("id", oldIds);
      }
    } else {
      result = await supabase
        .from("inventorySubscription")
        .insert({ ...subscriptionFields, organizationAlias: workspaceAlias })
        .select("*")
        .maybeSingle();
    }

    const { data, error } = result;
    if (error) throw error;

    const historyAlias = `SUB_HIST_${workspaceAlias}_${Date.now()}`;
    await supabase.from("inventorySubscriptionHistoryAndPayment").insert({
      userId: adminUserId || null,
      amount: subscriptionFields.amountPaid || 0,
      currency: subscriptionFields.currency || "USD",
      status: "success",
      paymentMethod: "admin_override",
      organizationAlias: workspaceAlias,
      transactionReference: `ADMIN_${Date.now()}`,
      paidAt: new Date().toISOString(),
      eventType: "admin_update",
      subscriptionStartDate: subscriptionFields.subscriptionStartDate,
      subscriptionEndDate: subscriptionFields.subscriptionEndDate,
      inventorySubscriptionHistoryAndPaymentAlias: historyAlias,
      subscriptionPlan: subscriptionFields.subscriptionPlanAlias || null,
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating workspace subscription:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
