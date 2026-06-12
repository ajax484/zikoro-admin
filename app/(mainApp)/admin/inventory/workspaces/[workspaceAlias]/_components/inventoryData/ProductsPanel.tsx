"use client";

import React, { useEffect, useState } from "react";
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
import { PackageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/hooks/services/request";
import {
  useFetchInventoryProducts,
  useFetchInventoryProductDetail,
  useFetchInventoryVendors,
  useFetchInventoryCategories,
} from "@/queries/InventoryData.queries";

const columns: ColumnDef<any>[] = [
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
            <span className="text-[11px] font-mono text-slate-400">{p.sku || "—"}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "categoryName",
    id: "categoryName",
    // @ts-ignore
    meta: { width: "1.3fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Category</span>,
    cell: ({ row }) => <span className="text-sm text-slate-600 capitalize">{row.original.categoryName || "—"}</span>,
  },
  {
    accessorKey: "manufacturerName",
    id: "manufacturerName",
    // @ts-ignore
    meta: { width: "1.3fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Manufacturer</span>,
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.manufacturerName || "—"}</span>,
  },
  {
    accessorKey: "productStatusActive",
    id: "productStatusActive",
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Status</span>,
    cell: ({ row }) => {
      const active = row.original.productStatusActive !== false;
      return (
        <Badge variant="outline" className={cn("font-medium capitalize", active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-500 border-slate-100")}>
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "serialized",
    id: "serialized",
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Serialized</span>,
    cell: ({ row }) => (
      <Badge variant="outline" className={cn("font-medium", row.original.serialized ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-400 border-slate-100")}>
        {row.original.serialized ? "Yes" : "No"}
      </Badge>
    ),
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

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-900 text-right">{value ?? "—"}</span>
  </div>
);

const ProductDetailSheet = ({
  workspaceAlias,
  productAlias,
  onClose,
}: {
  workspaceAlias: string;
  productAlias: string | null;
  onClose: () => void;
}) => {
  const { data, isFetching } = useFetchInventoryProductDetail(workspaceAlias, productAlias || undefined);
  const product = data.product;

  return (
    <Sheet open={!!productAlias} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        {isFetching || !product ? (
          <div className="space-y-4 pt-8">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-lg font-bold">{product.productName}</SheetTitle>
              <SheetDescription className="font-mono text-xs">{product.sku || product.productAlias}</SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="bg-transparent h-auto p-0 gap-6 border-b border-slate-200 w-full justify-start rounded-none">
                {["Overview", "Movement History", "Product Info", "Variants"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab.toLowerCase().replace(" ", "-")}
                    className="px-0 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-400 data-[state=active]:text-indigo-600 transition-all uppercase tracking-wider text-[11px]"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-1">
                <InfoRow label="Status" value={product.productStatusActive !== false ? "Active" : "Inactive"} />
                <InfoRow label="Category" value={product.categoryName} />
                <InfoRow label="Manufacturer" value={product.manufacturerName} />
                <InfoRow label="Product Group" value={product.groupName} />
                <InfoRow label="Serialized" value={product.serialized ? "Yes" : "No"} />
                <InfoRow
                  label="Cost"
                  value={product.productCost != null ? `${product.currency || ""} ${Number(product.productCost).toLocaleString()}` : null}
                />
                <InfoRow label="Created" value={new Date(product.created_at).toLocaleDateString()} />
              </TabsContent>

              <TabsContent value="movement-history" className="mt-4 space-y-2">
                {data.ledger.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No stock movements recorded.</p>
                ) : (
                  data.ledger.map((entry: any) => (
                    <div key={entry.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 capitalize">{entry.MovementType?.replace(/_/g, " ")}</span>
                        <span className="text-[11px] text-slate-400">{entry.locationName || entry.location} • {new Date(entry.created_at).toLocaleString()}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{entry.qty}</span>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="product-info" className="mt-4 space-y-1">
                <InfoRow label="Description" value={product.description} />
                <InfoRow label="Vendor Code" value={product.vendorCode} />
                <InfoRow label="HS Code" value={product.hsCode} />
                <InfoRow label="Measuring Unit" value={product.measuringUnit} />
                <InfoRow label="Dimensions" value={product.length && product.width && product.height ? `${product.length} x ${product.width} x ${product.height} ${product.dimensionUnit || ""}` : null} />
                <InfoRow label="Weight" value={product.weight ? `${product.weight} ${product.weightUnit || ""}` : null} />
                <InfoRow label="Country of Origin" value={product.countryOfOrigin} />
                <InfoRow label="Returnable" value={product.returnableItem ? "Yes" : "No"} />
              </TabsContent>

              <TabsContent value="variants" className="mt-4 space-y-2">
                {data.variants.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No other variants in this product group.</p>
                ) : (
                  data.variants.map((v: any) => (
                    <div key={v.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{v.productName}</span>
                        <span className="text-[11px] font-mono text-slate-400">{v.sku || v.productAlias}</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {v.variantAttributes ? Object.entries(v.variantAttributes).map(([k, val]) => `${k}: ${val}`).join(", ") : "—"}
                      </span>
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

export const ProductsPanel = ({
  workspaceAlias,
  initialProductAlias,
}: {
  workspaceAlias: string;
  initialProductAlias?: string | null;
}) => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [serialized, setSerialized] = useState("all");
  const [category, setCategory] = useState("all");
  const [manufacturer, setManufacturer] = useState("all");
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });
  const [selectedProduct, setSelectedProduct] = useState<string | null>(initialProductAlias || null);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [search, status, serialized, category, manufacturer]);

  const { data, isFetching } = useFetchInventoryProducts(workspaceAlias, {
    ...pagination,
    search,
    status: status === "all" ? undefined : status,
    serialized: serialized === "all" ? undefined : serialized,
    category: category === "all" ? undefined : category,
    manufacturer: manufacturer === "all" ? undefined : manufacturer,
  });

  const { data: categoriesData } = useFetchInventoryCategories(workspaceAlias);
  const { data: vendorsData } = useFetchInventoryVendors(workspaceAlias, { page: 1, limit: 100 });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, SKU, or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={serialized} onValueChange={setSerialized}>
          <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Serialized" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Serialized: All</SelectItem>
            <SelectItem value="true">Serialized Only</SelectItem>
            <SelectItem value="false">Non-Serialized</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoriesData.data.map((c: any) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.categoryName}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={manufacturer} onValueChange={setManufacturer}>
          <SelectTrigger className="w-full md:w-44"><SelectValue placeholder="Manufacturer" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {vendorsData.data.map((m: any) => (
              <SelectItem key={m.manufacturerAlias} value={m.manufacturerAlias}>{m.name}</SelectItem>
            ))}
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
            onClick={(row: any) => setSelectedProduct(row.productAlias)}
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

      <ProductDetailSheet
        workspaceAlias={workspaceAlias}
        productAlias={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};
