"use client";
import { getRequest, postRequest, patchRequest, deleteRequest } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SubscriptionPricing } from "@/types/subscriptions";

export function useFetchSubscriptionPricing(productType: string = "Inventory") {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["subscriptionPricing", productType],
    queryFn: async (): Promise<SubscriptionPricing[]> => {
      const { data, status } = await getRequest<SubscriptionPricing[]>({
        endpoint: `/subscriptions/pricing`,
        searchParams: new URLSearchParams({ productType }),
      });

      if (status !== 200) {
        toast.error(data?.error ?? "Unknown error");
        throw new Error(data?.error ?? "Unknown error");
      }

      return data.data || [];
    },
  });

  return {
    data: data || [],
    isFetching,
    status,
    error,
    refetch,
  };
}

export function useCreateSubscriptionPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<SubscriptionPricing>) => {
      const { data, status } = await postRequest<SubscriptionPricing>({
        endpoint: `/subscriptions/pricing`,
        payload,
      });

      if (status !== 201) {
        throw new Error(data.error || "Failed to create plan");
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionPricing"] });
      toast.success("Plan created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateSubscriptionPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<SubscriptionPricing>;
    }) => {
      const { data, status } = await patchRequest<SubscriptionPricing>({
        endpoint: `/subscriptions/pricing/${id}`,
        payload,
      });

      if (status !== 200) {
        throw new Error(data.error || "Failed to update plan");
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionPricing"] });
      toast.success("Plan updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteSubscriptionPricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data, status } = await deleteRequest<{ id: number }>({
        endpoint: `/subscriptions/pricing/${id}`,
      });

      if (status !== 200) {
        throw new Error(data.error || "Failed to delete plan");
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionPricing"] });
      toast.success("Plan deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
