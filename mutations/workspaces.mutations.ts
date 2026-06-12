"use client";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteRequest, patchRequest, postRequest } from "@/utils/api";
import { toast } from "react-toastify";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { useRouter } from "next/navigation";
import { organizationSchema } from "@/schemas/organization";
import z from "zod";
import { TOrganization, OrganizationVerification } from "@/typings/organization";

export function useCreateWorkspace() {
  const { setOrganization } = useOrganizationStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: z.infer<typeof organizationSchema> & { userId: number }
    ) => {
      const { data, status } = await postRequest<
        z.infer<typeof organizationSchema> & { userId: number }
      >({
        endpoint: `/workspaces`,
        payload,
      });

      if (status !== 201) {
        throw new Error(data.error || "Failed to create workspace");
      }

      return data.data;
    },
    onMutate: () => {
      return toast.loading("Creating workspace...");
    },
    onSuccess: (newWorkspace, _, toastId) => {
      setOrganization(newWorkspace);

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces-stats"] });

      toast.update(toastId, {
        render: "Workspace created successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    onError: (error, _, toastId) => {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to create workspace. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}

export function useUpdateWorkspaces(workspaceId: string) {
  const { setOrganization } = useOrganizationStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<TOrganization>) => {
      const { data, status } = await patchRequest<TOrganization>({
        endpoint: `/workspaces/${workspaceId}`,
        payload,
      });

      if (status !== 200) {
        throw new Error(data.error || "Failed to update workspace");
      }

      return data.data;
    },
    onMutate: () => {
      return toast.loading("Updating workspace...");
    },
    onSuccess: (updatedWorkspace, _, toastId) => {
      setOrganization(updatedWorkspace);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: [workspaceId] });

      toast.update(toastId, {
        render: "Workspace updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    onError: (error, _, toastId) => {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to update workspace. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}

export function useDeleteWorkspace(workspaceId: string) {
  const { setOrganization } = useOrganizationStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { status } = await deleteRequest<TOrganization>({
        endpoint: `/workspaces/${workspaceId}`,
      });

      if (status !== 200) {
        throw new Error();
      }

      return workspaceId;
    },
    onMutate: () => {
      return toast.loading("Deleting workspace...");
    },
    onSuccess: (workspaceId, _, toastId) => {
      setOrganization(null);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.update(toastId, {
        render: "Workspace deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      router.push("/admin/inventory/workspaces");
    },
    onError: (error, _, toastId) => {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to update workspace. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}

export function useUpdateWorkspaceSubscription(workspaceAlias: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const { data, status } = await patchRequest<any>({
        endpoint: `/workspaces/${workspaceAlias}/subscription`,
        payload,
      });

      if (status !== 200) {
        throw new Error(data.error || "Failed to update subscription");
      }

      return data.data;
    },
    onMutate: () => {
      return toast.loading("Updating subscription...");
    },
    onSuccess: (_, __, toastId) => {
      queryClient.invalidateQueries({ queryKey: ["workspaceSubscription", workspaceAlias] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.update(toastId, {
        render: "Subscription updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    onError: (error, _, toastId) => {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to update subscription. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}

export function useSetWorkspaceInventoryAccess(workspaceAlias: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (active: boolean) => {
      const { data, status } = await patchRequest<TOrganization>({
        endpoint: `/workspaces/${workspaceAlias}`,
        payload: { activeApps: { inventory: active } },
      });

      if (status !== 200) {
        throw new Error(data.error || "Failed to update workspace access");
      }

      return data.data;
    },
    onMutate: (active) => {
      return toast.loading(active ? "Activating workspace..." : "Deactivating workspace...");
    },
    onSuccess: (_, active, toastId) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      toast.update(toastId, {
        render: active ? "Workspace activated successfully!" : "Workspace deactivated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    onError: (error, _, toastId) => {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to update workspace access. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}

export function useVerifyWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<OrganizationVerification>) => {
      const response = await postRequest<OrganizationVerification>({
        endpoint: `/workspaces/${workspaceId}/verify`,
        payload,
      });

      if (response.status !== 201) {
        throw new Error(response.data.error || "Verification failed");
      }

      return response.data.data;
    },
    onMutate: () => {
      return toast.loading("Verifying workspace...");
    },
    onSuccess: (newVerification, _, toastId) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: [workspaceId] });

      toast.update(toastId, {
        render: "Workspace verified successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    onError: (error, _, toastId) => {
      console.error("Mutation Error:", error);
      toast.update(toastId, {
        render: "Failed to verify workspace. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    },
  });
}
