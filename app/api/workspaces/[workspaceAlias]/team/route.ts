
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SendMailClient } from "zeptomail";

export async function GET(
  req: NextRequest,
  { params: { workspaceAlias } }: { params: { workspaceAlias: number } },
) {
  const supabase = createClient();

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url || "");

      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);

      console.log(page, limit);

      if (isNaN(page) || isNaN(limit)) {
        console.log("invalid pagination parameters");
        return NextResponse.json(
          { error: "Invalid pagination parameters" },
          { status: 400 },
        );
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("organisationTeamMembers_Inventory")
        .select("*, user:users(*)", { count: "exact" })
        .eq("workspaceAlias", workspaceAlias)
        .order("created_at", { ascending: true })
        .range(from, to);

      console.log(data, "data");

      if (error) throw error;

      return NextResponse.json(
        {
          data: {
            data,
            page,
            limit,
            total: count,
            totalPages: Math.ceil((count || 0) / limit),
          },
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "An error occurred while making the request.",
        },
        {
          status: 500,
        },
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export async function POST(
  req: NextRequest,
  { params: { workspaceAlias } }: { params: { workspaceAlias: number } },
) {
  const supabase = createClient();

  try {
    const payload = await req.json();
    const {
      userEmail,
      userRole,
      workspaceAlias,
      status = "accepted",
      userId,
    } = payload;

    // Check if user is already a team member and if there are already 5 members
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from("organisationTeamMembers_Inventory")
      .select("*")
      .eq("workspaceAlias", workspaceAlias);

    if (teamMembersError) throw teamMembersError;

    if (teamMembers && teamMembers.length >= 5) {
      return NextResponse.json(
        { error: "You can only have 5 team members" },
        { status: 400 },
      );
    }

    // check if user is already a team member
    const isTeamMember = teamMembers?.some(
      (teamMember) => teamMember.userEmail === userEmail,
    );

    if (isTeamMember) {
      return NextResponse.json(
        { error: "User is already a team member" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("organisationTeamMembers_Inventory")
      .insert({
        userEmail,
        userRole,
        workspaceAlias,
        userId,
        status, // Default to 'accepted' for direct addition, or 'pending' for invitations
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        data,
        message: "Team member added successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Team POST error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while making the request.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params: { workspaceAlias } }: { params: { workspaceAlias: number } },
) {
  const supabase = createClient();
  const payload = await req.json();

  try {
    // If we have an id, we can update. Otherwise we might need to match by email and workspace
    const { id, ...updateData } = payload;

    let query = supabase
      .from("organisationTeamMembers_Inventory")
      .update(updateData);

    if (id) {
      query = query.eq("id", id);
    } else if (payload.userEmail && payload.workspaceAlias) {
      query = query
        .eq("userEmail", payload.userEmail)
        .eq("workspaceAlias", payload.workspaceAlias);
    } else {
      return NextResponse.json(
        { error: "Missing identifier for update" },
        { status: 400 },
      );
    }

    const { data, error } = await query.select("*");

    if (error) throw error;

    return NextResponse.json(
      { data, message: "Member updated successfully" },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Team PATCH error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while making the request.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params: { workspaceAlias } }: { params: { workspaceAlias: number } },
) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const { error } = await supabase
      .from("organisationTeamMembers_Inventory")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { message: "Member removed successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Team DELETE error:", error);
    return NextResponse.json(
      { error: "An error occurred while making the request." },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
