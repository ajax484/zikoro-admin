import { TOrganization } from "@/typings/organization";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutateData } from "@/hooks/services/request";
import AddPoints from "./AddCredits";

export function generateAlphanumericHash(length?: number): string {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const hashLength = length || 18;
  let hash = "";

  for (let i = 0; i < hashLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters.charAt(randomIndex);
  }

  return hash;
}

export const columns = (getData: any): ColumnDef<TOrganization>[] => [
  {
    accessorKey: "organizationName",
    header: "Organization Name",
    enableSorting: true,
  },
  {
    accessorKey: "eventContactEmail",
    header: "Owner",
    enableSorting: true,
  },
  {
    accessorKey: "created_at",
    header: "Date Issued",
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return format(date, "MMMM do, yyyy");
    },
    sortingFn: "datetime",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const organization = row.original as TOrganization;

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
        await getData();
      };

      return (
        <div className="flex flex-row gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={isLoading}>Add Credits</Button>
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
