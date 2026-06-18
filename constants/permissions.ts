// Permission keys for the admin Inventory module (PRD §7: Permissions & Audit Model)
// Follows the `permissionKey` pattern used by the tenant app's roles/permissions system.

export const INVENTORY_PERMISSIONS = {
  READ: "inventory:read",
  WRITE: "inventory:write",
  OPERATIONS: "inventory:operations",
  VERIFY: "inventory:verify",
  BILLING: "inventory:billing",
} as const;

export type InventoryPermissionKey =
  (typeof INVENTORY_PERMISSIONS)[keyof typeof INVENTORY_PERMISSIONS];
