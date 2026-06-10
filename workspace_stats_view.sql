CREATE OR REPLACE VIEW workspace_stats_view AS
SELECT 
    o."organizationAlias",
    (SELECT COUNT(*) FROM "inventoryProducts" p WHERE p."organizationAlias" = o."organizationAlias" AND (p.deleted IS NULL OR p.deleted = false)) AS "productsCount",
    (SELECT COUNT(*) FROM "salesOrder" s WHERE s."organizationAlias" = o."organizationAlias") AS "ordersCount",
    (SELECT COUNT(*) FROM "customerOrganization" c WHERE c."workspaceAlias" = o."organizationAlias") AS "customersCount",
    (SELECT COUNT(*) FROM "organizationTeamMembers" t WHERE t."workspaceAlias" = o."organizationAlias") AS "usersCount",
    (SELECT COUNT(*) FROM "inventoryPurchaseOrder" po WHERE po."organizationAlias" = o."organizationAlias") AS "purchaseOrdersCount",
    (SELECT COALESCE(SUM(s."totalValue"), 0) FROM "salesOrder" s WHERE s."organizationAlias" = o."organizationAlias") AS "totalRevenue"
FROM organization o;
