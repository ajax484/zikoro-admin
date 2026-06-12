"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MagnifyingGlassIcon, PackageIcon } from "@phosphor-icons/react";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { Pagination } from "@/hooks/services/request";
import { useSearchInventoryProducts, InventorySearchResult } from "@/queries/InventorySearch.queries";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<InventorySearchResult>[] = [
  {
    accessorKey: "productName",
    id: "productName",
    // @ts-ignore
    meta: { width: "2.5fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Product</span>,
    cell: ({ row }) => {
      const p = row.original;
      const image = p.images?.[0];
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            {image && <AvatarImage src={image} alt={p.productName} className="object-cover" />}
            <AvatarFallback className="rounded-lg bg-slate-100 text-slate-400">
              <PackageIcon weight="bold" className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">{p.productName}</span>
            {p.serialized && (
              <Badge variant="outline" className="w-fit mt-0.5 text-[10px] font-bold uppercase bg-indigo-50 text-indigo-600 border-indigo-100">
                Serialized
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    id: "sku",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">SKU</span>,
    cell: ({ row }) => <span className="text-xs font-mono text-slate-600">{row.original.sku || "—"}</span>,
  },
  {
    accessorKey: "barcode",
    id: "barcode",
    // @ts-ignore
    meta: { width: "1.2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Barcode</span>,
    cell: ({ row }) => <span className="text-xs font-mono text-slate-600">{row.original.barcode || "—"}</span>,
  },
  {
    accessorKey: "organizationName",
    id: "organizationName",
    // @ts-ignore
    meta: { width: "2fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Workspace</span>,
    cell: ({ row }) => {
      const p = row.original;
      const initials = p.organizationName?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "WS";
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-lg">
            {p.organizationLogo && <AvatarImage src={p.organizationLogo} alt={p.organizationName} className="object-cover" />}
            <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900">{p.organizationName}</span>
            <span className="text-[11px] text-slate-400">{p.organizationAlias}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "productCost",
    id: "productCost",
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Cost</span>,
    cell: ({ row }) => {
      const p = row.original;
      return (
        <span className="text-sm font-bold text-slate-900">
          {p.productCost != null ? `${p.currency || ""} ${Number(p.productCost).toLocaleString()}` : "—"}
        </span>
      );
    },
  },
];

export default function InventorySearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 350);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedTerm]);

  const { data, isFetching } = useSearchInventoryProducts(debouncedTerm, pagination);

  const handleRowClick = (row: InventorySearchResult) => {
    const params = new URLSearchParams();
    params.set("pa", row.productAlias);
    params.set("pid", String(row.id));
    if (row.productGroupAlias) params.set("ga", row.productGroupAlias);
    router.push(`/admin/inventory/workspaces/${row.organizationAlias}?${params.toString()}`);
  };

  return (
    <div className="p-6 md:p-10 max-w-[1200px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory Search</h1>
        <p className="text-slate-500 text-sm mt-1">
          Find a product by SKU, barcode, or name across every workspace
        </p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Cross-Tenant Product Search</CardTitle>
          <CardDescription>Results jump straight to the matching workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-xl">
            <MagnifyingGlassIcon
              weight="bold"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by SKU, barcode, or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          {debouncedTerm.length < 2 ? (
            <div className="py-16 flex flex-col items-center gap-2 text-center text-slate-400">
              <MagnifyingGlassIcon size={32} weight="bold" className="text-slate-300" />
              Enter at least 2 characters to search across all workspaces
            </div>
          ) : (
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="min-h-[300px]">
                <DataTable
                  columns={columns}
                  data={data.data}
                  isFetching={isFetching}
                  currentPage={pagination.page}
                  setCurrentPage={(page) => setPagination({ ...pagination, page })}
                  limit={pagination.limit}
                  totalDocs={data.total}
                  onClick={handleRowClick}
                />
              </div>
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
