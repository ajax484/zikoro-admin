"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Pagination } from "@/hooks/services/request";
import {
  useFetchStockTransfers,
  useFetchStockTransferDetail,
} from "@/queries/InventoryData.queries";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  "in-transit": "bg-blue-50 text-blue-700 border-blue-100",
  in_transit: "bg-blue-50 text-blue-700 border-blue-100",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

const StatusPill = ({ status }: { status: string }) => (
  <Badge
    variant="outline"
    className={cn(
      "font-medium capitalize",
      statusStyles[status?.toLowerCase()] || "bg-slate-50 text-slate-500 border-slate-100",
    )}
  >
    {status?.replace(/_/g, " ") || "—"}
  </Badge>
);

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "transferAlias",
    id: "transferAlias",
    // @ts-ignore
    meta: { width: "1.5fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Transfer</span>,
    cell: ({ row }) => <span className="text-sm font-mono font-semibold text-slate-900">{row.original.transferAlias}</span>,
  },
  {
    accessorKey: "originLocationName",
    id: "originLocationName",
    // @ts-ignore
    meta: { width: "1.5fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">From</span>,
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.originLocationName || "—"}</span>,
  },
  {
    accessorKey: "destinationLocationName",
    id: "destinationLocationName",
    // @ts-ignore
    meta: { width: "1.5fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">To</span>,
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.destinationLocationName || "—"}</span>,
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
    accessorKey: "assignee",
    id: "assignee",
    // @ts-ignore
    meta: { width: "1.3fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Assigned To</span>,
    cell: ({ row }) => {
      const a = row.original.assignee;
      return <span className="text-sm text-slate-600">{a ? `${a.firstName || ""} ${a.lastName || ""}`.trim() || a.userEmail : "—"}</span>;
    },
  },
  {
    accessorKey: "created_at",
    id: "created_at",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Created</span>,
    cell: ({ row }) => <span className="text-sm text-slate-500">{new Date(row.original.created_at).toLocaleDateString()}</span>,
  },
];

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-900 text-right">{value ?? "—"}</span>
  </div>
);

const userLabel = (u: any) => (u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.userEmail : "—");

const TransferDetailSheet = ({
  workspaceAlias,
  transferAlias,
  onClose,
}: {
  workspaceAlias: string;
  transferAlias: string | null;
  onClose: () => void;
}) => {
  const { data, isFetching } = useFetchStockTransferDetail(workspaceAlias, transferAlias || undefined);
  const transfer = data.transfer;

  return (
    <Sheet open={!!transferAlias} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        {isFetching || !transfer ? (
          <div className="space-y-4 pt-8">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-lg font-bold font-mono">{transfer.transferAlias}</SheetTitle>
              <SheetDescription>
                <StatusPill status={transfer.status} />
              </SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="bg-transparent h-auto p-0 gap-6 border-b border-slate-200 w-full justify-start rounded-none">
                {["Overview", "Products"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase()}
                    className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-400 data-[state=active]:text-indigo-600 transition-all uppercase tracking-wider text-[11px]"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-1">
                <InfoRow label="Origin" value={transfer.originLocationName} />
                <InfoRow label="Destination" value={transfer.destinationLocationName} />
                <InfoRow label="Status" value={<StatusPill status={transfer.status} />} />
                <InfoRow label="Created By" value={userLabel(transfer.creator)} />
                <InfoRow label="Assigned To" value={userLabel(transfer.assignee)} />
                <InfoRow label="Received By" value={userLabel(transfer.receiver)} />
                <InfoRow label="Created" value={new Date(transfer.created_at).toLocaleString()} />
                {transfer.notes && <InfoRow label="Notes" value={transfer.notes} />}
              </TabsContent>

              <TabsContent value="products" className="mt-4 space-y-2">
                {data.items.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No items recorded for this transfer.</p>
                ) : (
                  data.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{item.product?.productName || item.productAlias}</span>
                        <span className="text-[11px] font-mono text-slate-400">{item.product?.sku || "—"}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.qty}</span>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export const TransfersPanel = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [status, setStatus] = useState("all");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });
  const [selectedTransfer, setSelectedTransfer] = useState<string | null>(null);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [status]);

  const { data, isFetching } = useFetchStockTransfers(workspaceAlias, {
    ...pagination,
    status: status === "all" ? undefined : status,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={data.data}
            isFetching={isFetching}
            currentPage={pagination.page}
            setCurrentPage={(page) => setPagination({ ...pagination, page })}
            limit={pagination.limit}
            totalDocs={data.total}
            onClick={(row: any) => setSelectedTransfer(row.transferAlias)}
          />
          <div className="p-4 border-t border-slate-50 bg-slate-50/30">
            <TablePagination
              total={data.total}
              page={data.page}
              limit={data.limit}
              totalPages={data.totalPages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
            />
          </div>
        </CardContent>
      </Card>

      <TransferDetailSheet
        workspaceAlias={workspaceAlias}
        transferAlias={selectedTransfer}
        onClose={() => setSelectedTransfer(null)}
      />
    </div>
  );
};
