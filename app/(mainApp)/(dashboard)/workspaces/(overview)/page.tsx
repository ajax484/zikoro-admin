"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  LightningIcon,
} from "@phosphor-icons/react";
import useUserStore from "@/store/globalUserStore";
import { useRouter } from "next/navigation";
import { useFetchWorkspacesStats } from "@/queries/Workspaces.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { workspacesColumnsFn } from "../_components/WorkspacesColumns";
import { Pagination } from "@/hooks/services/request";
import { SortingState } from "@tanstack/react-table";

// --- SKELETON ---

const UsageSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-none shadow-sm"><CardContent className="p-6"><Skeleton className="h-12 w-full" /></CardContent></Card>
      ))}
    </div>
    <Card className="border-none shadow-sm">
      <div className="p-6"><Skeleton className="h-8 w-1/3" /></div>
      <CardContent><Skeleton className="h-[400px] w-full" /></CardContent>
    </Card>
  </div>
);

export default function WorkspacesUsagePage() {
  const { user } = useUserStore();
  const router = useRouter();
  
  // State for search, sorting, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });
  
  // We fetch a larger limit of workspaces in a single page to perform client-side sorting and searching
  const { data: statsData, isFetching } = useFetchWorkspacesStats(user?.id || "", { page: 1, limit: 10 });

  // Reset pagination to page 1 when search term changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  const stats = useMemo(() => {
    const workspaces = statsData.data || [];
    const totalWorkspaces = statsData.total || 0;
    const users = workspaces.reduce((acc: number, ws: any) => acc + (ws.usersCount || 0), 0);
    const orders = workspaces.reduce((acc: number, ws: any) => acc + (ws.ordersCount || 0), 0);
    const revenue = workspaces.reduce((acc: number, ws: any) => acc + (ws.totalRevenue || 0), 0);

    return [
      { label: "Total Workspaces", value: totalWorkspaces.toLocaleString(), icon: BriefcaseIcon },
      { label: "Active Users", value: users.toLocaleString(), icon: UsersIcon },
      { label: "Total Orders", value: orders.toLocaleString(), icon: LightningIcon },
      { label: "Total Revenue", value: `$${revenue.toLocaleString()}`, icon: CurrencyDollarIcon },
    ];
  }, [statsData]);

  // Client-side filtering/searching
  const filteredWorkspaces = useMemo(() => {
    const list = statsData.data || [];
    if (!searchTerm.trim()) return list;

    const term = searchTerm.toLowerCase().trim();
    return list.filter((ws: any) => {
      const name = (ws.organizationName || "").toLowerCase();
      const owner = (ws.organizationOwner || "").toLowerCase();
      const contactEmail = (ws.eventContactEmail || "").toLowerCase();
      const userEmail = (ws.userEmail || "").toLowerCase();
      const alias = (ws.organizationAlias || "").toLowerCase();

      return (
        name.includes(term) ||
        owner.includes(term) ||
        contactEmail.includes(term) ||
        userEmail.includes(term) ||
        alias.includes(term)
      );
    });
  }, [statsData.data, searchTerm]);

  // Client-side sorting for both standard and dynamic count columns
  const sortedWorkspaces = useMemo(() => {
    const list = [...filteredWorkspaces];
    if (sorting.length === 0) return list;

    const { id: sortBy, desc } = sorting[0];

    return list.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle undefined or null values
      if (valA === undefined || valA === null) valA = "";
      if (valB === undefined || valB === null) valB = "";

      // Handle string comparison (case-insensitive)
      if (typeof valA === "string" && typeof valB === "string") {
        return desc
          ? valB.localeCompare(valA)
          : valA.localeCompare(valB);
      }

      // Handle numeric/boolean or general comparison
      if (valA < valB) return desc ? 1 : -1;
      if (valA > valB) return desc ? -1 : 1;
      return 0;
    });
  }, [filteredWorkspaces, sorting]);

  // Client-side pagination slice
  const paginatedWorkspaces = useMemo(() => {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const startIndex = (page - 1) * limit;
    return sortedWorkspaces.slice(startIndex, startIndex + limit);
  }, [sortedWorkspaces, pagination.page, pagination.limit]);

  const columns = useMemo(() => workspacesColumnsFn(filteredWorkspaces.length), [filteredWorkspaces.length]);

  if (isFetching && (!statsData.data || statsData.data.length === 0)) return <UsageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <stat.icon weight="bold" className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">All Workspaces</h3>
            <p className="text-sm text-slate-500">Monitor usage and engagement across the entire platform</p>
          </div>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
        
        <div className="min-h-[400px]">
          <DataTable
            columns={columns}
            data={paginatedWorkspaces}
            isFetching={isFetching}
            currentPage={pagination.page}
            setCurrentPage={(page) => setPagination({ ...pagination, page })}
            limit={pagination.limit || 10}
            totalDocs={filteredWorkspaces.length}
            onClick={(row: any) => router.push(`/workspaces/${row.organizationAlias}`)}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <TablePagination
            total={filteredWorkspaces.length}
            page={pagination.page}
            limit={pagination.limit || 10}
            totalPages={Math.ceil(filteredWorkspaces.length / (pagination.limit || 10))}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
          />
        </div>
      </div>
    </div>
  );
}
