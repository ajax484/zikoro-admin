"use client";
import { TOrganization } from "@/types/organization";
import { toast } from "@/components/ui/use-toast";
import { getRequest, postRequest } from "@/utils/api";
import { useEffect, useState } from "react";
import { getCookie } from "@/hooks";
import { UseGetResult, usePostResult } from "@/types/request";
import useUserStore from "@/store/globalUserStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


const supabase = createClientComponentClient();

export const useGetOrganizations = (): UseGetResult<
  TOrganization[],
  "organizations",
  "getOrganizations"
> => {
  const [organizations, setOrganizations] = useState<TOrganization[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getOrganizations = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrganization[]>({
        endpoint: `organization`,
      });

      if (status !== 200) {
        throw data;
      }
      setOrganizations(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrganizations();
  }, []);

  return {
    organizations,
    isLoading,
    error,
    getOrganizations,
  };
};

export const useGetUserTeamOrganizations = ({
  userEmail,
}: {
  userEmail: string;
}): UseGetResult<
  TOrganization[],
  "userOrganizations",
  "getUserOrganizations"
> => {
  const [userOrganizations, setUserOrganizations] = useState<TOrganization[]>(
    []
  );
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getUserOrganizations = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrganization[]>({
        endpoint: `organization/user/${userEmail}`,
      });

      console.log(data);

      if (status !== 200) {
        throw data;
      }
      setUserOrganizations(data.data);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrganizations();
  }, []);

  return {
    userOrganizations,
    isLoading,
    error,
    getUserOrganizations,
  };
};

export const useGetOrganization = ({
  organizationId,
}: {
  organizationId: number;
}): UseGetResult<TOrganization, "organization", "getOrganization"> => {
  const [organization, setOrganization] = useState<TOrganization | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const getOrganization = async () => {
    setLoading(true);

    try {
      const { data, status } = await getRequest<TOrganization>({
        endpoint: `organization/${organizationId}`,
      });

      if (status === 200) {
        setOrganization(data.data);
        setError(false);
      } else {
        throw new Error("Failed to fetch organization data");
      }
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrganization();
  }, [organizationId]);

  return {
    organization,
    isLoading,
    error,
    getOrganization,
  };
};


export const useUpdateOrganization = ({
  organizationId,
}: {
  organizationId: number;
}): usePostResult<Partial<TOrganization>, "updateOrganization"> => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const updateOrganization = async ({
    payload,
  }: {
    payload: Partial<TOrganization>;
  }) => {
    setLoading(true);
    toast({
      description: "updating organization...",
    });
    try {
      const { data, status } = await postRequest({
        endpoint: `organization/${organizationId}`,
        payload,
      });

      if (status !== 201) throw data.data;
      toast({
        description: "Organization updated successfully",
      });

      return data.data.data;
    } catch (error) {
      setError(true);
      toast({
        description: "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateOrganization, isLoading, error };
};

export function useGetUserOrganizations() {
  // const userData = getCookie("user");
  const { user: userData, setUser } = useUserStore();
  const [userOrganizations, setUserOrganizatiions] = useState<TOrganization[]>(
    [] as TOrganization[]
  );

  const {
    organizations,
    isLoading: orgLoading,
    getOrganizations,
  } = useGetOrganizations();
  // checking if thwe user is a team member of some organizations
  useEffect(() => {
    if (!orgLoading && organizations) {
      const filteredOrganizations = organizations?.filter((organization) => {
        return organization.teamMembers?.some(
          ({ userEmail }) => userEmail === userData?.userEmail
        );
      });

      setUserOrganizatiions(filteredOrganizations);
    }
  }, [organizations]);

  //return data
  return {
    organizations: userOrganizations,
    getOrganizations,
  };
}


export function useGetUserOrganization(alias: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);

  async function getUserOrganisation(): Promise<TOrganization | null> {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organization")
        .select("*")
        .eq("organizationAlias", alias);
  
      if (error) {
        toast({
          description: `${error.message}`,
          variant: "destructive",
        });
        return null;
      }
  
      if (data && data.length > 0) {
        setData(data[0] as TOrganization);
        return data[0] as TOrganization;
      }
  
      return null;
    } catch (error) {
      console.error("Error fetching organization:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }
  

  return {
    data,
    getUserOrganisation,
    isLoading,
  };
}