"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Pagination } from "@/hooks/services/request";
import { useFetchInventoryTransactions, InventoryTransaction } from "@/queries/InventoryTransactions.queries";
import { useFetchSubscriptionPricing } from "@/queries/SubscriptionPricing.queries";
import { PlanBadge, InitialsAvatar } from "../workspaces/_components/WorkspacesCommon";
import { GlobalFilterSidebar } from "@/components/shared/filters/GlobalFilterSidebar";
import { FilterConfig } from "@/types/filters";

const statusStyles: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  failed: "bg-rose-50 text-rose-700 border-rose-100",
};

const StatusPill = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "font-medium capitalize",
      statusStyles[status?.toLowerCase()] || "bg-slate-50 text-slate-500 border-slate-100",
    )}
  >
    {status || "—"}
  </Badge>
);

const columns: ColumnDef<InventoryTransaction>[] = [
  {
    accessorKey: "organizationName",
    id: "organizationName",
    // @ts-ignore
    meta: { width: "2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Workspace</span>,
    cell: ({ row }) => {
      const t = row.original;
      return (
        <div className="flex items-center gap-3">
          {t.organizationLogo ? (
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={t.organizationLogo} alt={t.organizationName} className="object-cover" />
              <AvatarFallback className="rounded-lg bg-slate-100 text-slate-400" />
            </Avatar>
          ) : (
            <InitialsAvatar name={t.organizationName} />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">{t.organizationName}</span>
            <span className="text-[11px] font-mono text-slate-400">{t.organizationAlias}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionReference",
    id: "transactionReference",
    // @ts-ignore
    meta: { width: "1.6fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Reference</span>,
    cell: ({ row }) => <span className="text-xs font-mono text-slate-500">{row.original.transactionReference || "—"}</span>,
  },
  {
    accessorKey: "planName",
    id: "planName",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Plan</span>,
    cell: ({ row }) => <PlanBadge plan={row.original.planName || "Free"} />,
  },
  {
    accessorKey: "amount",
    id: "amount",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Amount</span>,
    cell: ({ row }) => {
      const t = row.original;
      return (
        <span className="text-sm font-bold text-slate-900">
          {t.amount != null ? `${t.currency || ""} ${Number(t.amount).toLocaleString()}` : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    id: "paymentMethod",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Method</span>,
    cell: ({ row }) => <span className="text-sm text-slate-600 capitalize">{row.original.paymentMethod?.replace(/_/g, " ") || "—"}</span>,
  },
  {
    accessorKey: "status",
    id: "status",
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Status</span>,
    cell: ({ row }) => <StatusPill status={row.original.status} />,
  },
  {
    accessorKey: "paidAt",
    id: "paidAt",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Date</span>,
    cell: ({ row }) => {
      const t = row.original;
      const date = t.paidAt || t.created_at;
      return <span className="text-sm text-slate-500">{date ? new Date(date).toLocaleDateString() : "—"}</span>;
    },
  },
];

export default function InventoryTransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const plan = searchParams.get("plan") || "all";
  const startDate = searchParams.get("date_start") || "";
  const endDate = searchParams.get("date_end") || "";

  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [search, status, plan, startDate, endDate]);

  const { data, isFetching } = useFetchInventoryTransactions({
    ...pagination,
    search,
    status: status === "all" ? undefined : status,
    plan: plan === "all" ? undefined : plan,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { data: pricingPlans } = useFetchSubscriptionPricing("Inventory");
  const planOptions = Array.from(new Set(pricingPlans.map((p) => p.plan).filter((p): p is string => !!p)));

  const filterConfigs: FilterConfig[] = [
    {
      id: "search",
      label: "Search",
      type: "text",
      placeholder: "Search by workspace or reference...",
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "success", label: "Success" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      id: "plan",
      label: "Plan",
      type: "select",
      options: [
        { value: "all", label: "All Plans" },
        ...planOptions.map(p => ({ value: p, label: p })),
      ],
    },
    {
      id: "date",
      label: "Date Range",
      type: "date-range",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Transactions</h3>
            <p className="text-sm text-slate-500">
              Inventory billing and subscription transactions across all workspaces
            </p>
          </div>
          <div className="flex items-center gap-3">
            <GlobalFilterSidebar configs={filterConfigs} triggerLabel="Filter Transactions" />
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
            onClick={(row: any) => router.push(`/admin/inventory/workspaces/${row.organizationAlias}?tab=subscription`)}
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
