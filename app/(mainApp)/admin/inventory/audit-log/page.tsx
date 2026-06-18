"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Pagination } from "@/hooks/services/request";
import {
  useFetchInventoryAuditLog,
  InventoryAuditLogEntry,
} from "@/queries/InventoryAuditLog.queries";
import { InitialsAvatar } from "../workspaces/_components/WorkspacesCommon";

const actionStyles: Record<string, string> = {
  delete_workspace: "bg-rose-50 text-rose-700 border-rose-100",
  deactivate_inventory_access: "bg-rose-50 text-rose-700 border-rose-100",
  reactivate_inventory_access: "bg-emerald-50 text-emerald-700 border-emerald-100",
  update_subscription: "bg-indigo-50 text-indigo-700 border-indigo-100",
  approve_verification: "bg-emerald-50 text-emerald-700 border-emerald-100",
  reject_verification: "bg-rose-50 text-rose-700 border-rose-100",
};

const ActionBadge = ({ action }: { action: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "font-medium capitalize",
      actionStyles[action] || "bg-slate-50 text-slate-500 border-slate-100",
    )}
  >
    {action?.replace(/_/g, " ") || "—"}
  </Badge>
);

const columns: ColumnDef<InventoryAuditLogEntry>[] = [
  {
    accessorKey: "created_at",
    id: "created_at",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Date</span>,
    cell: ({ row }) => (
      <span className="text-sm text-slate-500">
        {row.original.created_at ? new Date(row.original.created_at).toLocaleString() : "—"}
      </span>
    ),
  },
  {
    accessorKey: "organizationName",
    id: "organizationName",
    // @ts-ignore
    meta: { width: "1.8fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Workspace</span>,
    cell: ({ row }) => {
      const e = row.original;
      if (!e.organizationAlias) return <span className="text-sm text-slate-400">—</span>;
      return (
        <div className="flex items-center gap-3">
          {e.organizationLogo ? (
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={e.organizationLogo} alt={e.organizationName || ""} className="object-cover" />
              <AvatarFallback className="rounded-lg bg-slate-100 text-slate-400" />
            </Avatar>
          ) : (
            <InitialsAvatar name={e.organizationName || e.organizationAlias} />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">{e.organizationName}</span>
            <span className="text-[11px] font-mono text-slate-400">{e.organizationAlias}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    id: "action",
    // @ts-ignore
    meta: { width: "1.5fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Action</span>,
    cell: ({ row }) => <ActionBadge action={row.original.action} />,
  },
  {
    accessorKey: "entityType",
    id: "entityType",
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Entity</span>,
    cell: ({ row }) => <span className="text-sm text-slate-600 capitalize">{row.original.entityType || "—"}</span>,
  },
  {
    accessorKey: "actorEmail",
    id: "actorEmail",
    // @ts-ignore
    meta: { width: "1.6fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Actor</span>,
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.actorEmail || "—"}</span>,
  },
  {
    accessorKey: "reason",
    id: "reason",
    // @ts-ignore
    meta: { width: "1.8fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Reason</span>,
    cell: ({ row }) => (
      <span className="text-sm text-slate-500 line-clamp-2">{row.original.reason || "—"}</span>
    ),
  },
];

const ACTION_OPTIONS = [
  "delete_workspace",
  "deactivate_inventory_access",
  "reactivate_inventory_access",
  "update_subscription",
  "approve_verification",
  "reject_verification",
];

const ENTITY_TYPE_OPTIONS = ["workspace", "subscription", "verification"];

function toCsv(rows: InventoryAuditLogEntry[]) {
  const headers = [
    "Date",
    "Workspace",
    "Organization Alias",
    "Action",
    "Entity Type",
    "Entity ID",
    "Actor Email",
    "Reason",
    "Before",
    "After",
  ];

  const escape = (value: any) => {
    const str = value == null ? "" : String(value);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const lines = rows.map((r) =>
    [
      r.created_at ? new Date(r.created_at).toISOString() : "",
      r.organizationName || "",
      r.organizationAlias || "",
      r.action || "",
      r.entityType || "",
      r.entityId || "",
      r.actorEmail || "",
      r.reason || "",
      r.beforeData ? JSON.stringify(r.beforeData) : "",
      r.afterData ? JSON.stringify(r.afterData) : "",
    ]
      .map(escape)
      .join(","),
  );

  return [headers.map(escape).join(","), ...lines].join("\n");
}

export default function InventoryAuditLogPage() {
  const router = useRouter();
  const [actorEmail, setActorEmail] = useState("");
  const [action, setAction] = useState("all");
  const [entityType, setEntityType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [actorEmail, action, entityType, startDate, endDate]);

  const filters = {
    actorEmail: actorEmail || undefined,
    action: action === "all" ? undefined : action,
    entityType: entityType === "all" ? undefined : entityType,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  };

  const { data, isFetching } = useFetchInventoryAuditLog({
    ...pagination,
    ...filters,
  });

  const handleExport = () => {
    const csv = toCsv(data.data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Audit Log</h3>
              <p className="text-sm text-slate-500">
                Record of admin-initiated changes to tenant inventory data
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <DownloadSimpleIcon className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by actor email..."
              value={actorEmail}
              onChange={(e) => setActorEmail(e.target.value)}
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Entity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {ENTITY_TYPE_OPTIONS.map((e) => (
                  <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger className="w-full md:w-56"><SelectValue placeholder="Action" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {ACTION_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a} className="capitalize">{a.replace(/_/g, " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="min-h-[400px]">
          <DataTable
            columns={columns}
            data={data.data}
            isFetching={isFetching}
            currentPage={pagination.page}
            setCurrentPage={(page) => setPagination({ ...pagination, page })}
            limit={pagination.limit}
            totalDocs={data.total}
            onClick={(row: any) =>
              row.organizationAlias && router.push(`/admin/inventory/workspaces/${row.organizationAlias}`)
            }
          />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <TablePagination
            total={data.total}
            page={data.page}
            limit={data.limit}
            totalPages={data.totalPages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
          />
        </div>
      </div>
    </div>
  );
}
