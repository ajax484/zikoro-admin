import { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

type organisationSchema = {
  id: number;
  created_at: string;
  organizationName: string;
  organizationSlug: string;
  subscriptionPlan: string;
  subscritionStartDate: string;
  subscriptionEndDate: string;
  organizationOwner: string;
  BillingAddress: string;
  TaxID: string;
  organizationOwnerId: number;
  organizationType: string;
  organizationLogo: string;
  country: string;
  eventPhoneNumber: string;
  eventWhatsApp: string;
  eventContactEmail: string;
  x: string;
  linkedIn: string;
  instagram: string;
  facebook: string;
};

//fetch user organization
export function useGetUserOrganization(userEmail: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    getUserOrganisation();
  }, []);


  async function getUserOrganisation() {
    try {
      setLoading(true);

      // Step 1: Fetch workspaceAliases associated with the user
      const { data: teamMemberData, error: teamMemberError } = await supabase
        .from("organizationTeamMembers")
        .select("workspaceAlias")
        .eq("userEmail", userEmail)
        .order("created_at", { ascending: false });

      if (teamMemberError) throw teamMemberError;

      const workspaceAliases = teamMemberData?.map(({ workspaceAlias }) => workspaceAlias);

      if (!workspaceAliases || workspaceAliases.length === 0) {
        setData([]); // No organizations found
        return;
      }

      // Step 2: Fetch organizationOwnerId using workspaceAliases
      const { data: organizationData, error: organizationError } = await supabase
        .from("organization")
        .select("organizationOwnerId")
        .in("organizationAlias", workspaceAliases);

      if (organizationError) throw organizationError;

      const organizationOwnerIds = organizationData?.map(({ organizationOwnerId }) => organizationOwnerId);

      // Step 3: Fetch all organizations matching organizationOwnerId or workspaceAliases
      // const { data: organizations, error: organizationsError } = await supabase
      //   .from("organization")
      //   .select("*")
      //   .or(`organizationOwnerId.in.(${organizationOwnerIds.join(',')}),organizationAlias.in.(${workspaceAliases.map(alias => `'${alias}'`).join(',')})`);
      const { data: organizations, error: organizationsError } = await supabase
        .from("organization")
        .select("*")
        .or(
          `organizationOwnerId.in.(${organizationOwnerIds.join(',')}),organizationAlias.in.(${workspaceAliases.map(alias => `'${alias}'`).join(',')})`
        );

      if (organizationsError) throw organizationsError;

      // Store the fetched organizations
      setData(organizations);
    } catch (error) {
      console.error("Error fetching user organizations:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    refetch: getUserOrganisation,
    isLoading,
  };
}

//create user Organization
export function useCreateUserOrganization(
  userId: number,
  orgName: string,
  username: string
) {
  async function createUserOrganization() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .upsert({
          organizationOwnerId: userId,
          organizationName: orgName,
          organizationOwner: username,
        });

      if (error) {
        toast.error(error.message);
        return;
      }
      if (status === 204 || status === 200) {
        toast.success("Organization created successfully");
      }
    } catch (error) { }
  }

  return {
    createUserOrganization,
  };
}
