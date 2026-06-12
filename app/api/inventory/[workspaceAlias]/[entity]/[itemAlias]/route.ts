import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { workspaceAlias: string; entity: string; itemAlias: string } },
) {
  const supabase = createClient();
  const { workspaceAlias, entity, itemAlias } = params;

  try {
    if (entity === "products") {
      const { data: product, error } = await supabase
        .from("inventoryProducts")
        .select("*")
        .eq("organizationAlias", workspaceAlias)
        .eq("productAlias", itemAlias)
        .maybeSingle();

      if (error) throw error;
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

      const [variantsRes, ledgerRes, categoryRes, manufacturerRes, groupRes] = await Promise.all([
        product.productGroupAlias
          ? supabase
              .from("inventoryProducts")
              .select("id, productAlias, productName, sku, variantAttributes, productCost, images")
              .eq("productGroupAlias", product.productGroupAlias)
              .neq("productAlias", itemAlias)
          : Promise.resolve({ data: [] as any[] }),
        supabase
          .from("inventoryMovementLedger")
          .select("*")
          .eq("productAlias", itemAlias)
          .order("created_at", { ascending: false })
          .limit(50),
        product.productCategory
          ? supabase.from("inventoryCategory").select("categoryName").eq("id", product.productCategory).maybeSingle()
          : Promise.resolve({ data: null as any }),
        product.manufacturer
          ? supabase
              .from("inventoryManufacturer")
              .select("name")
              .eq("manufacturerAlias", product.manufacturer)
              .maybeSingle()
          : Promise.resolve({ data: null as any }),
        product.productGroupAlias
          ? supabase.from("inventoryProductGroups").select("name").eq("groupAlias", product.productGroupAlias).maybeSingle()
          : Promise.resolve({ data: null as any }),
      ]);

      const locationAliases = Array.from(
        new Set((ledgerRes.data || []).map((l: any) => l.location).filter(Boolean)),
      );
      const { data: locations } = locationAliases.length
        ? await supabase.from("inventoryLocation").select("locationAlias, Name").in("locationAlias", locationAliases)
        : { data: [] as any[] };
      const locationMap = new Map((locations || []).map((l: any) => [l.locationAlias, l.Name]));

      return NextResponse.json(
        {
          data: {
            product: {
              ...product,
              categoryName: categoryRes.data?.categoryName || null,
              manufacturerName: manufacturerRes.data?.name || null,
              groupName: groupRes.data?.name || null,
            },
            variants: variantsRes.data || [],
            ledger: (ledgerRes.data || []).map((l: any) => ({
              ...l,
              locationName: locationMap.get(l.location) || null,
            })),
          },
        },
        { status: 200 },
      );
    }

    if (entity === "transfers") {
      const { data: transfer, error } = await supabase
        .from("inventoryStockTransfer")
        .select("*")
        .eq("organizationAlias", workspaceAlias)
        .eq("transferAlias", itemAlias)
        .maybeSingle();

      if (error) throw error;
      if (!transfer) return NextResponse.json({ error: "Transfer not found" }, { status: 404 });

      const locationAliases = [transfer.originLocation, transfer.destinationLocation].filter(Boolean);
      const userIds = [transfer.createdBy, transfer.assignedTo, transfer.receivedBy].filter((v) => v != null);

      const [ledgerRes, locationsRes, usersRes] = await Promise.all([
        supabase.from("inventoryMovementLedger").select("*").eq("stockTransferAlias", itemAlias),
        locationAliases.length
          ? supabase.from("inventoryLocation").select("locationAlias, Name").in("locationAlias", locationAliases)
          : Promise.resolve({ data: [] as any[] }),
        userIds.length
          ? supabase.from("users").select("id, firstName, lastName, userEmail").in("id", userIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const productAliases = Array.from(
        new Set((ledgerRes.data || []).map((l: any) => l.productAlias).filter(Boolean)),
      );
      const { data: products } = productAliases.length
        ? await supabase.from("inventoryProducts").select("productAlias, productName, sku").in("productAlias", productAliases)
        : { data: [] as any[] };

      const productMap = new Map((products || []).map((p: any) => [p.productAlias, p]));
      const locationMap = new Map((locationsRes.data || []).map((l: any) => [l.locationAlias, l.Name]));
      const userMap = new Map((usersRes.data || []).map((u: any) => [u.id, u]));

      return NextResponse.json(
        {
          data: {
            transfer: {
              ...transfer,
              originLocationName: locationMap.get(transfer.originLocation) || null,
              destinationLocationName: locationMap.get(transfer.destinationLocation) || null,
              creator: userMap.get(transfer.createdBy) || null,
              assignee: userMap.get(transfer.assignedTo) || null,
              receiver: userMap.get(transfer.receivedBy) || null,
            },
            items: (ledgerRes.data || []).map((l: any) => ({
              ...l,
              product: productMap.get(l.productAlias) || null,
            })),
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "Unknown entity" }, { status: 400 });
  } catch (error: any) {
    console.error(`Error fetching inventory ${entity} detail:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
