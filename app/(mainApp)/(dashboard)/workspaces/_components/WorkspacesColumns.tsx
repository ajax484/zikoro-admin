import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircleIcon, ClockIcon, PauseCircleIcon, BellIcon } from "@phosphor-icons/react";
import { abbreviateNumber } from "@/utils/helpers";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutateData } from "@/hooks/services/request";
import AddPoints from "./AddCredits";
import { generateAlphanumericHash } from "./columns";

export const workspacesColumnsFn: (
  totalWorkspaces: number,
  refetch: () => void
) => ColumnDef<any>[] = (totalWorkspaces: number, refetch: () => void) => [
  {
    id: "select",
    // @ts-ignore
    meta: { width: "50px" },
    header: ({ table }: { table: any }) => (
      <div className="pl-2">
        <Checkbox
          className="data-[state=checked]:bg-basePrimary"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }: { row: any }) => (
      <div onClick={(e) => e.stopPropagation()} className="pl-2">
        <Checkbox
          className="data-[state=checked]:bg-basePrimary"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "organizationName",
    id: "organizationName",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "2fr" },
    header: () => (
      <div className="flex items-center gap-2">
        <span className="text-gray-600 font-semibold text-base uppercase">Workspace</span>
        <span className="font-semibold bg-basePrimary/20 text-basePrimary rounded-2xl text-[10px] px-2 py-0.5 flex items-center justify-center">
          {abbreviateNumber(totalWorkspaces)}
        </span>
      </div>
    ),
    cell: ({ row }: { row: any }) => {
      const name = row.original.organizationName;
      const email = row.original.userEmail;
      const alias = row.original.organizationAlias;
      const initials = name?.split(" ").map((w: any) => w[0]).join("").slice(0, 2).toUpperCase() || "WS";

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <Link 
              href={`/workspaces/${alias}`} 
              className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
            >
              {name}
            </Link>
            <span className="text-[11px] text-slate-400">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "productsCount",
    id: "productsCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base">PRODUCTS</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.productsCount}</span>,
  },
  {
    accessorKey: "ordersCount",
    id: "ordersCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Orders</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.ordersCount?.toLocaleString()}</span>,
  },
  {
    accessorKey: "customersCount",
    id: "customersCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Customers</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.customersCount?.toLocaleString()}</span>,
  },
  {
    accessorKey: "usersCount",
    id: "usersCount",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Team</span>,
    cell: ({ row }: { row: any }) => <span className="font-semibold text-slate-600">{row.original.usersCount}</span>,
  },
  {
    accessorKey: "status",
    id: "status",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Status</span>,
    cell: ({ row }: { row: any }) => {
      const status = row.original.status;
      const isActive = status === "active" || status === true;
      const currentStatus = isActive ? "active" : "inactive";

      const styles: Record<string, string> = {
        active: "bg-emerald-50 text-emerald-700 border-emerald-100",
        inactive: "bg-red-50 text-red-700 border-red-100",
      };

      const icons: Record<string, React.ReactNode> = {
        active: <CheckCircleIcon weight="bold" className="w-3 h-3 mr-1" />,
        inactive: <BellIcon weight="bold" className="w-3 h-3 mr-1" />,
      };

      return (
        <Badge variant="outline" className={cn("font-medium capitalize", styles[currentStatus])}>
          {icons[currentStatus]}
          {currentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    id: "created_at",
    enableSorting: true,
    // @ts-ignore
    meta: { width: "1fr" },
    header: () => <span className="font-semibold text-gray-600 text-base uppercase">Created</span>,
    cell: ({ row }: { row: any }) => (
      <span className="text-slate-400 text-xs">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    // @ts-ignore
    meta: { width: "1.2fr" },
    cell: ({ row }: { row: any }) => {
      const organization = row.original;
      const { mutateData, isLoading } = useMutateData(
        `/workspaces/credits/buy`
      );

      const addCreditsFn = async (credits: {
        bronze: number;
        silver: number;
        gold: number;
      }) => {
        const reference =
          "ADMIN-" +
          organization?.organizationAlias +
          "-" +
          generateAlphanumericHash(12);

        await mutateData({
          payload: {
            credits: {
              gold: {
                amount: credits.gold,
                price: 0,
              },
              silver: {
                amount: credits.silver,
                price: 0,
              },
              bronze: {
                amount: credits.bronze,
                price: 0,
              },
            },
            workspaceId: organization?.id,
            email: organization.eventContactEmail,
            name: "User",
            workspaceName: organization?.organizationName,
            reference,
            currency: "NGN",
            workspaceAlias: organization?.organizationAlias,
            activityBy: "13",
          },
        });
        refetch();
      };

      return (
        <div onClick={(e) => e.stopPropagation()} className="flex flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={isLoading} size="sm" className="h-8 text-xs font-semibold">
                Add Credits
              </Button>
            </DialogTrigger>
            <DialogContent className="!w-fit !max-w-fit">
              <AddPoints addPoints={addCreditsFn} />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
