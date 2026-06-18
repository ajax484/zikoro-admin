import { createClient } from "@/utils/supabase/server";
import { logAuditEvent } from "@/utils/auditLog";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { workspaceAlias: string } },
) {
  const supabase = createClient();
  const { workspaceAlias } = params;

  try {
    const { activeApps, adminUserId, adminEmail, reason, ...rest } = await req.json();

    let updatePayload: Record<string, any> = { ...rest };

    const { data: before, error: beforeError } = await supabase
      .from("organization")
      .select("activeApps")
      .eq("organizationAlias", workspaceAlias)
      .maybeSingle();

    if (beforeError) throw beforeError;

    if (activeApps) {
      updatePayload.activeApps = {
        ...(before?.activeApps || {}),
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

    if (activeApps) {
      await logAuditEvent(supabase, {
        actorId: adminUserId,
        actorEmail: adminEmail,
        organizationAlias: workspaceAlias,
        entityType: "workspace",
        entityId: workspaceAlias,
        action: activeApps.inventory === false ? "deactivate_inventory_access" : "reactivate_inventory_access",
        beforeData: { activeApps: before?.activeApps || {} },
        afterData: { activeApps: updatePayload.activeApps },
        reason,
      });
    }

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
    const { adminUserId, adminEmail, reason } = await req.json().catch(() => ({}));

    const { data: before } = await supabase
      .from("organization")
      .select("organizationName, organizationAlias, activeApps")
      .eq("organizationAlias", workspaceAlias)
      .maybeSingle();

    const { error } = await supabase
      .from("organization")
      .delete()
      .eq("organizationAlias", workspaceAlias);

    if (error) throw error;

    await logAuditEvent(supabase, {
      actorId: adminUserId,
      actorEmail: adminEmail,
      organizationAlias: workspaceAlias,
      entityType: "workspace",
      entityId: workspaceAlias,
      action: "delete_workspace",
      beforeData: before,
      afterData: null,
      reason,
    });

    return NextResponse.json({ data: { workspaceAlias } }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
