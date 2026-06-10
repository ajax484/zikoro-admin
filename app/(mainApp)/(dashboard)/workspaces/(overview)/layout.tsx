"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "@phosphor-icons/react";
import { useFetchWorkspaces } from "@/queries/Workspaces.queries";
import useUserStore from "@/store/globalUserStore";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import Link from "next/link";

export default function WorkspacesUsageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore();
  
  const { data: workspacesData, refetch } = useFetchWorkspaces(user?.id || "", { page: 1, limit: 100 });

  const activeTab = pathname === "/workspaces" ? "usage" : pathname.split("/").pop() || "usage";

  const handleExport = () => {
    if (!workspacesData?.data || workspacesData.data.length === 0) {
      toast.info("No data available to export");
      return;
    }

    const exportData = workspacesData.data.map((ws: any) => ({
      "Workspace Name": ws.organizationName,
      "Contact Email": ws.userEmail,
      "Owner Email": ws.organizationOwner || "N/A",
      "Products Count": ws.productsCount || 0,
      "Orders Count": ws.ordersCount || 0,
      "Customers Count": ws.customersCount || 0,
      "Team Size": ws.usersCount || 0,
      "Total Revenue": ws.totalRevenue || 0,
      Status: ws.status ? "ACTIVE" : "INACTIVE",
      "Created Date": format(new Date(ws.created_at), "MMM dd, yyyy"),
      Plan: ws.subscriptionPlan || "FREE",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Workspaces Stats");
    XLSX.writeFile(workbook, `workspaces_stats_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    
    toast.success("Stats exported to Excel successfully");
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto min-h-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Workspaces</h1>
          <p className="text-slate-500 mt-1">Manage and monitor every organization on the platform.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="shadow-sm" onClick={handleExport}>
            <DownloadIcon weight="bold" className="mr-2 h-4 w-4" /> Export Stats
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
