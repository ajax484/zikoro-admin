"use client";
import { Pagination } from "@/hooks/services/request";
import { getRequest } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface InventoryTransaction {
  id: number;
  created_at: string;
  organizationAlias: string;
  organizationName: string;
  organizationLogo: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionReference: string;
  paidAt: string | null;
  eventType: string;
  subscriptionPlan: string | null;
  planName: string | null;
  planCycle: string | null;
}

interface PaginatedResult<TData> {
  data: TData[];
  limit: number;
  total: number;
  totalPages: number;
  page: number;
}

export function useFetchInventoryTransactions(
  pagination: Pagination & {
    search?: string;
    status?: string;
    plan?: string;
    startDate?: string;
    endDate?: string;
  } = { page: 1, limit: 10 },
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["inventoryTransactions", pagination],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, String(value));
        }
      });
      if (!searchParams.has("page")) searchParams.set("page", "1");
      if (!searchParams.has("limit")) searchParams.set("limit", "10");

      const { data, status } = await getRequest<any>({
        endpoint: `/inventory/transactions`,
        searchParams,
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      return data.data;
    },
  });

  return {
    data: {
      data: (data?.data || []) as InventoryTransaction[],
      limit: data?.limit || pagination.limit || 10,
      total: data?.total || 0,
      totalPages: data?.totalPages || 0,
      page: data?.page || pagination.page || 1,
    } as PaginatedResult<InventoryTransaction>,
    isFetching,
    status,
    error,
    refetch,
  };
}
