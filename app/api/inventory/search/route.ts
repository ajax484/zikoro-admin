import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").trim();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (q.length < 2) {
    return NextResponse.json(
      { data: { data: [], page, limit, total: 0, totalPages: 0 } },
      { status: 200 },
    );
  }

  try {
    const term = `%${q}%`;

    const { data: products, error, count } = await supabase
      .from("inventoryProducts")
      .select(
        "id, productAlias, productName, sku, barcode, organizationAlias, productCost, currency, manufacturer, productGroupAlias, serialized, images",
        { count: "exact" },
      )
      .or(`productName.ilike.${term},sku.ilike.${term},barcode.ilike.${term}`)
      .or("deleted.is.null,deleted.eq.false")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const aliases = Array.from(
      new Set((products || []).map((p) => p.organizationAlias).filter(Boolean)),
    );

    const { data: orgs, error: orgsError } = await supabase
      .from("organization")
      .select("organizationAlias, organizationName, organizationLogo")
      .in("organizationAlias", aliases.length ? aliases : [""]);

    if (orgsError) throw orgsError;

    const orgMap = new Map((orgs || []).map((o) => [o.organizationAlias, o]));

    const data = (products || []).map((p) => ({
      ...p,
      organizationName: orgMap.get(p.organizationAlias)?.organizationName || p.organizationAlias,
      organizationLogo: orgMap.get(p.organizationAlias)?.organizationLogo || null,
    }));

    return NextResponse.json(
      {
        data: {
          data,
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error in inventory search:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
