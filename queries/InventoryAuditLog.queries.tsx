"use client";
import { Pagination } from "@/hooks/services/request";
import { getRequest } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export interface InventoryAuditLogEntry {
  id: number;
  created_at: string;
  actorId: number | null;
  actorEmail: string | null;
  organizationAlias: string | null;
  organizationName: string | null;
  organizationLogo: string | null;
  entityType: string;
  entityId: string | null;
  action: string;
  beforeData: Record<string, any> | null;
  afterData: Record<string, any> | null;
  reason: string | null;
}

interface PaginatedResult<TData> {
  data: TData[];
  limit: number;
  total: number;
  totalPages: number;
  page: number;
}

export function useFetchInventoryAuditLog(
  pagination: Pagination & {
    organizationAlias?: string;
    entityType?: string;
    action?: string;
    actorEmail?: string;
    startDate?: string;
    endDate?: string;
  } = { page: 1, limit: 10 },
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["inventoryAuditLog", pagination],
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
        endpoint: `/inventory/audit-log`,
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
      data: (data?.data || []) as InventoryAuditLogEntry[],
      limit: data?.limit || pagination.limit || 10,
      total: data?.total || 0,
      totalPages: data?.totalPages || 0,
      page: data?.page || pagination.page || 1,
    } as PaginatedResult<InventoryAuditLogEntry>,
    isFetching,
    status,
    error,
    refetch,
  };
}
