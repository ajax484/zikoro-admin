import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { id } = params;

  try {
    const payload = await req.json();
    delete payload.id;
    delete payload.created_at;

    const { data, error } = await supabase
      .from("subscriptionPricing")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating subscription pricing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { id } = params;

  try {
    const { error } = await supabase
      .from("subscriptionPricing")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ data: { id } }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting subscription pricing:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
