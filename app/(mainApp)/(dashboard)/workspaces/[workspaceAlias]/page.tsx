"use client";

import React, { useState, useMemo } from "react";
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
  CurrencyDollarIcon,
  LightningIcon,
  CheckCircleIcon,
  GlobeIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  IdentificationCardIcon,
  FileTextIcon,
  ArrowSquareOutIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import useUserStore from "@/store/globalUserStore";
import {
  useFetchWorkspacesStats,
  useFetchWorkspaceTeamMembers,
} from "@/queries/Workspaces.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/shared/DataTable";
import { TablePagination } from "@/components/shared/TablePagination";
import { cn } from "@/lib/utils";

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon: Icon, colorClass }: any) => (
  <Card className="border-none shadow-sm bg-white">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", colorClass)}>
          <Icon weight="bold" className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">{value}</h3>
        </div>
      </div>
    </CardContent>
  </Card>
);

// --- TABS ---

const OverviewTab = ({ workspace }: { workspace: any }) => {
  const info = [
    {
      label: "Organization Alias",
      value: workspace.organizationAlias,
      icon: GlobeIcon,
    },
    { label: "Contact Email", value: workspace.userEmail, icon: EnvelopeIcon },
    {
      label: "Owner Email",
      value: workspace.organizationOwner || workspace.userEmail,
      icon: ShieldCheckIcon,
    },
    {
      label: "Date Created",
      value: new Date(workspace.created_at).toLocaleDateString(),
      icon: ClockIcon,
    },
    {
      label: "Default Currency",
      value: workspace.prefixPreferences?.sku?.prefix === "SKU" ? "USD" : "NGN",
      icon: CurrencyDollarIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              General Information
            </CardTitle>
            <CardDescription>
              Basic details about this organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {info.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Verification Status
            </CardTitle>
            <CardDescription>Security and compliance checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { label: "Email Verified", status: true, icon: EnvelopeIcon },
                {
                  label: "Identity Verified",
                  status: workspace.verification?.length > 0,
                  icon: IdentificationCardIcon,
                },
                {
                  label: "Business Documents",
                  status: false,
                  icon: FileTextIcon,
                },
              ].map((step, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        step.status
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-50 text-slate-300",
                      )}
                    >
                      <step.icon size={18} weight="bold" />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        step.status ? "text-slate-900" : "text-slate-400",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {step.status ? (
                    <CheckCircleIcon
                      weight="bold"
                      className="text-emerald-500 w-5 h-5"
                    />
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase font-bold text-slate-400"
                    >
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full text-xs h-9">
              Manage Compliance
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TeamTab = ({ workspaceAlias }: { workspaceAlias: string }) => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const { data: teamData, isFetching } = useFetchWorkspaceTeamMembers(
    workspaceAlias,
    pagination,
  );

  const columns = [
    {
      accessorKey: "user",
      header: "Member",
      cell: ({ row }: any) => {
        const member = row.original;
        const name = member.user
          ? `${member.user.firstName} ${member.user.lastName}`
          : member.userEmail;
        const initials = name
          ?.split(" ")
          .map((n: any) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-bold">
                {initials}
              </AvatarFallback>
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
        <Badge
          variant="outline"
          className="capitalize bg-slate-50 border-slate-100 text-slate-600"
        >
          {row.original.userRole}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge
          className={cn(
            "capitalize",
            row.original.status === "accepted"
              ? "bg-emerald-500"
              : "bg-amber-500",
          )}
        >
          {row.original.status || "Pending"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined Date",
      cell: ({ row }: any) => (
        <span className="text-xs text-slate-400">
          {new Date(row.original.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <Card className="border-none shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Team Members</CardTitle>
          <CardDescription>
            Manage user access and roles for this workspace
          </CardDescription>
        </div>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          Invite Member
        </Button>
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
            onLimitChange={(limit) =>
              setPagination({ ...pagination, limit, page: 1 })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

// --- MAIN PAGE ---

export default function WorkspaceDetailsPage() {
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
    return (
      <div className="p-20 text-center text-slate-500">
        Workspace not found or no access.
      </div>
    );
  }

  const initials = workspace.organizationName
    ?.split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-full space-y-8">
      {/* Breadcrumbs & Header */}
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
              <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold rounded-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {workspace.organizationName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold uppercase text-[10px]"
                >
                  {workspace.status === "active" || workspace.status === true
                    ? "Active"
                    : "Inactive"}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                {workspace.organizationType || "General Business"} •{" "}
                {workspace.organizationAlias}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="h-11 px-5 font-semibold text-slate-600 hover:text-indigo-600 transition-all border-slate-200"
            >
              <PencilSimpleIcon weight="bold" className="mr-2" /> Edit Info
            </Button>
            <Button className="h-11 px-6 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
              Launch Workspace{" "}
              <ArrowSquareOutIcon weight="bold" className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={workspace.productsCount?.toLocaleString()}
          icon={BriefcaseIcon}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Total Orders"
          value={workspace.ordersCount?.toLocaleString()}
          icon={LightningIcon}
          colorClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Total Customers"
          value={workspace.customersCount?.toLocaleString()}
          icon={UsersIcon}
          colorClass="bg-sky-50 text-sky-600"
        />
        <StatCard
          label="Total Revenue"
          value={`$${workspace.totalRevenue?.toLocaleString()}`}
          icon={CurrencyDollarIcon}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
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

        <TabsContent
          value="overview"
          className="focus-visible:outline-none m-0"
        >
          <OverviewTab workspace={workspace} />
        </TabsContent>

        <TabsContent value="team" className="focus-visible:outline-none m-0">
          <TeamTab workspaceAlias={workspaceAlias as string} />
        </TabsContent>

        <TabsContent
          value="subscription"
          className="focus-visible:outline-none m-0"
        >
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Subscription Plan
              </CardTitle>
              <CardDescription>
                Management of organization licensing and quotas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6 w-full">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Current Plan
                      </span>
                      <h2 className="text-2xl font-black text-slate-900">
                        {workspace.subscriptionPlan || "Basic"} Plan
                      </h2>
                    </div>
                    <Badge className="bg-indigo-600 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">
                      Upgrade
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-xl border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Renewal Date
                      </span>
                      <p className="text-sm font-bold text-slate-700 mt-1">
                        {workspace.subscriptionExpiryDate
                          ? new Date(
                              workspace.subscriptionExpiryDate,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="p-4 border rounded-xl border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Payment Status
                      </span>
                      <p className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
                        <CheckCircleIcon weight="bold" /> Up to date
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-80 space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Workspace Quotas
                  </h4>
                  {[
                    {
                      label: "Team Members",
                      current: workspace.usersCount,
                      max: 5,
                    },
                    {
                      label: "Active Products",
                      current: workspace.productsCount,
                      max: 1000,
                    },
                  ].map((quota, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">{quota.label}</span>
                        <span className="text-slate-900">
                          {quota.current} / {quota.max}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-1000"
                          style={{
                            width: `${Math.min((quota.current / quota.max) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="settings"
          className="focus-visible:outline-none m-0"
        >
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-red-600">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for this organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-red-100 bg-red-50/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-900">
                    Deactivate Workspace
                  </h4>
                  <p className="text-xs text-red-600/70">
                    Temporarily suspend all access to this workspace
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Deactivate
                </Button>
              </div>
              <div className="p-4 border border-red-100 bg-red-50/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-red-900">
                    Delete Workspace
                  </h4>
                  <p className="text-xs text-red-600/70">
                    Permanently remove this organization and all its data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
