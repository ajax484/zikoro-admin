-- Audit log for admin-initiated mutations against tenant inventory data
-- (PRD §7: Permissions & Audit Model)

CREATE TABLE IF NOT EXISTS "inventoryAuditLog" (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    "actorId" BIGINT,
    "actorEmail" TEXT,
    "organizationAlias" TEXT,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    action TEXT NOT NULL,
    "beforeData" JSONB,
    "afterData" JSONB,
    reason TEXT
);

CREATE INDEX IF NOT EXISTS "inventoryAuditLog_organizationAlias_idx" ON "inventoryAuditLog" ("organizationAlias");
CREATE INDEX IF NOT EXISTS "inventoryAuditLog_created_at_idx" ON "inventoryAuditLog" (created_at);
CREATE INDEX IF NOT EXISTS "inventoryAuditLog_entityType_idx" ON "inventoryAuditLog" ("entityType");

-- Retention: entries are kept for 2 weeks. Run periodically (e.g. via pg_cron
-- or a scheduled admin job) to purge older rows:
--   DELETE FROM "inventoryAuditLog" WHERE created_at < now() - INTERVAL '14 days';
