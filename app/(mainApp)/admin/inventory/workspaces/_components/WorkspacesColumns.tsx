import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircleIcon, BellIcon } from "@phosphor-icons/react";
import { abbreviateNumber } from "@/utils/helpers";
import { cn } from "@/lib/utils";

export const workspacesColumnsFn: (
  totalWorkspaces: number
) => ColumnDef<any>[] = (totalWorkspaces: number) => [
  {
    id: "select",
    // @ts-ignore
    meta: { width: "50px" },
    header: ({ table }: { table: any }) => (
      <div className="pl-2">
        <Checkbox
          className="data-[state=checked]:bg-basePrimary"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }: { row: any }) => (
      <div onClick={(e) => e.stopPropagation()} className="pl-2">
        <Checkbox
          className="data-[state=checked]:bg-basePrimary"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "organizationName",
    id: "organizationName",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "2fr" },
    header: () => (
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-semibold text-base uppercase">Workspace</span>
        <span className="font-semibold bg-basePrimary/20 text-basePrimary rounded-2xl text-[10px] px-2 py-0.5 flex items-center justify-center">
          {abbreviateNumber(totalWorkspaces)}
        </span>
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      const name = row.original.organizationName;
      const email = row.original.userEmail;
      const alias = row.original.organizationAlias;
      const initials = name?.split(" ").map((w: any) => w[0]).join("").slice(0, 2).toUpperCase() || "WS";

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            {/* Updated to /admin/inventory/workspaces/:alias */}
            <Link
              href={`/admin/inventory/workspaces/${alias}`}
              className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
            >
              {name}
            </Link>
            <span className="text-[11px] text-slate-400">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "productsCount",
    id: "productsCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base">PRODUCTS</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.productsCount}</span>,
  },
  {
    accessorKey: "ordersCount",
    id: "ordersCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Orders</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.ordersCount?.toLocaleString()}</span>,
  },
  {
    accessorKey: "customersCount",
    id: "customersCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Customers</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.customersCount?.toLocaleString()}</span>,
  },
  {
    accessorKey: "usersCount",
    id: "usersCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Team</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.usersCount}</span>,
  },
  {
    accessorKey: "status",
    id: "status",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Status</span>,
    cell: ({ row }: { row: any }) => {
      const activeApps = row.original.activeApps;
      let isActive = false;
      if (activeApps?.lastLogInInventory) {
        const lastLogin = new Date(activeApps.lastLogInInventory).getTime();
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        isActive = lastLogin >= sevenDaysAgo;
      }
      
      return (
        <Badge
          variant="outline"
          className={cn(
            "font-bold uppercase text-[10px]",
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-red-50 text-red-700 border-red-100",
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    id: "created_at",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Created</span>,
    cell: ({ row }: { row: any }) => (
      <span className="text-slate-400 text-xs">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
];
