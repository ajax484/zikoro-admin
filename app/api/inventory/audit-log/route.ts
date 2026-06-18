import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const organizationAlias = searchParams.get("organizationAlias");
  const entityType = searchParams.get("entityType");
  const action = searchParams.get("action");
  const actorEmail = searchParams.get("actorEmail");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase.from("inventoryAuditLog").select("*", { count: "exact" });

    if (organizationAlias) query = query.eq("organizationAlias", organizationAlias);
    if (entityType) query = query.eq("entityType", entityType);
    if (action) query = query.eq("action", action);
    if (actorEmail) query = query.ilike("actorEmail", `%${actorEmail}%`);
    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    let enriched: any[] = data || [];

    if (enriched.length) {
      const orgAliases = Array.from(
        new Set(enriched.map((e) => e.organizationAlias).filter(Boolean)),
      );

      const { data: orgs } = orgAliases.length
        ? await supabase
            .from("organization")
            .select("organizationAlias, organizationName, organizationLogo")
            .in("organizationAlias", orgAliases)
        : { data: [] as any[] };

      const orgMap = new Map((orgs || []).map((o: any) => [o.organizationAlias, o]));

      enriched = enriched.map((e) => ({
        ...e,
        organizationName: orgMap.get(e.organizationAlias)?.organizationName || e.organizationAlias,
        organizationLogo: orgMap.get(e.organizationAlias)?.organizationLogo || null,
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
    console.error("Error fetching inventory audit log:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
