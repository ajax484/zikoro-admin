"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  LightningIcon,
} from "@phosphor-icons/react";
import useUserStore from "@/store/globalUserStore";
import { useRouter, useSearchParams } from "next/navigation";
import { GlobalFilterSidebar } from "@/components/shared/filters/GlobalFilterSidebar";
import { FilterConfig } from "@/types/filters";
import {
  useFetchWorkspacesStats,
  useFetchInventoryWorkspaces,
} from "@/queries/Workspaces.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { workspacesColumnsFn } from "../_components/WorkspacesColumns";
import { Pagination } from "@/hooks/services/request";
import { SortingState } from "@tanstack/react-table";

const UsageSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-none shadow-sm">
          <CardContent className="p-6">
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="border-none shadow-sm">
      <div className="p-6">
        <Skeleton className="h-8 w-1/3" />
      </div>
      <CardContent>
        <Skeleton className="h-[400px] w-full" />
      </CardContent>
    </Card>
  </div>
);

export default function InventoryWorkspacesPage() {
  const { user } = useUserStore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
  });

  const searchParams = useSearchParams();
  const filterStatus = searchParams.get("status") || "";
  const filterPlan = searchParams.get("subscriptionPlan") || "";
  const dateStart = searchParams.get("created_at_start") || "";
  const dateEnd = searchParams.get("created_at_end") || "";

  const filterConfigs: FilterConfig[] = [
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      id: "subscriptionPlan",
      label: "Subscription Plan",
      type: "select",
      options: [
        { label: "Free", value: "Free" },
        { label: "Standard", value: "Standard" },
        { label: "Pro", value: "Pro" },
        { label: "Plus", value: "Plus" },
        { label: "Enterprise", value: "Enterprise" },
      ],
    },
    {
      id: "created_at",
      label: "Created Date",
      type: "date-range",
    },
  ];

  const { data: statsData, status: statsStatus } = useFetchWorkspacesStats();

  const {
    data: workspacesData,
    isFetching: isFetchingWorkspaces,
    status: workspacesStatus,
  } = useFetchInventoryWorkspaces(user?.id!, {
    ...pagination,
    search: searchTerm,
    status: filterStatus,
    plan: filterPlan,
    dateStart,
    dateEnd,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    order: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchTerm]);

  const sortedWorkspaces = workspacesData?.data || [];

  const columns = useMemo(
    () => workspacesColumnsFn(workspacesData?.total || 0),
    [workspacesData?.total],
  );

  if (statsStatus === "pending") return <UsageSkeleton />;

  const stats = [
    {
      label: "Active Workspaces",
      value: statsData?.totalWorkspaces,
      icon: BriefcaseIcon,
      tooltip: "*accessed in the last 7 days.",
    },
    {
      label: "Active Users",
      value: statsData?.totalUsers,
      icon: UsersIcon,
    },
    {
      label: "Total Orders",
      value: statsData?.totalOrders,
      icon: LightningIcon,
    },
    {
      label: "Total Purchase Orders",
      value: statsData?.totalPurchaseOrders,
      icon: CurrencyDollarIcon,
    },
  ];

  console.log(statsData);
  console.log(stats);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="border-none shadow-sm bg-white/50 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  {stat.tooltip && (
                    <p className="text-[11px] text-slate-400 mt-2 max-w-[200px]">
                      {stat.tooltip}
                    </p>
                  )}
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <stat.icon
                    weight="bold"
                    className="w-5 h-5 text-indigo-600"
                  />
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
            <p className="text-sm text-slate-500">
              Monitor usage and engagement across the entire platform
            </p>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-400"
            />
            <GlobalFilterSidebar configs={filterConfigs} />
          </div>
        </div>

        <div className="min-h-[400px]">
          <DataTable
            columns={columns}
            data={sortedWorkspaces}
            isFetching={isFetchingWorkspaces}
            currentPage={pagination.page}
            setCurrentPage={(page) => setPagination({ ...pagination, page })}
            limit={pagination.limit || 10}
            totalDocs={workspacesData?.total || 0}
            onClick={(row: any) =>
              // Updated to /admin/inventory/workspaces/:alias
              router.push(
                `/admin/inventory/workspaces/${row.organizationAlias}`,
              )
            }
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <TablePagination
            total={workspacesData?.total || 0}
            page={workspacesData.page}
            limit={workspacesData.limit || 10}
            totalPages={workspacesData?.totalPages || 1}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onLimitChange={(limit) =>
              setPagination({ ...pagination, limit, page: 1 })
            }
          />
        </div>
      </div>
    </div>
  );
}
