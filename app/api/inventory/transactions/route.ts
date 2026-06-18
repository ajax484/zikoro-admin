import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = (searchParams.get("search") || "").trim();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("inventorySubscriptionHistoryAndPayment")
      .select("*", { count: "exact" });

    if (status) query = query.eq("status", status);
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

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    let enriched: any[] = data || [];

    if (enriched.length) {
      const orgAliases = Array.from(
        new Set(enriched.map((t) => t.organizationAlias).filter(Boolean)),
      );
      const pricingAliases = Array.from(
        new Set(enriched.map((t) => t.subscriptionPlan).filter(Boolean)),
      );

      const [orgsRes, pricingRes] = await Promise.all([
        orgAliases.length
          ? supabase
              .from("organization")
              .select("organizationAlias, organizationName, organizationLogo")
              .in("organizationAlias", orgAliases)
          : Promise.resolve({ data: [] as any[] }),
        pricingAliases.length
          ? supabase
              .from("subscriptionPricing")
              .select("pricingAlias, plan, subscriptionCycle, currency")
              .in("pricingAlias", pricingAliases)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const orgMap = new Map((orgsRes.data || []).map((o: any) => [o.organizationAlias, o]));
      const pricingMap = new Map((pricingRes.data || []).map((p: any) => [p.pricingAlias, p]));

      enriched = enriched.map((t) => ({
        ...t,
        organizationName: orgMap.get(t.organizationAlias)?.organizationName || t.organizationAlias,
        organizationLogo: orgMap.get(t.organizationAlias)?.organizationLogo || null,
        planName: pricingMap.get(t.subscriptionPlan)?.plan || null,
        planCycle: pricingMap.get(t.subscriptionPlan)?.subscriptionCycle || null,
      }));
    }

    return NextResponse.json(
      {
        data: {
          data: enriched,
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching inventory transactions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
