"use client";
import { Pagination } from "@/hooks/services/request";
import { getRequest } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TOrganization } from "@/typings/organization";

export function useFetchWorkspaces(
  userId?: string,
  pagination: Pagination = { page: 1, limit: 10 },
  workspaceAlias?: string,
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["workspaces", userId, { pagination, workspaceAlias }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("page", (pagination.page || 1).toString());
      searchParams.set("limit", (pagination.limit || 10).toString());
      if (pagination.search) {
        searchParams.set("search", pagination.search);
      }
      if (workspaceAlias) {
        searchParams.set("workspaceAlias", workspaceAlias);
      }

      const { data, status } = await getRequest<any>({
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
    data: {
      data: data?.data || [],
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

interface StatsData {
  totalWorkspaces: number;
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalUsers: number;
  totalRevenue: number;
  totalPurchaseOrders: number;
}

export function useFetchWorkspacesStats(userId?: string) {
  const { data, isFetching, status, error, refetch } = useQuery<StatsData>({
    queryKey: ["workspaces-stats", userId],
    queryFn: async () => {
      const { data, status } = await getRequest<StatsData>({
        endpoint: `/workspaces/stats`,
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
    data: data || {
      totalWorkspaces: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalUsers: 0,
      totalRevenue: 0,
      totalPurchaseOrders: 0,
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
      const { data, status } = await getRequest<any>({
        // Replace with proper type if needed
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

export function useFetchWorkspaceSubscription(
  workspaceAlias: string,
  historyPagination: Pagination = { page: 1, limit: 10 },
) {
  const { data, isFetching, status, error, refetch } = useQuery({
    queryKey: ["workspaceSubscription", workspaceAlias, { historyPagination }],
    queryFn: async () => {
      const { data, status } = await getRequest<any>({
        endpoint: `/workspaces/${workspaceAlias}/subscription`,
        searchParams: new URLSearchParams({
          page: (historyPagination.page || 1).toString(),
          limit: (historyPagination.limit || 10).toString(),
        }),
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
      subscription: (data as any)?.subscription || null,
      history: (data as any)?.history || {
        data: [],
        limit: historyPagination.limit || 10,
        total: 0,
        totalPages: 0,
        page: historyPagination.page || 1,
      },
    },
    isFetching,
    status,
    error,
    refetch,
  };
}
