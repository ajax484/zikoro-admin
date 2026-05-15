"use client";
import { Pagination } from "@/hooks/services/request";
import { getRequest } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TOrganization } from "@/typings/organization";

export function useFetchWorkspaces(userId?: string) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["workspaces", userId],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      const { data, status } = await getRequest<TOrganization[]>({
        endpoint: `/workspaces`,
        searchParams,
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      console.log(data.data);

      return data.data;
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

export function useFetchWorkspacesStats(userId?: string, pagination: Pagination = { page: 1, limit: 10 }, workspaceAlias?: string) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["workspaces-stats", userId, { pagination, workspaceAlias }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("page", (pagination.page || 1).toString());
      searchParams.set("limit", (pagination.limit || 10).toString());
      if (workspaceAlias) {
        searchParams.set("workspaceAlias", workspaceAlias);
      }

      const { data, status } = await getRequest<{
        data: (TOrganization & {
          productsCount: number;
          ordersCount: number;
          customersCount: number;
          usersCount: number;
          totalRevenue: number;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>({
        endpoint: `/workspaces/stats`,
        searchParams,
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      return data;
    },
  });

  const responseData = data as any;

  return {
    data: {
      data: responseData?.data || [],
      limit: responseData?.limit || pagination.limit || 10,
      total: responseData?.total || 0,
      totalPages: responseData?.totalPages || 0,
      page: responseData?.page || pagination.page || 1,
    },
    isFetching,
    status,
    error,
    refetch,
  };
}

export function useFetchWorkspaceTeamMembers(
  workspaceId: string,
  pagination: Pagination,
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["workspaceTeamMembers", workspaceId, { pagination }],
    queryFn: async () => {
      const { data, status } = await getRequest<
        any // Replace with proper type if needed
      >({
        endpoint: `/workspaces/${workspaceId}/team`,
        searchParams: new URLSearchParams({
          page: (pagination.page || 1).toString(),
          limit: (pagination.limit || 10).toString(),
        }),
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      console.log(data.data);

      return data.data;
    },
    enabled: !!workspaceId,
  });

  return {
    data: data || {
      data: [],
      limit: pagination.limit,
      total: 0,
      totalPages: 0,
      page: pagination.page,
    },
    isFetching,
    status,
    error,
    refetch,
  };
}

export function useFetchWorkspaceTeamInvites(
  workspaceId: string,
  pagination: Pagination,
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["workspaceTeamInvites", workspaceId, { pagination }],
    queryFn: async () => {
      const { data, status } = await getRequest<
        any[] // Replace with proper type if needed
      >({
        endpoint: `/workspaces/${workspaceId}/team/invites`,
        searchParams: new URLSearchParams({
          page: (pagination.page || 1).toString(),
          limit: (pagination.limit || 10).toString(),
        }),
      });

      if (status !== 200) {
        toast.error(data.error ?? "Unknown error");
        throw new Error(data.error ?? "Unknown error");
      }

      console.log(data.data);

      return data.data;
    },
    enabled: !!workspaceId,
  });

  return {
    data: {
      data: Array.isArray(data) ? data : [],
      limit: pagination.limit,
      total: 0,
      totalPages: 0,
      page: pagination.page,
    },
    isFetching,
    status,
    error,
    refetch,
  };
}
