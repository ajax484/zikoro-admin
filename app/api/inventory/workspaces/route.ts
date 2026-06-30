import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url || "");
      const workspaceAlias = searchParams.get("workspaceAlias");
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);
      const search = searchParams.get("search") || "";
      const sortBy = searchParams.get("sortBy") || "created_at";
      const order = searchParams.get("order") || "desc";
      const filterStatus = searchParams.get("status") || "";
      const filterPlan = searchParams.get("subscriptionPlan") || "";
      const dateStart = searchParams.get("created_at_start") || "";
      const dateEnd = searchParams.get("created_at_end") || "";

      if (isNaN(page) || isNaN(limit)) {
        return NextResponse.json(
          { error: "Invalid pagination parameters" },
          { status: 400 },
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
          { count: "exact" },
        )
        .eq("activeApps->>inventory", "true")
        .order(sortBy, { ascending: order === "asc" })
        .range(from, to);

      if (workspaceAlias) {
        query.eq("organizationAlias", workspaceAlias);
      }

      if (search !== "") {
        const term = `%${search.trim()}%`;
        query.or(
          `organizationName.ilike.${term},organizationAlias.ilike.${term},organizationOwner.ilike.${term},eventContactEmail.ilike.${term}`,
        );
      }

      if (filterPlan) {
        query.eq("subscriptionPlan", filterPlan);
      }

      if (dateStart) {
        query.gte("created_at", dateStart);
      }

      if (dateEnd) {
        const endDate = new Date(dateEnd);
        endDate.setUTCHours(23, 59, 59, 999);
        query.lte("created_at", endDate.toISOString());
      }

      if (filterStatus) {
        const sevenDaysAgo = new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString();
        if (filterStatus === "active") {
          query.gte("activeApps->>lastLogInInventory", sevenDaysAgo);
        } else if (filterStatus === "inactive") {
          query.or(
            `activeApps->>lastLogInInventory.lt.${sevenDaysAgo},activeApps->>lastLogInInventory.is.null`,
          );
        }
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const aliases = (data || []).map((org) => org.organizationAlias);

      const { data: statsData, error: statsError } = await supabase
        .from("workspace_stats_view")
        .select("*")
        .in("organizationAlias", aliases);

      if (statsError) {
        console.error("Failed to fetch stats view:", statsError);
      }

      const dataWithStats = (data || []).map((org) => {
        const stats = statsData?.find(
          (s) => s.organizationAlias === org.organizationAlias,
        );

        return {
          ...org,
          productsCount: stats?.productsCount || 0,
          ordersCount: stats?.ordersCount || 0,
          customersCount: stats?.customersCount || 0,
          usersCount: stats?.usersCount || 0,
          totalRevenue: stats?.totalRevenue || 0,
          purchaseOrdersCount: stats?.purchaseOrdersCount || 0,
        };
      });

      return NextResponse.json(
        {
          data: {
            data: dataWithStats,
            page,
            limit,
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "An error occurred while making the request.",
        },
        {
          status: 500,
        },
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export const dynamic = "force-dynamic";
