import { SupabaseClient } from "@supabase/supabase-js";

export interface AuditLogEntry {
  actorId?: number | string | null;
  actorEmail?: string | null;
  organizationAlias?: string | null;
  entityType: string;
  entityId?: string | number | null;
  action: string;
  beforeData?: Record<string, any> | null;
  afterData?: Record<string, any> | null;
  reason?: string | null;
}

// Writes an entry to the inventory audit log. Failures are logged but never
// thrown, so a logging issue can't block the underlying mutation.
export async function logAuditEvent(supabase: SupabaseClient, entry: AuditLogEntry) {
  try {
    const { error } = await supabase.from("inventoryAuditLog").insert({
      actorId: entry.actorId ?? null,
      actorEmail: entry.actorEmail ?? null,
      organizationAlias: entry.organizationAlias ?? null,
      entityType: entry.entityType,
      entityId: entry.entityId != null ? String(entry.entityId) : null,
      action: entry.action,
      beforeData: entry.beforeData ?? null,
      afterData: entry.afterData ?? null,
      reason: entry.reason ?? null,
    });

    if (error) console.error("Failed to write audit log entry:", error);
  } catch (error) {
    console.error("Failed to write audit log entry:", error);
  }
}
