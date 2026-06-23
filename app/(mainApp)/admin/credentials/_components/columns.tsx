import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateData } from "@/hooks/services/request";
import { OrganizationVerification } from "@/typings/organization";
import Image from "next/image";
import Link from "next/link";
import useUserStore from "@/store/globalUserStore";

export const columns = (
  getData: () => Promise<OrganizationVerification | undefined>
): ColumnDef<OrganizationVerification>[] => [
  {
    accessorKey: "workspace.organizationName",
    header: "Organization Name",
    cell: ({ getValue }) => {
      const organizationName = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <span>{organizationName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "workspace.eventPhoneNumber",
    header: "Phone Number",
    cell: ({ getValue }) => {
      const phoneNumber = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <span>{phoneNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "workspace.eventContactEmail",
    header: "Email",
    cell: ({ getValue }) => {
      const email = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <span>{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ getValue }) => {
      const address = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <span>{address}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "country",
    header: "Country",
    cell: ({ getValue }) => {
      const country = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <span>{country}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "incorporationYear",
    header: "Incorporation Year",
    cell: ({ getValue }) => {
      const year = getValue() as string;
      return (
        <div className="flex items-center gap-2">
          <span>{year}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "document",
    header: "document",
    cell: ({ getValue }) => {
      const document = getValue() as { url: string; name: string };

      return (
        <Dialog>
          <DialogTrigger asChild>
            <button aria-label="open dialog">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 1024 1024"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
              </svg>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{document.name}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center p-4">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={document.url}
              >
                <Image
                  alt={document.name}
                  src={document.url}
                  height={250}
                  width={250}
                />
              </Link>
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const verification = row.original as OrganizationVerification;
      return <VerificationActionCell verification={verification} getData={getData} />;
    },
  },
];

const VerificationActionCell = ({
  verification,
  getData,
}: {
  verification: OrganizationVerification;
  getData: () => Promise<any>;
}) => {
  const { user } = useUserStore();
  const { updateData, isLoading } = useUpdateData("/workspaces/verification");
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    await updateData({
      payload: {
        status: "verified",
        workspaceAlias: verification.workspaceAlias,
        adminUserId: user?.id || null,
        adminEmail: user?.userEmail || null,
        reason: reason.trim() || null,
      },
    });
    setApproveOpen(false);
    setReason("");
    await getData();
  };

  const handleReject = async () => {
    await updateData({
      payload: {
        status: "rejected",
        workspaceAlias: verification.workspaceAlias,
        adminUserId: user?.id || null,
        adminEmail: user?.userEmail || null,
        reason: reason.trim() || null,
      },
    });
    setRejectOpen(false);
    setReason("");
    await getData();
  };

  if (verification.status !== "pending") {
    return (
      <div className="font-medium capitalize text-center text-sm">
        {verification.status}
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2">
      <Dialog open={approveOpen} onOpenChange={(open) => { setApproveOpen(open); if (!open) setReason(""); }}>
        <DialogTrigger asChild>
          <Button size="sm" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">
              Are you sure you want to approve verification for: <b>{verification.workspace?.organizationName || verification.workspaceAlias}</b>?
            </p>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Reason / Notes (Optional)</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter comments..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setApproveOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
              {isLoading ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={(open) => { setRejectOpen(open); if (!open) setReason(""); }}>
        <DialogTrigger asChild>
          <Button size="sm" variant="destructive" disabled={isLoading} className="font-medium">
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Verification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-slate-600">
              Are you sure you want to reject verification for: <b>{verification.workspace?.organizationName || verification.workspaceAlias}</b>?
            </p>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Reason for rejection <span className="text-red-500">*</span></Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. invalid documents, mismatching name"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={isLoading || !reason.trim()} variant="destructive">
              {isLoading ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
