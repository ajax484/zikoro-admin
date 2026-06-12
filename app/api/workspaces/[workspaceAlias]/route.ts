import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { workspaceAlias: string } },
) {
  const supabase = createClient();
  const { workspaceAlias } = params;

  try {
    const { activeApps, ...rest } = await req.json();

    let updatePayload: Record<string, any> = { ...rest };

    if (activeApps) {
      const { data: existing, error: fetchError } = await supabase
        .from("organization")
        .select("activeApps")
        .eq("organizationAlias", workspaceAlias)
        .maybeSingle();

      if (fetchError) throw fetchError;

      updatePayload.activeApps = {
        ...(existing?.activeApps || {}),
        ...activeApps,
      };
    }

    const { data, error } = await supabase
      .from("organization")
      .update(updatePayload)
      .eq("organizationAlias", workspaceAlias)
      .select("*, verification:organizationVerification(*)")
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating workspace:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { workspaceAlias: string } },
) {
  const supabase = createClient();
  const { workspaceAlias } = params;

  try {
    const { error } = await supabase
      .from("organization")
      .delete()
      .eq("organizationAlias", workspaceAlias);

    if (error) throw error;

    return NextResponse.json({ data: { workspaceAlias } }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
