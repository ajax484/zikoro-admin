import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function generatePricingAlias(): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const productType = searchParams.get("productType") || "Inventory";

  try {
    const { data, error } = await supabase
      .from("subscriptionPricing")
      .select("*")
      .eq("productType", productType)
      .order("plan", { ascending: true })
      .order("subscriptionCycle", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching subscription pricing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const payload = await req.json();

    if (!payload.plan || !payload.productType) {
      return NextResponse.json(
        { error: "plan and productType are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("subscriptionPricing")
      .insert({
        ...payload,
        pricingAlias: payload.pricingAlias || generatePricingAlias(),
      })
      .select("*")
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating subscription pricing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
