import React from "react";
import {
  BuildingIcon,
  CashRegisterIcon,
  IdentificationCardIcon,
  CalendarIcon,
  SquaresFourIcon,
  TagIcon,
  ClipboardTextIcon,
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
    name: "Plan Pricing",
    Icon: TagIcon,
    href: "admin/inventory/plans",
  },
  {
    name: "Transactions",
    Icon: CashRegisterIcon,
    href: "admin/inventory/transactions",
  },
  {
    name: "Audit Log",
    Icon: ClipboardTextIcon,
    href: "admin/inventory/audit-log",
  },
];

// ─── Credentials Module ─────────────────────────────────────────────────────────
export const credentialsModuleLinks: ModuleNavLink[] = [
  {
    name: "Overview",
    Icon: SquaresFourIcon,
    href: "admin/credentials",
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
