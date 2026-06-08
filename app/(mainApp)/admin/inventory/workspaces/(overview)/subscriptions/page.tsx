"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUserStore from "@/store/globalUserStore";
import { useFetchWorkspacesStats } from "@/queries/Workspaces.queries";
import { Pagination } from "@/hooks/services/request";
import { StatusBadge, PlanBadge, InitialsAvatar } from "../../_components/WorkspacesCommon";
import { TablePagination } from "@/components/shared/TablePagination";

export default function WorkspacesSubscriptionsPage() {
  const { user } = useUserStore();
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });

  const { data: statsData, isFetching } = useFetchWorkspacesStats(user?.id || "", pagination);

  const workspaces = statsData.data || [];

  if (isFetching && workspaces.length === 0)
    return <div className="p-10 text-center text-slate-400">Loading subscriptions...</div>;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Subscription Management</CardTitle>
          <CardDescription>Monitor billing cycles and plans across all platform organizations</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[250px] pl-6">Workspace</TableHead>
                <TableHead>Current Plan</TableHead>
                <TableHead>Next Renewal</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((ws: any) => (
                <TableRow key={ws.organizationAlias}>
                  <TableCell className="font-medium pl-6">
                    <div className="flex items-center gap-3">
                      <InitialsAvatar name={ws.organizationName} />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{ws.organizationName}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><PlanBadge plan={ws.subscriptionPlan} /></TableCell>
                  <TableCell className="text-slate-600 text-sm">
                    {ws.subscriptionExpiryDate ? new Date(ws.subscriptionExpiryDate).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">
                    {ws.totalRevenue > 0 ? `$${ws.totalRevenue.toLocaleString()}` : "$0.00"}
                  </TableCell>
                  <TableCell><StatusBadge status={ws.status} /></TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm">Settings</Button>
                  </TableCell>
                </TableRow>
              ))}
              {workspaces.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="p-4 border-t border-slate-50 bg-slate-50/30">
            <TablePagination
              total={statsData.total}
              page={pagination.page}
              limit={pagination.limit || 10}
              totalPages={statsData.totalPages}
              onPageChange={(page) => setPagination({ ...pagination, page })}
              onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
