import { createClient } from "@/utils/supabase/server";
import { logAuditEvent } from "@/utils/auditLog";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
const supabase = createClient();

  if (req.method === "GET") {
    try {
      const { searchParams } = new URL(req.url || "");
      const workspaceAlias = searchParams.get("workspaceAlias");
      console.log(workspaceAlias);
      const page = parseInt(searchParams.get("page") || "1", 10);
      const limit = parseInt(searchParams.get("limit") || "10", 10);

      console.log(page, limit);

      if (isNaN(page) || isNaN(limit)) {
        console.log("invalid pagination parameters");
        return NextResponse.json(
          { error: "Invalid pagination parameters" },
          { status: 400 }
        );
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("organizationVerification")
        .select("*, workspace:organization!inner(*)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

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
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "An error occurred while making the request.",
        },
        {
          status: 500,
        }
      );
    }
  } else {
    return NextResponse.json({ error: "Method not allowed" });
  }
}

export async function POST(req: NextRequest) {
const supabase = createClient();

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const bodyParams = await req.json();

    const { data, error } = await supabase
      .from("organizationVerification")
      .insert({
        ...bodyParams,
      })
      .select("*")
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(
      {
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the request.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = createClient();

  if (req.method !== "PATCH") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { workspaceAlias, adminUserId, adminEmail, reason, ...updateFields } = await req.json();

    // Fetch before state for audit log
    const { data: before } = await supabase
      .from("organizationVerification")
      .select("*")
      .eq("workspaceAlias", workspaceAlias)
      .maybeSingle();

    const { data, error } = await supabase
      .from("organizationVerification")
      .update(updateFields)
      .eq("workspaceAlias", workspaceAlias)
      .select("*, workspace:organization!inner(*)")
      .maybeSingle();

    if (error) throw error;

    // Log audit event if status changed
    if (updateFields.status && before?.status !== updateFields.status) {
      await logAuditEvent(supabase, {
        actorId: adminUserId,
        actorEmail: adminEmail,
        organizationAlias: workspaceAlias,
        entityType: "verification",
        entityId: workspaceAlias,
        action: updateFields.status === "verified" ? "approve_verification" : "reject_verification",
        beforeData: before,
        afterData: data,
        reason: reason || null,
      });
    }

    return NextResponse.json(
      {
        data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing the request.",
      },
      {
        status: 500,
      }
    );
  }
}

export const dynamic = "force-dynamic";
