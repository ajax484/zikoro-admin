import React from "react";
import {
  BuildingIcon,
  CashRegisterIcon,
  IdentificationCardIcon,
  CalendarIcon,
  SquaresFourIcon,
  ArchiveBoxIcon,
} from "@phosphor-icons/react/dist/ssr";

export type ModuleNavLink = {
  name: string;
  href: string;
  Icon: React.ElementType;
};

// ─── Inventory Module ─────────────────────────────────────────────────────────
export const inventoryLinks: ModuleNavLink[] = [
  {
    name: "Workspaces",
    Icon: BuildingIcon,
    href: "admin/inventory/workspaces",
  },
  {
    name: "Transactions",
    Icon: CashRegisterIcon,
    href: "admin/inventory/transactions",
  },
  {
    name: "Verify",
    Icon: IdentificationCardIcon,
    href: "admin/inventory/verify",
  },
];

// ─── Workspace Module ─────────────────────────────────────────────────────────
export const workspaceModuleLinks: ModuleNavLink[] = [
  {
    name: "Overview",
    Icon: SquaresFourIcon,
    href: "admin/workspace",
  },
];

// ─── Events Module ────────────────────────────────────────────────────────────
export const eventsModuleLinks: ModuleNavLink[] = [
  {
    name: "Events",
    Icon: CalendarIcon,
    href: "admin/events",
  },
];
