import { IPayOut, TUser } from "@/types";
import { TOrganization } from "@/typings/organization";
import { InlineIcon } from "@iconify/react";
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import { useFinalizePayOut, useGetPayOuts } from "@/hooks/services/payout";
import useUserStore from "@/store/globalUserStore";
// form to accept or reject payout that shows organization payout details

const AcceptPayout = ({
  organization,
  requestedBy,
  setStep,
  payoutInfo,
}: {
  organization: TOrganization;
  requestedBy: TUser;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  payoutInfo: IPayOut;
}) => {
  const { user } = useUserStore();
  const { getPayOuts } = useGetPayOuts({
    userId: user?.id || 0,
  });
  const { finalizePayOut, isLoading } = useFinalizePayOut();
  const clsBtnRef = useRef<HTMLButtonElement>(null);

  async function onSubmit() {
    if (!user) return null;
    const { reference, status } = await finalizePayOut({
      payload: {
        payOutRef: payoutInfo.payOutRef,
        paidOutBy: user.id,
        userEmail: requestedBy.userEmail,
        userName: requestedBy.firstName,
        paidOutEmail: user.userEmail,
        paidOutName: user.firstName,
        amount: payoutInfo.Amount,
      },
    });

    if (!status) return;

    await getPayOuts();

    clsBtnRef.current?.click();

    setStep(0);
  }
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-sm text-gray-800">Accept Payout</h1>
        <p className="text-xs text-gray-600">
          Make payment to the account details listed below
        </p>
      </div>
      <div className="w-full border rounded-lg bg-basePrimary-100 p-3">
        <div className="w-full flex items-end justify-between mb-4">
          <div className="flex flex-col gap-1 items-start justify-start">
            <p>Bank Name</p>
            <p className="font-semibold text-lg">
              {organization?.payoutAccountDetails?.accountName ?? ""}
            </p>
          </div>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(
                organization?.payoutAccountDetails?.accountName ?? ""
              );
              toast.success("Copied to clipboard");
            }}
          >
            <InlineIcon icon="si:copy-duotone" fontSize={20} />
          </button>
        </div>
        <div className="w-full flex items-end justify-between mb-4">
          <div className="flex flex-col gap-1 items-start justify-start">
            <p>Account Number</p>
            <p className="font-semibold text-lg capitalize">
              {organization?.payoutAccountDetails?.accountNumber}
            </p>
          </div>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(
                organization?.payoutAccountDetails?.accountNumber || ""
              );
              toast.success("Copied to clipboard");
            }}
          >
            <InlineIcon icon="si:copy-duotone" fontSize={20} />
          </button>
        </div>
        <div className="w-full flex items-end justify-between mb-4">
          <div className="flex flex-col gap-1 items-start justify-start">
            <p>Amount</p>
            <p className="font-semibold text-lg">{`NGN${
              Number(payoutInfo.Amount || 0)?.toLocaleString() ?? 0
            }`}</p>
          </div>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(
                `NGN${Number(payoutInfo.Amount || 0)?.toLocaleString() ?? 0}`
              );
              toast.success("Copied to clipboard");
            }}
          >
            <InlineIcon icon="si:copy-duotone" fontSize={20} />
          </button>
        </div>
      </div>
      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="bg-basePrimary w-full"
      >
        {isLoading ? "Loading..." : "I have made the payment"}
      </Button>{" "}
      <DialogClose>
        <button type="button" className="hidden" ref={clsBtnRef}>
          close
        </button>
      </DialogClose>
    </div>
  );
};

export default AcceptPayout;
