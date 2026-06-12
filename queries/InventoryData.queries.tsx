"use client";
import { Pagination } from "@/hooks/services/request";
import { getRequest } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface PaginatedResult<TData> {
  data: TData[];
  limit: number;
  total: number;
  totalPages: number;
  page: number;
}

function useFetchInventoryEntity<TData = any>(
  workspaceAlias: string,
  entity: string,
  pagination: Pagination & Record<string, any> = { page: 1, limit: 10 },
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["inventoryData", workspaceAlias, entity, pagination],
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
        endpoint: `/inventory/${workspaceAlias}/${entity}`,
        searchParams,
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      return data.data;
    },
    enabled: !!workspaceAlias,
  });

  return {
    data: {
      data: (data?.data || []) as TData[],
      limit: data?.limit || pagination.limit || 10,
      total: data?.total || 0,
      totalPages: data?.totalPages || 0,
      page: data?.page || pagination.page || 1,
    } as PaginatedResult<TData>,
    isFetching,
    status,
    error,
    refetch,
  };
}

export const useFetchInventoryProducts = (
  workspaceAlias: string,
  pagination: Pagination & { search?: string; category?: string; manufacturer?: string; serialized?: string; status?: string },
) => useFetchInventoryEntity(workspaceAlias, "products", pagination);

export const useFetchInventoryLocations = (
  workspaceAlias: string,
  pagination: Pagination & { search?: string },
) => useFetchInventoryEntity(workspaceAlias, "locations", pagination);

export const useFetchStockAdjustments = (
  workspaceAlias: string,
  pagination: Pagination,
) => useFetchInventoryEntity(workspaceAlias, "adjustments", pagination);

export const useFetchStockTransfers = (
  workspaceAlias: string,
  pagination: Pagination & { status?: string },
) => useFetchInventoryEntity(workspaceAlias, "transfers", pagination);

export const useFetchMovementLedger = (
  workspaceAlias: string,
  pagination: Pagination & { productAlias?: string; movementType?: string },
) => useFetchInventoryEntity(workspaceAlias, "ledger", pagination);

export const useFetchInventoryVendors = (
  workspaceAlias: string,
  pagination: Pagination & { search?: string },
) => useFetchInventoryEntity(workspaceAlias, "vendors", pagination);

export const useFetchInventoryCategories = (workspaceAlias: string) =>
  useFetchInventoryEntity(workspaceAlias, "categories", { page: 1, limit: 100 });

export function useFetchInventoryProductDetail(workspaceAlias: string, productAlias?: string) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["inventoryProductDetail", workspaceAlias, productAlias],
    queryFn: async () => {
      const { data, status } = await getRequest<any>({
        endpoint: `/inventory/${workspaceAlias}/products/${productAlias}`,
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      return data.data;
    },
    enabled: !!workspaceAlias && !!productAlias,
  });

  return {
    data: {
      product: data?.product || null,
      variants: data?.variants || [],
      ledger: data?.ledger || [],
    },
    isFetching,
    status,
    error,
    refetch,
  };
}

export function useFetchStockTransferDetail(workspaceAlias: string, transferAlias?: string) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["inventoryTransferDetail", workspaceAlias, transferAlias],
    queryFn: async () => {
      const { data, status } = await getRequest<any>({
        endpoint: `/inventory/${workspaceAlias}/transfers/${transferAlias}`,
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      return data.data;
    },
    enabled: !!workspaceAlias && !!transferAlias,
  });

  return {
    data: {
      transfer: data?.transfer || null,
      items: data?.items || [],
    },
    isFetching,
    status,
    error,
    refetch,
  };
}
