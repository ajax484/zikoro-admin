"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useGetData } from "@/hooks/services/request";
import { TRecievedGiftWithRegistry } from "@/types/gift-registry";
import { useMemo, useState } from "react";
import Image from "next/image";
import { removeCamelCaseAndUnderscore } from "@/utils";

const PAYOUT_TABS = [
  { label: "New", value: "payout-requested" },
  { label: "Paid", value: "payout-received" },
];

function TableRow({ item }: { item: TRecievedGiftWithRegistry }) {
  const [isPayout, setIsPayout] = useState(false);

  const { giftRegistry, ...data } = item;
  return (
    <>
      <tr className="text-mobile sm:text-sm px-3 py-2 gap-3 items-center grid grid-cols-9">
        {/**1 */}
        <td className="w-full items-center col-span-2">
          <div className="w-full flex flex-col items-start justify-start gap-2">
            {item?.giftRegistry?.image &&
            (item?.giftRegistry?.image as string).startsWith("https://") ? (
              <Image
                className="w-full rounded-lg border h-[100px]  object-cover"
                alt="gift"
                src={item?.giftRegistry?.image}
                width={400}
                height={400}
              />
            ) : (
              <div className="w-full rounded-lg border h-[100px]  bg-gray-200"></div>
            )}
            <p className="w-full line-clamp-1 capitalize">
              {item?.giftRegistry?.title}
            </p>
          </div>
        </td>
        {/**2 */}
        <td className="w-full flex flex-col items-start justify-start gap-2 col-span-2">
          <p className="capitalize">{item?.giverName}</p>
          <p>{item?.giverPhone}</p>
          <p>{item?.giverEmail}</p>
        </td>
        {/*3 */}
        <td className="w-full">
          {item?.giftRegistry?.currency} {item?.amount}
        </td>
        {/**4 */}
        <td className="w-full capitalize">
          {" "}
          {removeCamelCaseAndUnderscore(item?.status)}
        </td>
        {/**5 */}
        <td className="w-full ">{item?.qty}</td>
        {/**6 */}
        <td className="w-full">
          {removeCamelCaseAndUnderscore(item?.deliveryType)}
        </td>
        {/**7 */}
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

      {isPayout && <></>}
    </>
  );
}

export default function GiftPayout() {
  const {
    data,
    getData,
    isLoading: loading,
  } = useGetData<TRecievedGiftWithRegistry[]>("/gift-registry/received");
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
        <table className="w-full min-w-[1000px] hide-scrollbar overflow-x-auto no-scrollbar">
          <thead className="w-full">
            <tr className="w-full bg-basePrimary-200 font-semibold text-mobile gap-3 sm:text-sm rounded-t-lg px-3 py-3 grid grid-cols-9">
              <td className="col-span-2 w-full flex items-center gap-x-2">
                <span>Gift</span>
              </td>
              <td className="col-span-2">Gift Details</td>
              <td className="">Amount</td>
              <td className="">Qty</td>
              <td className="">Status</td>
              <td className="">Delivery Type</td>
              <td className=""></td>
            </tr>
          </thead>
          <tbody className="w-full bg-white">
            {filteredItem?.map((item) => (
              <TableRow item={item} key={item.id} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
