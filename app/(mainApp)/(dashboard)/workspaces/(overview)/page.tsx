"use client";

import React, { useState, useMemo } from "react";
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
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });
  
  const { data: statsData, isFetching } = useFetchWorkspacesStats(user?.id || "", pagination);

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

  const columns = useMemo(() => workspacesColumnsFn(statsData.total), [statsData.total]);

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
        </div>
        
        <div className="min-h-[400px]">
          <DataTable
            columns={columns}
            data={statsData.data}
            isFetching={isFetching}
            currentPage={pagination.page}
            setCurrentPage={(page) => setPagination({ ...pagination, page })}
            limit={pagination.limit || 10}
            totalDocs={statsData.total}
            onClick={(row: any) => router.push(`/workspaces/${row.organizationAlias}`)}
          />
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <TablePagination
            total={statsData.total}
            page={pagination.page}
            limit={pagination.limit || 10}
            totalPages={statsData.totalPages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
          />
        </div>
      </div>
    </div>
  );
}
