import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const workspaceAlias = searchParams.get("workspaceAlias");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // 1. Fetch organizations with pagination
    let orgQuery = supabase
      .from("organization")
      .select("*, verification:organizationVerification(*)", { count: "exact" });

    if (workspaceAlias) {
      orgQuery = orgQuery.eq("organizationAlias", workspaceAlias);
    }
    
    if (search) {
      const term = `%${search.trim()}%`;
      orgQuery = orgQuery.or(
        `organizationName.ilike.${term},organizationAlias.ilike.${term},organizationOwner.ilike.${term},eventContactEmail.ilike.${term}`
      );
    }

    const { data: organizations, error: orgError, count } = await orgQuery
      .range(from, to)
      .order("created_at", { ascending: false });

    if (orgError) throw orgError;

    // 3. Fetch counts and metrics for each organization
    const statsPromises = (organizations || []).map(async (org) => {
      // Parallelize counts for each org
      const [products, orders, customers, users, revenue, purchaseOrders] = await Promise.all([
        supabase
          .from("inventoryProducts")
          .select("id", { count: "exact", head: true })
          .eq("organizationAlias", org.organizationAlias)
          .or("deleted.is.null,deleted.eq.false"),
        supabase
          .from("salesOrder")
          .select("id", { count: "exact", head: true })
          .eq("organizationAlias", org.organizationAlias),
        supabase
          .from("customerOrganization")
          .select("id", { count: "exact", head: true })
          .eq("workspaceAlias", org.organizationAlias),
        supabase
          .from("organizationTeamMembers")
          .select("id", { count: "exact", head: true })
          .eq("workspaceAlias", org.organizationAlias),
        supabase
          .from("salesOrder")
          .select("totalValue")
          .eq("organizationAlias", org.organizationAlias),
        supabase
          .from("inventoryPurchaseOrder")
          .select("id", { count: "exact", head: true })
          .eq("organizationAlias", org.organizationAlias),
      ]);

      const totalRevenue = revenue.data?.reduce((sum, order) => sum + (order.totalValue || 0), 0) || 0;

      return {
        ...org,
        productsCount: products.count || 0,
        ordersCount: orders.count || 0,
        customersCount: customers.count || 0,
        usersCount: users.count || 0,
        totalRevenue,
        purchaseOrdersCount: purchaseOrders.count || 0,
      };
    });

    const dataWithStats = await Promise.all(statsPromises);

    return NextResponse.json(
      {
        data: dataWithStats,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in workspaces/stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
