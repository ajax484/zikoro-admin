import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  try {
    const { data: orgs, error: orgsError } = await supabase
      .from("organization")
      .select("organizationAlias")
      .eq("activeApps->>inventory", "true");

    if (orgsError) throw orgsError;

    const aliases = (orgs || []).map((o) => o.organizationAlias);

    let totalWorkspaces = aliases.length;
    let totalProducts = 0;
    let totalOrders = 0;
    let totalCustomers = 0;
    let totalUsers = 0;
    let totalRevenue = 0;
    let totalPurchaseOrders = 0;

    if (aliases.length > 0) {
      // Chunking if array is too large, but typically Supabase handles ~1000 parameters fine
      const { data: statsData, error: statsError } = await supabase
        .from("workspace_stats_view")
        .select("*")
        .in("organizationAlias", aliases);

      if (statsError) throw statsError;

      if (statsData) {
        for (const stat of statsData) {
          totalProducts += stat.productsCount || 0;
          totalOrders += stat.ordersCount || 0;
          totalCustomers += stat.customersCount || 0;
          totalUsers += stat.usersCount || 0;
          totalRevenue += stat.totalRevenue || 0;
          totalPurchaseOrders += stat.purchaseOrdersCount || 0;
        }
      }
    }

    const data = {
      totalWorkspaces,
      totalProducts,
      totalOrders,
      totalCustomers,
      totalUsers,
      totalRevenue,
      totalPurchaseOrders,
    };

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error in inventory/workspaces/stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
