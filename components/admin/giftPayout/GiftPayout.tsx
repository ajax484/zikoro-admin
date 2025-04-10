"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetData } from "@/hooks/services/request";
import { TReceivedPayout } from "@/types/gift-registry";
import { useMemo, useState } from "react";
import Image from "next/image";
import { removeCamelCaseAndUnderscore } from "@/utils";
import { AuthorizeGiftPayoutModal } from "./_components/AuthorizeGiftPayoutModal";

export function convertDateFormat(inputDate: string): string {
  const originalDate = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(originalDate.getTime())) {
    console.error("Invalid date format");
    return "";
  }

  // Format the date as "MM/DD/YYYY"
  const formattedDate = `${(originalDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${originalDate
    .getDate()
    .toString()
    .padStart(2, "0")}/${originalDate.getFullYear()}`;

  return formattedDate;
}

const PAYOUT_TABS = [
  { label: "New", value: "payout-requested" },
  { label: "Paid", value: "payout-received" },
];

function TableRow({
  item,
  refetch,
}: {
  item: TReceivedPayout;
  refetch: () => Promise<any>;
}) {
  const [isPayout, setIsPayout] = useState(false);

  const { giftRegistry, ...data } = item;
  const { giftRegistry: ww, users, ...received } = item;
  return (
    <>
      <tr className="text-mobile sm:text-sm px-3 py-2 gap-3 items-center grid grid-cols-10">
        {/**1 */}
        <td className="w-full gap-1 items-start flex flex-col justify-start col-span-2">
          <p className="capitalize w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {item?.users?.firstName} {item?.users?.lastName}
          </p>
          <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {item?.users?.userEmail}
          </p>
        </td>
        {/**2 */}
        <td className="w-full flex flex-col items-start justify-start gap-2 col-span-2">
          <p className="capitalize">{item?.giftRegistry?.title}</p>
        </td>
        {/*3 */}
        <td className="w-full">
          {item?.giftRegistry?.currency} {item?.amount}
        </td>
        {/**4 */}
        <td className="w-full capitalize overflow-hidden text-ellipsis whitespace-nowrap">
          {item?.paymentReference}
        </td>
        {/**5 */}
        <td className="w-full ">
          {convertDateFormat(item?.payoutRequestTime)}
        </td>
        {/**6 */}
        <td className="w-full">
          {item?.paidByAdminDateTime
            ? convertDateFormat(item?.paidByAdminDateTime)
            : "-"}
        </td>
        {/**7 */}
        <td
          className={`w-fit text-xs px-3 py-2 rounded-lg capitalize ${
            item?.status === "payout-completed"
              ? "bg-green-100 text-green-600 border-green-600"
              : item?.status === "payout-requested"
                ? "bg-yellow-100 text-yellow-600 border-yellow-600"
                : "bg-gray-100 text-gray-600 border-gray-600"
          }`}
        >
          {removeCamelCaseAndUnderscore(item?.status)}
        </td>
        {/**8 */}
        {item?.status !== "payout-received" && (
          <td onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsPayout(true)}
              className="text-basePrimary underline "
            >
              Payout
            </button>
          </td>
        )}
      </tr>

      {isPayout && (
        <AuthorizeGiftPayoutModal
          reference={item?.payoutReference}
          receivedGifts={[received]}
          amount={item?.amount || 0}
          refetch={refetch}
          close={() => setIsPayout(false)}
          organization={item?.giftRegistry?.organization}
        />
      )}
    </>
  );
}

export default function GiftPayout() {
  const {
    data,
    getData,
    isLoading: loading,
  } = useGetData<TReceivedPayout[]>("/gift-registry/received");
  const [currentTab, setTab] = useState("payout-requested");

  const filteredItem = useMemo(() => {
    if (Array.isArray(data)) {
      return data?.filter((item) => {
        return currentTab === item?.status;
      });
    } else return [];
  }, [currentTab, data]);

  console.log(data);
  return (
    <section className="w-full pt-8 pb-8 space-y-4">
      <header className="space-y-4">
        <div className="px-2 md:px-4">
          <h1 className="text-basePrimary font-bold text-3xl">Gift Payout</h1>
          <p className="text-xl text-gray-800 font-medium">
            View and manage gift payouts
          </p>
        </div>
        <ToggleGroup
          type="single"
          onValueChange={(value) => setTab(value)}
          value={currentTab}
          className="w-full flex gap-6 justify-start px-4 bg-gray-50"
        >
          {PAYOUT_TABS.map(({ label, value }) => (
            <ToggleGroupItem
              className="text-base font-medium rounded-none hover:bg-basePrimary/10 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-transparent data-[state=on]:border-b-2 data-[state=on]:border-b-basePrimary bg-transparent h-14"
              value={value}
              aria-label={"tab " + label}
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </header>

      <div className="w-full px-4 sm:px-6">
        <table className="w-full min-w-[1400px] hide-scrollbar overflow-x-auto no-scrollbar">
          <thead className="w-full">
            <tr className="w-full bg-basePrimary-200 font-semibold text-mobile gap-3 sm:text-sm rounded-t-lg px-3 py-3 grid grid-cols-10">
              <td className="col-span-2 w-full">
                <span>Requested By</span>
              </td>
              <td className="col-span-2">Requested For</td>
              <td className="">Amount</td>
              <td className="">Reference</td>
              <td className="">Requested Date</td>
              <td className="">Payout Date</td>
              <td className="">Payout Status</td>
              <td className=""></td>
            </tr>
          </thead>
          <tbody className="w-full bg-white">
            {filteredItem?.map((item) => (
              <TableRow item={item} refetch={getData} key={item.id} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
