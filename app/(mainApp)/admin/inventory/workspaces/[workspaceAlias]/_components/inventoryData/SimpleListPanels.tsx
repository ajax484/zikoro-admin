"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/shared/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Pagination } from "@/hooks/services/request";
import {
  useFetchInventoryLocations,
  useFetchStockAdjustments,
  useFetchMovementLedger,
  useFetchInventoryVendors,
} from "@/queries/InventoryData.queries";

const Th = ({ children }: { children: React.ReactNode }) => (
  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{children}</TableHead>
);

const EmptyRow = ({ colSpan, label }: { colSpan: number; label: string }) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="text-center text-sm text-slate-400 py-10">
      {label}
    </TableCell>
  </TableRow>
);

const LoadingRows = ({ colSpan, rows = 5 }: { colSpan: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRow key={i}>
        <TableCell colSpan={colSpan}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const userLabel = (u: any) => (u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.userEmail : "—");

export const LocationsPanel = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });

  useEffect(() => setPagination((p) => ({ ...p, page: 1 })), [search]);

  const { data, isFetching } = useFetchInventoryLocations(workspaceAlias, { ...pagination, search });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-80 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
      />
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <Th>Name</Th>
                <Th>Alias</Th>
                <Th>City</Th>
                <Th>Address</Th>
                <Th>Type</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <LoadingRows colSpan={5} />
              ) : data.data.length === 0 ? (
                <EmptyRow colSpan={5} label="No locations found." />
              ) : (
                data.data.map((loc: any) => (
                  <TableRow key={loc.id}>
                    <TableCell className="font-semibold text-slate-900">{loc.Name}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">{loc.locationAlias}</TableCell>
                    <TableCell className="text-slate-600">{loc.City || "—"}</TableCell>
                    <TableCell className="text-slate-600">{loc.Address || "—"}</TableCell>
                    <TableCell className="text-slate-600 capitalize">{loc.locationType || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
    </div>
  );
};

export const AdjustmentsPanel = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });
  const { data, isFetching } = useFetchStockAdjustments(workspaceAlias, pagination);

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <Th>Product</Th>
                <Th>Location</Th>
                <Th>Quantity</Th>
                <Th>Reason</Th>
                <Th>By</Th>
                <Th>Date</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <LoadingRows colSpan={6} />
              ) : data.data.length === 0 ? (
                <EmptyRow colSpan={6} label="No stock adjustments found." />
              ) : (
                data.data.map((adj: any) => (
                  <TableRow key={adj.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{adj.product?.productName || adj.productAlias}</span>
                        <span className="text-[11px] font-mono text-slate-400">{adj.product?.sku || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{adj.locationName || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold",
                          Number(adj.quantity) >= 0
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100",
                        )}
                      >
                        {Number(adj.quantity) >= 0 ? "+" : ""}{adj.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 capitalize">{adj.reasonName || "—"}</TableCell>
                    <TableCell className="text-slate-600">{userLabel(adj.creator)}</TableCell>
                    <TableCell className="text-slate-500">{new Date(adj.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
    </div>
  );
};

const MOVEMENT_TYPES = [
  "stock_in",
  "stock_out",
  "sale_order_picked",
  "sale_order_delivered",
  "transfer_in",
  "transfer_out",
  "adjustment",
];

export const LedgerPanel = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });
  const { data, isFetching } = useFetchMovementLedger(workspaceAlias, pagination);

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <Th>Product</Th>
                <Th>Location</Th>
                <Th>Movement</Th>
                <Th>Quantity</Th>
                <Th>Date</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <LoadingRows colSpan={5} />
              ) : data.data.length === 0 ? (
                <EmptyRow colSpan={5} label="No movement records found." />
              ) : (
                data.data.map((entry: any) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{entry.product?.productName || entry.productAlias}</span>
                        <span className="text-[11px] font-mono text-slate-400">{entry.product?.sku || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{entry.locationName || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium capitalize bg-slate-50 text-slate-600 border-slate-100">
                        {entry.MovementType?.replace(/_/g, " ") || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-700">{entry.qty}</TableCell>
                    <TableCell className="text-slate-500">{new Date(entry.created_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
    </div>
  );
};

export const VendorsPanel = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });

  useEffect(() => setPagination((p) => ({ ...p, page: 1 })), [search]);

  const { data, isFetching } = useFetchInventoryVendors(workspaceAlias, { ...pagination, search });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by name, email, or contact..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-80 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
      />
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Contact</Th>
                <Th>Alias</Th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <LoadingRows colSpan={4} />
              ) : data.data.length === 0 ? (
                <EmptyRow colSpan={4} label="No vendors or manufacturers found." />
              ) : (
                data.data.map((v: any) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-semibold text-slate-900">{v.name}</TableCell>
                    <TableCell className="text-slate-600">{v.email || "—"}</TableCell>
                    <TableCell className="text-slate-600">{v.contact || "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">{v.manufacturerAlias}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
    </div>
  );
};
