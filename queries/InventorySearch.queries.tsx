"use client";
import { Pagination } from "@/hooks/services/request";
import { getRequest } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface InventorySearchResult {
  id: number;
  productAlias: string;
  productName: string;
  sku: string | null;
  barcode: string | null;
  organizationAlias: string;
  organizationName: string;
  organizationLogo: string | null;
  productCost: number | null;
  currency: string | null;
  manufacturer: string | null;
  productGroupAlias: string | null;
  serialized: boolean | null;
  images: string[] | null;
}

export function useSearchInventoryProducts(
  query: string,
  pagination: Pagination = { page: 1, limit: 10 },
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["inventorySearch", query, pagination],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("q", query);
      searchParams.set("page", (pagination.page || 1).toString());
      searchParams.set("limit", (pagination.limit || 10).toString());

      const { data, status } = await getRequest<any>({
        endpoint: `/inventory/search`,
        searchParams,
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      return data.data;
    },
    enabled: query.trim().length >= 2,
  });

  return {
    data: {
      data: (data?.data || []) as InventorySearchResult[],
      limit: data?.limit || pagination.limit || 10,
      total: data?.total || 0,
      totalPages: data?.totalPages || 0,
      page: data?.page || pagination.page || 1,
    },
    isFetching,
    status,
    error,
    refetch,
  };
}
