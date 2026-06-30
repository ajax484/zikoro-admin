import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const search = (searchParams.get("search") || "").trim();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");
  const currency = searchParams.get("currency");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    let query = supabase
      .from("inventorySubscriptionHistoryAndPayment")
      .select("status, amount, currency", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (currency) query = query.eq("currency", currency);
    if (startDate) query = query.gte("paidAt", startDate);
    if (endDate) query = query.lte("paidAt", endDate);

    if (plan) {
      const { data: pricingRows } = await supabase
        .from("subscriptionPricing")
        .select("pricingAlias")
        .eq("plan", plan)
        .eq("productType", "Inventory");

      const aliases = (pricingRows || []).map((p: any) => p.pricingAlias);
      query = query.in("subscriptionPlan", aliases.length ? aliases : [""]);
    }

    if (search) {
      const term = `%${search}%`;
      const { data: matchingOrgs } = await supabase
        .from("organization")
        .select("organizationAlias")
        .ilike("organizationName", term);

      const orgAliases = (matchingOrgs || []).map((o: any) => o.organizationAlias);

      if (orgAliases.length) {
        query = query.or(
          `transactionReference.ilike.${term},organizationAlias.in.(${orgAliases.join(",")})`,
        );
      } else {
        query = query.ilike("transactionReference", term);
      }
    }

    const { data, error, count } = await query;
    if (error) throw error;

    let totalTransactions = count || 0;
    let successfulTransactions = 0;
    let failedTransactions = 0;
    let pendingTransactions = 0;
    let totalRevenue = 0;

    if (data) {
      for (const t of data) {
        const tStatus = (t.status || "").toLowerCase();
        if (tStatus === "success" || tStatus === "paid") {
          successfulTransactions++;
          // We only sum revenue if a specific currency is selected to avoid mixing currencies.
          if (currency && t.amount != null) {
             totalRevenue += Number(t.amount);
          }
        } else if (tStatus === "failed") {
          failedTransactions++;
        } else if (tStatus === "pending") {
          pendingTransactions++;
        }
      }
    }

    const stats = {
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      totalRevenue: currency ? totalRevenue : null, // only return revenue if currency filter is active
    };

    return NextResponse.json(
      { data: stats },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching inventory transactions stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
