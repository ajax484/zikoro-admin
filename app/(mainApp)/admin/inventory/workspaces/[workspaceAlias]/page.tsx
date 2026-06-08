"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CaretLeft,
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  LightningIcon,
  CheckCircleIcon,
  GlobeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  IdentificationCardIcon,
  FileTextIcon,
  PackageIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import useUserStore from "@/store/globalUserStore";
import {
  useFetchWorkspacesStats,
  useFetchWorkspaceTeamMembers,
  useFetchWorkspaceSubscription,
} from "@/queries/Workspaces.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/hooks/services/request";

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
  <Card className="border-none shadow-sm bg-white">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", colorClass)}>
          <Icon weight="bold" className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- TABS ---

const OverviewTab = ({ workspace }: { workspace: any }) => {
  const info = [
    { label: "Organization Alias", value: workspace.organizationAlias, icon: GlobeIcon },
    { label: "Phone Number", value: workspace.eventPhoneNumber || "N/A", icon: PhoneIcon },
    { label: "Owner Email", value: workspace.organizationOwner || workspace.userEmail, icon: ShieldCheckIcon },
    { label: "Date Created", value: new Date(workspace.created_at).toLocaleDateString(), icon: ClockIcon },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">General Information</CardTitle>
            <CardDescription>Basic details about this organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {info.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-500">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Verification Status</CardTitle>
            <CardDescription>Security and compliance checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { label: "Email Verified", status: true, icon: PhoneIcon },
                { label: "Identity Verified", status: workspace.verification?.length > 0, icon: IdentificationCardIcon },
                { label: "Business Documents", status: false, icon: FileTextIcon },
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", step.status ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-300")}>
                      <step.icon size={18} weight="bold" />
                    </div>
                    <span className={cn("text-sm font-medium", step.status ? "text-slate-900" : "text-slate-400")}>
                      {step.label}
                    </span>
                  </div>
                  {step.status ? (
                    <CheckCircleIcon weight="bold" className="text-emerald-500 w-5 h-5" />
                  ) : (
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full text-xs h-9">Manage Compliance</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TeamTab = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const { data: teamData, isFetching } = useFetchWorkspaceTeamMembers(workspaceAlias, pagination);

  const columns = [
    {
      accessorKey: "user",
      header: "Member",
      cell: ({ row }: any) => {
        const member = row.original;
        const name = member.user ? `${member.user.firstName} ${member.user.lastName}` : member.userEmail;
        const initials = name?.split(" ").map((n: any) => n[0]).join("").toUpperCase().slice(0, 2);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">{name}</span>
              <span className="text-xs text-slate-500">{member.userEmail}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "userRole",
      header: "Role",
      cell: ({ row }: any) => (
        <Badge variant="outline" className="capitalize bg-slate-50 border-slate-100 text-slate-600">
          {row.original.userRole}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge className={cn("capitalize", row.original.status === "accepted" ? "bg-emerald-500" : "bg-amber-500")}>
          {row.original.status || "Pending"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined Date",
      cell: ({ row }: any) => (
        <span className="text-xs text-slate-400">{new Date(row.original.created_at).toLocaleDateString()}</span>
      ),
    },
  ];

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Team Members</CardTitle>
          <CardDescription>Manage user access and roles for this workspace</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={teamData.data || []}
          isFetching={isFetching}
          currentPage={pagination.page}
          setCurrentPage={(page) => setPagination({ ...pagination, page })}
          limit={pagination.limit}
          totalDocs={teamData.total}
        />
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <TablePagination
            total={teamData.total}
            page={pagination.page}
            limit={pagination.limit}
            totalPages={teamData.totalPages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
            onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const getSubscriptionStatus = (sub: any): { label: string; color: string } => {
  if (!sub) return { label: "No Plan", color: "bg-slate-100 text-slate-500" };
  if (sub.cancelledAt) return { label: "Cancelled", color: "bg-red-100 text-red-700" };
  const now = new Date();
  if (sub.trialExpiryDate && new Date(sub.trialExpiryDate) > now) return { label: "Trial", color: "bg-blue-100 text-blue-700" };
  if (sub.subscriptionEndDate && new Date(sub.subscriptionEndDate) < now) return { label: "Expired", color: "bg-amber-100 text-amber-700" };
  if (sub.subscriptionEndDate && new Date(sub.subscriptionEndDate) > now) return { label: "Active", color: "bg-emerald-100 text-emerald-700" };
  return { label: "Inactive", color: "bg-slate-100 text-slate-500" };
};

const SubscriptionTab = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [historyPagination, setHistoryPagination] = useState<Pagination>({ page: 1, limit: 10 });
  const { data: subData, isFetching } = useFetchWorkspaceSubscription(workspaceAlias, historyPagination);

  const sub = subData?.subscription;
  const history = subData?.history;
  const status = getSubscriptionStatus(sub);

  if (isFetching && !sub) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Subscription Plan</CardTitle>
          <CardDescription>Management of organization licensing and quotas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-6 w-full">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Plan</span>
                  <h2 className="text-2xl font-black text-slate-900">{sub?.subscriptionPlanAlias || "No Active Plan"}</h2>
                </div>
                <Badge className={cn("px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]", status.color)}>
                  {status.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Billing Cycle", value: sub?.billingCycle || "N/A" },
                  { label: "Start Date", value: sub?.subscriptionStartDate ? new Date(sub.subscriptionStartDate).toLocaleDateString() : "N/A" },
                  { label: "Renewal / End Date", value: sub?.subscriptionEndDate ? new Date(sub.subscriptionEndDate).toLocaleDateString() : "N/A" },
                  { label: "Trial Expiry", value: sub?.trialExpiryDate ? new Date(sub.trialExpiryDate).toLocaleDateString() : "N/A" },
                  { label: "Amount Paid", value: sub?.amountPaid != null ? `${sub.currency || ""} ${sub.amountPaid.toLocaleString()}` : "N/A" },
                ].map((item, i) => (
                  <div key={i} className="p-4 border rounded-xl border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
                    <p className="text-sm font-bold text-slate-700 mt-1 capitalize">{item.value}</p>
                  </div>
                ))}
                <div className="p-4 border rounded-xl border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Cancel at Period End</span>
                  <p className="text-sm font-bold mt-1 flex items-center gap-1">
                    {sub?.cancelAtSubscriptionEnd ? (
                      <span className="text-red-600 flex items-center gap-1"><XCircleIcon weight="bold" size={14} /> Yes</span>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircleIcon weight="bold" size={14} /> No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Payment History</CardTitle>
          <CardDescription>All billing transactions for this organization</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(history?.data || []).map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell className="pl-6 text-xs text-slate-500">
                    {record.paidAt ? new Date(record.paidAt).toLocaleDateString() : record.created_at ? new Date(record.created_at).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700">{record.subscriptionPlan || "N/A"}</TableCell>
                  <TableCell className="text-sm font-bold text-slate-900">
                    {record.amount != null ? `${record.currency || ""} ${record.amount.toLocaleString()}` : "N/A"}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 capitalize">{record.paymentMethod || "N/A"}</TableCell>
                  <TableCell className="text-xs text-slate-400 font-mono">{record.transactionReference || "—"}</TableCell>
                  <TableCell className="text-xs capitalize text-slate-500">{record.eventType || "—"}</TableCell>
                  <TableCell className="pr-6">
                    <Badge className={cn("capitalize text-[10px] font-bold",
                      record.status === "success" || record.status === "paid" ? "bg-emerald-100 text-emerald-700"
                      : record.status === "pending" ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                    )}>
                      {record.status || "Unknown"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {(!history?.data || history.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">No payment history found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="p-4 border-t border-slate-50 bg-slate-50/30">
            <TablePagination
              total={history?.total || 0}
              page={historyPagination.page}
              limit={historyPagination.limit || 10}
              totalPages={history?.totalPages || 0}
              onPageChange={(page) => setHistoryPagination({ ...historyPagination, page })}
              onLimitChange={(limit) => setHistoryPagination({ ...historyPagination, limit, page: 1 })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- MAIN PAGE ---

export default function InventoryWorkspaceDetailsPage() {
  const { workspaceAlias } = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: statsData, isFetching } = useFetchWorkspacesStats(
    user?.id || "",
    { page: 1, limit: 1 },
    workspaceAlias as string,
  );

  const workspace = statsData.data?.[0];

  if (isFetching && !workspace) {
    return (
      <div className="p-10 space-y-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!workspace) {
    return <div className="p-20 text-center text-slate-500">Workspace not found or no access.</div>;
  }

  const initials = workspace.organizationName
    ?.split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-full space-y-8">
      <div className="space-y-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-medium"
        >
          <CaretLeft weight="bold" /> Back to Workspaces
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
              <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold rounded-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{workspace.organizationName}</h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold uppercase text-[10px]">
                  {workspace.status === "active" || workspace.status === true ? "Active" : "Inactive"}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                {workspace.organizationType || "General Business"} • {workspace.organizationAlias}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={workspace.productsCount?.toLocaleString()} icon={BriefcaseIcon} colorClass="bg-indigo-50 text-indigo-600" />
        <StatCard label="Total Orders" value={workspace.ordersCount?.toLocaleString()} icon={LightningIcon} colorClass="bg-amber-50 text-amber-600" />
        <StatCard label="Total Customers" value={workspace.customersCount?.toLocaleString()} icon={UsersIcon} colorClass="bg-sky-50 text-sky-600" />
        <StatCard label="Total Purchase Orders" value={workspace.purchaseOrdersCount?.toLocaleString() ?? "0"} icon={PackageIcon} colorClass="bg-emerald-50 text-emerald-600" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-slate-200">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            {["Overview", "Team", "Subscription", "Settings"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="px-0 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none font-bold text-slate-400 data-[state=active]:text-indigo-600 transition-all uppercase tracking-wider text-xs"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="focus-visible:outline-none m-0">
          <OverviewTab workspace={workspace} />
        </TabsContent>

        <TabsContent value="team" className="focus-visible:outline-none m-0">
          <TeamTab workspaceAlias={workspaceAlias as string} />
        </TabsContent>

        <TabsContent value="subscription" className="focus-visible:outline-none m-0">
          <SubscriptionTab workspaceAlias={workspaceAlias as string} />
        </TabsContent>

        <TabsContent value="settings" className="focus-visible:outline-none m-0">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for this organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-red-100 bg-red-50/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-900">Deactivate Workspace</h4>
                  <p className="text-xs text-red-600/70">Temporarily suspend all access to this workspace</p>
                </div>
                <Button variant="destructive" size="sm">Deactivate</Button>
              </div>
              <div className="p-4 border border-red-100 bg-red-50/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-900">Delete Workspace</h4>
                  <p className="text-xs text-red-600/70">Permanently remove this organization and all its data</p>
                </div>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
