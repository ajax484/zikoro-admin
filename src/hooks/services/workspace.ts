import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";

const supabase = createClientComponentClient();

interface FormDataType {
  orgName: string,
  orgType: string,
  orgPlan: string,
  orgCountry: string,
  orgWhatsappNumber: string,
  orgTel: string,
  orgEmail: string,
  orgLinkedin: string,
  orgInstagram: string,
  orgFacebook: string,
  orgX: string
}

export function useUpdateWorkspace(
  formData: FormDataType,
  orgLogoLink: string,
  orgFaviconLink: string,
  workspaceAlias?: string,
  workspaceId?: number,
) {
  async function updateWorkspace() {
    const {
      orgName,
      orgType,
      orgPlan,
      orgCountry,
      orgTel,
      orgWhatsappNumber,
      orgEmail,
      orgLinkedin,
      orgInstagram,
      orgFacebook,
      orgX
    } = formData;

    try {
      const query = supabase.from("organization").update({
        organizationName: orgName,
        organizationType: orgType,
        subscriptionPlan: orgPlan,
        country: orgCountry,
        eventPhoneNumber: orgTel,
        eventWhatsApp: orgWhatsappNumber,
        eventContactEmail: orgEmail,
        organizationLogo: orgLogoLink,
        favicon: orgFaviconLink,
        x: orgX,
        linkedIn: orgLinkedin,
        facebook: orgFacebook,
        instagram: orgInstagram,
      });

      // Add the filter based on the available identifier
      if (workspaceId) {
        query.eq("id", workspaceId);
      } else if (workspaceAlias) {
        query.eq("organizationAlias", workspaceAlias);
      } else {
        throw new Error("No valid identifier provided for workspace update.");
      }

      const { data, error, status } = await query.select().maybeSingle();

      if (error) {
        console.log(error.message);
        return;
      }

      if (status === 204 || status === 200) {
        toast.success("Workspace Updated");
        return data;
      }
    } catch (error: any) {
      toast.error(error.message || error);
    }
  }

  return {
    updateWorkspace,
  };
}


export function useDeleteWorkspace(workspaceId?: number, organizationAlias?: string) {
  async function deleteWorkspace(): Promise<boolean> {
    try {
      if (!organizationAlias) {
        toast.error("Organization alias must be provided.");
        return false;
      }
  
      // Fetch organization ID based on alias
      const { data: orgData, error: orgError } = await supabase
        .from("organization")
        .select("id")
        .eq("organizationAlias", organizationAlias)
        .single();
  
      if (orgError || !orgData) {
        toast.error("Organization not found.");
        return false;
      }
  
      const organizationId = orgData.id;
  
      // Delete dependent records in the events table
      const { error: eventError } = await supabase
        .from("events")
        .delete()
        .eq("organisationId", organizationId);
  
      if (eventError) {
        toast.error("Failed to delete associated events: " + eventError.message);
        return false;
      }
  
      // Delete the organization
      const { error: orgDeleteError, status } = await supabase
        .from("organization")
        .delete()
        .eq("id", organizationId);
  
      if (orgDeleteError) {
        toast.error("Failed to delete organization: " + orgDeleteError.message);
        return false;
      }
  
      if (status === 204 || status === 200) {
        toast.success("Workspace deleted successfully");
        return true;
      } else {
        toast.error("Unexpected status code: " + status);
        return false;
      }
    } catch (error: any) {
      console.log(error.message || error);
      return false;
    }
  }
  

  // async function deleteWorkspace(): Promise<boolean> {
  //   try {
  //     // Ensure either workspaceId or organizationAlias is provided
  //     if (!workspaceId && !organizationAlias) {
  //       toast.error("Either workspace ID or organization alias must be provided.");
  //       return false;
  //     }

  //     // Build the delete query based on available identifier
  //     let query = supabase.from("organization").delete();

  //     if (workspaceId) {
  //       query = query.eq("id", workspaceId);
  //     } else if (organizationAlias) {
  //       query = query.eq("organizationAlias", organizationAlias);
  //     }

  //     const { data, error, status } = await query;

  //     if (error) {
  //       toast.error(error.message);
  //       return false;
  //     }

  //     if (status === 204 || status === 200) {
  //       toast.success("Workspace deleted successfully");
  //       return true;
  //     } else {
  //       toast.error("Unexpected status code: " + status);
  //       return false;
  //     }
  //   } catch (error: any) {
  //     console.log(error.message || error);
  //     return false;
  //   }
  // }

  return {
    deleteWorkspace,
  };
}


export function useCreateDomain(workspaceId: number, workspaceSubdomain: string) {
  async function createDomain() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .update({
          subDomain: workspaceSubdomain
        })
        .eq("id", workspaceId);

      if (error) {
        toast.error(error.message);
        return false;
      }
      if (status === 204 || status === 200) {
        toast.success('Created Successfully');
      }
    } catch (error) {
      console.log(error)
    }
  }
  return {
    createDomain
  };
}

export function useUpdateSubdomain(workspaceId: number, workspaceSubdomain: string) {
  async function updateSubdomain() {
    try {
      const { data, error, status } = await supabase
        .from("organization")
        .update({
          subDomain: workspaceSubdomain
        })
        .eq("id", workspaceId);

      if (error) {
        toast.error(error.message);
        return false;
      }
      if (status === 204 || status === 200) {
        toast.success('SubDomain Updated Successfully');
      }
    } catch (error) {
      console.log(error)
    }
  }
  return {
    updateSubdomain
  };
}


export function useTeamMembers(workspaceAlias?: string) {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //fetch teamMembers
  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching fresh team members for:", workspaceAlias);

      // Fetch from Supabase with no cache issues
      const { data: teamData, error: teamError } = await supabase
        .from("organizationTeamMembers")
        .select("*") // Ensure all fields are fetched
        .eq("workspaceAlias", workspaceAlias);

      if (teamError) throw new Error(teamError.message);
      console.log("Fetched team members:", teamData);

      if (!teamData || teamData.length === 0) {
        setTeamMembers([]);
        setLoading(false);
        return;
      }

      // Fetch user details
      const emails = teamData.map((member) => member.userEmail);
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("userEmail, firstName, lastName, id")
        .in("userEmail", emails);

      if (usersError) throw new Error(usersError.message);
      console.log("Fetched user details:", usersData);

      // Merge user details with team members
      const enrichedTeamMembers = teamData.map((member) => {
        const user = usersData.find((u) => u.userEmail === member.userEmail);
        return {
          id: user?.id, // Ensure this matches the ID used in deletion
          userEmail: member.userEmail,
          userRole: member.userRole,
          userFirstName: user?.firstName || "Unknown",
          userLastName: user?.lastName || "Unknown",
        };
      });

      console.log("Updated team members list:", enrichedTeamMembers);
      setTeamMembers(enrichedTeamMembers);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching team members:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new team member
  async function createTeamMember(newTeamMember: {
    userId: number;
    userEmail: string;
    userRole: string;
  }) {
    try {
      const { data, error } = await supabase
        .from("organizationTeamMembers")
        .insert({
          userId: newTeamMember.userId,
          userEmail: newTeamMember.userEmail,
          userRole: newTeamMember.userRole,
          workspaceAlias, // Scope to the current workspace
        })
        .select()
        .single();

      if (error) {
        toast.error(`Error adding team member: ${error.message}`);
        return;
      }

      setTeamMembers((prev) => [...prev, data]);
      toast.success("Team member added successfully");
      await fetchTeamMembers(); // Fetch latest team members

    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred while adding the team member.");
    }
  }

  async function editTeamMember(memberId: number, updatedMemberData: any) {
    try {
      const { data, error } = await supabase
        .from("organizationTeamMembers")
        .update(updatedMemberData)
        .eq("userId", memberId)
        .select();


      if (error) {
        toast.error(`Error updating team member: ${error.message}`);
        return false;
      }

      toast.success("Team member updated successfully");
      await fetchTeamMembers(); // Fetch latest team members
      return true;
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred while updating the team member.");
      return false;
    }
  }


  // Delete a team member
  async function deleteTeamMember(memberId: string) {
    try {
      console.log("Attempting to delete team member with ID:", memberId);

      // Delete from Supabase
      const { error } = await supabase
        .from("organizationTeamMembers")
        .delete()
        .eq("userId", memberId); // Ensure you're deleting with the correct column

      if (error) {
        toast.error(`Error deleting team member: ${error.message}`);
        return false;
      }

      // Immediately update UI
      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));

      // Fetch fresh data from Supabase to prevent stale cache
      await fetchTeamMembers();

      toast.success("Team member deleted successfully");
      return true;
    } catch (error) {
      console.error("Unexpected error deleting team member:", error);
      toast.error("An unexpected error occurred while deleting the team member.");
      return false;
    }
  }

  // Select a team member for editing
  function selectTeamMemberForEditing(memberId: number) {
    const memberToEdit = teamMembers.find((member) => member.id === memberId);
    console.log("Selected Member:", memberToEdit);
    if (!memberToEdit) {
      console.error("Member not found!");
      return;
    }
    setEditingTeamMember(memberToEdit);
  }

  function resetEditingState() {
    setEditingTeamMember(null);
  }

  useEffect(() => {
    fetchTeamMembers();
  }, [workspaceAlias]);

  return {
    teamMembers,
    createTeamMember,
    editTeamMember,
    deleteTeamMember,
    editingTeamMember,
    resetEditingState,
    selectTeamMemberForEditing,
  };
}



