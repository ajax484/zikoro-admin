import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ENTITY_TABLES: Record<string, string> = {
  products: "inventoryProducts",
  locations: "inventoryLocation",
  adjustments: "inventoryStockAdjustment",
  transfers: "inventoryStockTransfer",
  ledger: "inventoryMovementLedger",
  vendors: "inventoryManufacturer",
  categories: "inventoryCategory",
};

export async function GET(
  req: NextRequest,
  { params }: { params: { workspaceAlias: string; entity: string } },
) {
  const supabase = createClient();
  const { workspaceAlias, entity } = params;
  const table = ENTITY_TABLES[entity];

  if (!table) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = (searchParams.get("search") || "").trim();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from(table)
      .select("*", { count: "exact" })
      .eq("organizationAlias", workspaceAlias);

    if (entity === "products") {
      if (search) {
        const term = `%${search}%`;
        query = query.or(`productName.ilike.${term},sku.ilike.${term},barcode.ilike.${term}`);
      }
      query = query.or("deleted.is.null,deleted.eq.false");

      const category = searchParams.get("category");
      if (category) query = query.eq("productCategory", category);

      const manufacturer = searchParams.get("manufacturer");
      if (manufacturer) query = query.eq("manufacturer", manufacturer);

      const serialized = searchParams.get("serialized");
      if (serialized) query = query.eq("serialized", serialized === "true");

      const status = searchParams.get("status");
      if (status) query = query.eq("productStatusActive", status === "active");
    }

    if (entity === "locations" && search) {
      const term = `%${search}%`;
      query = query.or(`Name.ilike.${term},locationAlias.ilike.${term},City.ilike.${term}`);
    }

    if (entity === "transfers") {
      const status = searchParams.get("status");
      if (status) query = query.eq("status", status);
    }

    if (entity === "ledger") {
      const productAlias = searchParams.get("productAlias");
      if (productAlias) query = query.eq("productAlias", productAlias);

      const movementType = searchParams.get("movementType");
      if (movementType) query = query.eq("MovementType", movementType);
    }

    if (entity === "vendors" && search) {
      const term = `%${search}%`;
      query = query.or(`name.ilike.${term},email.ilike.${term},contact.ilike.${term}`);
    }

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    let enriched: any[] = data || [];

    if (entity === "products" && enriched.length) {
      const categoryIds = Array.from(
        new Set(enriched.map((p) => p.productCategory).filter((v) => v != null)),
      );
      const manufacturerAliases = Array.from(
        new Set(enriched.map((p) => p.manufacturer).filter(Boolean)),
      );
      const groupAliases = Array.from(
        new Set(enriched.map((p) => p.productGroupAlias).filter(Boolean)),
      );

      const [categoriesRes, manufacturersRes, groupsRes] = await Promise.all([
        categoryIds.length
          ? supabase.from("inventoryCategory").select("id, categoryName").in("id", categoryIds)
          : Promise.resolve({ data: [] as any[] }),
        manufacturerAliases.length
          ? supabase
              .from("inventoryManufacturer")
              .select("manufacturerAlias, name")
              .in("manufacturerAlias", manufacturerAliases)
          : Promise.resolve({ data: [] as any[] }),
        groupAliases.length
          ? supabase.from("inventoryProductGroups").select("groupAlias, name").in("groupAlias", groupAliases)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const categoryMap = new Map((categoriesRes.data || []).map((c: any) => [c.id, c.categoryName]));
      const manufacturerMap = new Map(
        (manufacturersRes.data || []).map((m: any) => [m.manufacturerAlias, m.name]),
      );
      const groupMap = new Map((groupsRes.data || []).map((g: any) => [g.groupAlias, g.name]));

      enriched = enriched.map((p) => ({
        ...p,
        categoryName: categoryMap.get(p.productCategory) || null,
        manufacturerName: manufacturerMap.get(p.manufacturer) || null,
        groupName: groupMap.get(p.productGroupAlias) || null,
      }));
    }

    if (entity === "adjustments" && enriched.length) {
      const locationAliases = Array.from(new Set(enriched.map((a) => a.locationAlias).filter(Boolean)));
      const productAliases = Array.from(new Set(enriched.map((a) => a.productAlias).filter(Boolean)));
      const reasonAliases = Array.from(
        new Set(enriched.map((a) => a.adjustmentReasonAlias).filter(Boolean)),
      );
      const userIds = Array.from(new Set(enriched.map((a) => a.createdBy).filter((v) => v != null)));

      const [locationsRes, productsRes, reasonsRes, usersRes] = await Promise.all([
        locationAliases.length
          ? supabase.from("inventoryLocation").select("locationAlias, Name").in("locationAlias", locationAliases)
          : Promise.resolve({ data: [] as any[] }),
        productAliases.length
          ? supabase.from("inventoryProducts").select("productAlias, productName, sku").in("productAlias", productAliases)
          : Promise.resolve({ data: [] as any[] }),
        reasonAliases.length
          ? supabase
              .from("inventoryAdjustmentReason")
              .select("adjustmentReasonAlias, adjustmentReason")
              .in("adjustmentReasonAlias", reasonAliases)
          : Promise.resolve({ data: [] as any[] }),
        userIds.length
          ? supabase.from("users").select("id, firstName, lastName, userEmail").in("id", userIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const locationMap = new Map((locationsRes.data || []).map((l: any) => [l.locationAlias, l.Name]));
      const productMap = new Map((productsRes.data || []).map((p: any) => [p.productAlias, p]));
      const reasonMap = new Map(
        (reasonsRes.data || []).map((r: any) => [r.adjustmentReasonAlias, r.adjustmentReason]),
      );
      const userMap = new Map((usersRes.data || []).map((u: any) => [u.id, u]));

      enriched = enriched.map((a) => ({
        ...a,
        locationName: locationMap.get(a.locationAlias) || null,
        product: productMap.get(a.productAlias) || null,
        reasonName: reasonMap.get(a.adjustmentReasonAlias) || a.comment || null,
        creator: userMap.get(a.createdBy) || null,
      }));
    }

    if (entity === "transfers" && enriched.length) {
      const locationAliases = Array.from(
        new Set(enriched.flatMap((t) => [t.originLocation, t.destinationLocation]).filter(Boolean)),
      );
      const userIds = Array.from(
        new Set(enriched.flatMap((t) => [t.createdBy, t.assignedTo]).filter((v) => v != null)),
      );

      const [locationsRes, usersRes] = await Promise.all([
        locationAliases.length
          ? supabase.from("inventoryLocation").select("locationAlias, Name").in("locationAlias", locationAliases)
          : Promise.resolve({ data: [] as any[] }),
        userIds.length
          ? supabase.from("users").select("id, firstName, lastName, userEmail").in("id", userIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const locationMap = new Map((locationsRes.data || []).map((l: any) => [l.locationAlias, l.Name]));
      const userMap = new Map((usersRes.data || []).map((u: any) => [u.id, u]));

      enriched = enriched.map((t) => ({
        ...t,
        originLocationName: locationMap.get(t.originLocation) || null,
        destinationLocationName: locationMap.get(t.destinationLocation) || null,
        creator: userMap.get(t.createdBy) || null,
        assignee: userMap.get(t.assignedTo) || null,
      }));
    }

    if (entity === "ledger" && enriched.length) {
      const productAliases = Array.from(new Set(enriched.map((l) => l.productAlias).filter(Boolean)));
      const locationAliases = Array.from(new Set(enriched.map((l) => l.location).filter(Boolean)));

      const [productsRes, locationsRes] = await Promise.all([
        productAliases.length
          ? supabase.from("inventoryProducts").select("productAlias, productName, sku").in("productAlias", productAliases)
          : Promise.resolve({ data: [] as any[] }),
        locationAliases.length
          ? supabase.from("inventoryLocation").select("locationAlias, Name").in("locationAlias", locationAliases)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const productMap = new Map((productsRes.data || []).map((p: any) => [p.productAlias, p]));
      const locationMap = new Map((locationsRes.data || []).map((l: any) => [l.locationAlias, l.Name]));

      enriched = enriched.map((l) => ({
        ...l,
        product: productMap.get(l.productAlias) || null,
        locationName: locationMap.get(l.location) || null,
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
    console.error(`Error fetching inventory ${entity}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
