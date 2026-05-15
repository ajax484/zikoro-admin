"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationSchema } from "@/schemas/organization";
import InputOffsetLabel from "@/components/shared/InputOffsetLabel";
import { useGetData } from "@/hooks/services/request";
import useUserStore from "@/store/globalUserStore";
import { useEffect, useState } from "react";
import React from "react";
import { Form, FormField } from "../ui/form";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { generateAlias } from "@/utils/helpers";
import { Loader, Lock, Minus, Plus, X } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import CreateWorkspace from "@/public/images/modal_image.jpg";
import Image from "next/image";
import { useCreateWorkspace } from "@/mutations/workspaces.mutations";
import { Combobox } from "../ui/combobox";
import { COUNTRIES_CURRENCY } from "@/constants/countryCodes";

type TPricingPlan = {
  amount: number | null;
  created_at: string;
  currency: string;
  id: number;
  monthPrice: number | null;
  plan: string | null;
  productType: string;
  yearPrice: number | null;
};

export function CreateOrganization({
  close,
  refetch,
  allowRedirect = false,
  isInitial = false,
}: {
  refetch?: () => Promise<unknown>;
  close: () => void;
  allowRedirect?: boolean;
  isInitial?: boolean;
}) {
  const { data: pricing } = useGetData<TPricingPlan[]>("/pricing");
  const { user } = useUserStore();
  const { mutateAsync, isPending } = useCreateWorkspace();
  const [selectedPricing, setSelectedPricing] = useState<TPricingPlan | null>(
    null
  );

  const form = useForm<z.infer<typeof organizationSchema>>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationAlias: generateAlias(),
      subscriptionPlan: "Free",
      organizationName: "",
      userEmail: user?.userEmail,
      firstName: user?.firstName,
      lastName: user?.lastName,
      organizationType: "Private",
      defaultCurrency: "NGN",
      // remove first
      //eventPhoneNumber: user?.phoneNumber.slice(1),
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("userEmail", user.userEmail);
      form.setValue("lastName", user.lastName);
      form.setValue("firstName", user.firstName);
    }
  }, [user]);

  const watchedSubSelection = form.watch("subscriptionPlan");
  // const organizationAlias = form.watch("organizationAlias");

  useEffect(() => {
    if (pricing && watchedSubSelection) {
      const chosenPlan = pricing?.find(
        ({ plan }) => plan === watchedSubSelection
      );
      setSelectedPricing(chosenPlan || null);
    }
  }, [pricing, watchedSubSelection]);

  async function onSubmit(values: z.infer<typeof organizationSchema>) {

   // console.log("Button is clicked", values);
    if (!user?.id) {
      throw new Error("User ID is missing.");
    }

    const newWorkspace = await mutateAsync({ ...values, userId: user.id });

    console.log(newWorkspace);

    if (newWorkspace) {
      if (refetch) refetch();
      close();
    }
  }

  const [buyCredits, setBuyCredits] = useState(false);

  //console.log(form.formState.errors)
  return (
    <div
      onClick={close}
      className="w-full h-full fixed overflow-y-auto no-scrollbar z-[100] inset-0 bg-black/50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-xl w-[98%] h-fit overflow-y-auto max-w-6xl box-animation bg-white mx-auto md:my-auto absolute inset-x-0 md:inset-y-0 grid md:grid-cols-2"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full grid grid-cols-1 p-6 bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-base sm:text-2xl font-semibold">
                  Create Workspace
                </h2>
                {isInitial && (
                  <div className="text-sm">
                    Create a new workspace to access Zikoro Inventory
                  </div>
                )}
              </div>
            </div>

            <div className="w-full flex py-4 flex-col gap-y-3 items-start justify-start">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <InputOffsetLabel label="First Name">
                    <Input
                      type="text"
                      placeholder="Enter First Name"
                      {...field}
                      
                      className="h-11 placeholder:text-sm placeholder:text-zinc-500 text-zinv-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <InputOffsetLabel label="Last Name">
                    <Input
                      type="text"
                      placeholder="Enter Last Name"
                      {...field}
                      
                      className="h-11 placeholder:text-sm placeholder:text-zinc-500 text-zinv-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <InputOffsetLabel label="Email Address">
                    <Input
                      type="text"
                      placeholder="Enter Email Address"
                      {...field}
                      
                      className="placeholder:text-sm h-11  text-zinv-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <InputOffsetLabel label="Workspace Name">
                    <Input
                      type="text"
                      placeholder="Enter Workspace Name"
                      {...field}
                      className="placeholder:text-sm h-11  text-zinv-700"
                    />
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="subscriptionPlan"
                render={({ field }) => (
                  <InputOffsetLabel label="Subscription Plan">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full h-11 !border-none !shadow-none focus:ring-0 focus:ring-offset-0 text-zinv-700 text-sm">
                        <SelectValue placeholder="Select Plan" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-[101]">
                        <SelectItem value="Free">Free</SelectItem>
                      </SelectContent>
                    </Select>
                  </InputOffsetLabel>
                )}
              />
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <InputOffsetLabel label="Default Currency">
                    <Combobox
                      options={COUNTRIES_CURRENCY.map(({ code, symbol }) => ({
                        label: `${code} (${symbol})`,
                        value: code,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select Currency"
                      searchPlaceholder="Search currency..."
                      triggerClassName="!border-none !shadow-none h-11 w-full"
                      contentClassName="z-[101]"
                    />
                  </InputOffsetLabel>
                )}
              />
              {/* <FormField
                control={form.control}
                name="organizationType"
                render={({ field }) => (
                  <InputOffsetLabel label="Workspace Type">
                    <ReactSelect
                      {...form.register("organizationType")}
                      options={orgType.map((value) => {
                        return { value, label: value };
                      })}
                      borderColor="#001fcc"
                      bgColor="#001fcc1a"
                      height="2.5rem"
                      placeHolderColor="#64748b"
                      placeHolder="Select Workspace"
                    />
                  </InputOffsetLabel>
                )}
              /> */}
            </div>

            <div className="w-full hidden flex-col items-start justify-start gap-y-2">
              <h2 className="font-semibold text-base sm:text-xl mb-2">
                Add-Ons
              </h2>

              <div className="w-full grid grid-cols-5">
                <p className="col-span-2">Certificate</p>
                <div className="col-span-3 flex items-center gap-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-gray-200"
                  >
                    <Minus size={15} />
                  </button>
                  <p className="font-medium text-mobile sm:text-sm">0</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-basePrimary text-white"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <div className="w-full grid grid-cols-5">
                <p className="col-span-2">Badges</p>
                <div className="col-span-3 flex items-center gap-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-gray-200"
                  >
                    <Minus size={15} />
                  </button>
                  <p className="font-medium text-mobile sm:text-sm">0</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="flex rounded-full items-center justify-center h-6 w-6 bg-basePrimary text-white"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full pt-4 flex flex-col items-start justify-start gap-y-3">
             

             
              <div className="w-full flex items-center justify-center">
                <Button type="submit">
                  {isPending ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    <Lock size={22} />
                  )}
                  Create
                </Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="w-full hidden md:block md:col-span-1 h-full relative">
          {!isInitial && (
            <button
              aria-label="Close"
              onClick={close}
              className="w-fit h-fit px-0 ml-auto hover:cursor-pointer absolute right-2 top-2 z-[100]"
            >
              <X size={22} />
            </button>
          )}
          <Image
            src={CreateWorkspace ?? ""}
            alt={"create workspace"}
            objectFit="cover"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}
