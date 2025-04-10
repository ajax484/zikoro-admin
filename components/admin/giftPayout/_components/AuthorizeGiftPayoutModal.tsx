"use client";

import { InlineIcon } from "@iconify/react";
import { Button } from "@/components/custom_ui/Button";
import { TOrganization } from "@/typings/organization";
import { usePostRequest } from "@/hooks/services/request";
import { useState } from "react";
import { TRecievedGift } from "@/types/gift-registry";
import { Loader2Icon } from "lucide-react";

export function AuthorizeGiftPayoutModal({
  close,
  amount,
  organization,
  reference,
  receivedGifts,
  refetch,
}: {
  organization: TOrganization;
  amount: number;
  close: () => void;
  reference: string;
  receivedGifts: TRecievedGift[];
  refetch: () => Promise<any>;
}) {
  const [loading, setLoading] = useState(false);
  const { postData } = usePostRequest("gift-registry/received/send");
  const { postData: sendPayoutMail } = usePostRequest(
    "gift-registry/received/send-payout-mail"
  );
  const onAuthorizePayOut = async () => {
    try {
      setLoading(true);
      await Promise.all(
        receivedGifts?.map(async (item) => {
          const payload: Partial<TRecievedGift> = {
            ...item,
            status: "payout-completed",
            paidByAdmin: 0,
            paidByAdminDateTime: new Date().toISOString(),
          };

          await postData({ payload });
        })
      );

      await sendPayoutMail({
        payload: {
          members: organization?.organizationTeamMembers,
          payoutRef: reference,
          amount: amount,
        },
      });

      setLoading(false);
      await refetch();
      close();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={close}
      className="w-screen h-screen fixed inset-0 bg-black/50 z-[50] "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="right-0 max-h-[85%] inset-0 h-fit m-auto animate-float-in border vert-scroll inset-y-0 absolute max-w-xl w-full bg-white rounded-xl overflow-y-auto"
      >
        <div className="w-full flex flex-col items-start p-4 justify-start gap-3">
          <div className="w-full flex items-center justify-between">
            <h2>Authorize Payout</h2>
            <Button
              onClick={close}
              className="h-10 w-10 px-0  flex items-center justify-center self-end rounded-full bg-zinc-700"
            >
              <InlineIcon
                icon={"mingcute:close-line"}
                fontSize={22}
                color="#ffffff"
              />
            </Button>
          </div>

          <div className="space-y-4 w-full">
            <div className="border border-gray-200">
              <div className="grid grid-cols-2 border-b border-b-200">
                <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
                  Bank Name
                </div>
                <div className="pl-2 py-2 font-medium text-gray-500">
                  {organization.payoutAccountDetails?.bankName}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-b-200">
                <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
                  Bank Country
                </div>
                <div className="pl-2 py-2 font-medium text-gray-500">
                  {organization.payoutAccountDetails?.bankCountry}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-b-200">
                <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
                  Account Name
                </div>
                <div className="pl-2 py-2 font-medium text-gray-500">
                  {organization.payoutAccountDetails?.accountName}
                </div>
              </div>
              <div className="grid grid-cols-2 border-b border-b-200">
                <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
                  Account Number
                </div>
                <div className="pl-2 py-2 font-medium text-gray-500">
                  {organization.payoutAccountDetails?.accountNumber}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
                  Amount
                </div>
                <div className="pl-2 py-2 font-medium text-gray-500">
                  {new Intl.NumberFormat().format(amount)}
                </div>
              </div>
            </div>
            <Button
              disabled={loading}
              className="bg-basePrimary gap-x-2 text-white font-medium w-full"
              onClick={onAuthorizePayOut}
            >
              {loading && <Loader2Icon size={20} />}
              Authorize Payout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
