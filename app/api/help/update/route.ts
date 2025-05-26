import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type DraftRequestBody = {
    id: number;
    title: string;
    category: string;
    content: any[];
};

const supabase = createClient();

//UPDATE Funtionality
export async function PUT(req: NextRequest) {
    if (req.method === "PUT") {
        const body = (await req.json()) as DraftRequestBody | null;

        if (!body) {
            return NextResponse.json({ error: "Invalid request body" });
        }
        const {
            id,
            title,
            category,
            content,
        } = body;


        try {
            const { data, error } = await supabase
                .from("support")
                .update({
                    title,
                    productCategory: category,
                    Details: content,
                })
                .eq("id", id);

            if (error) {
                throw error;
            }
            return NextResponse.json(data);
        } catch (error: any) {
            console.error("Error updating blog post:", error.message);
            NextResponse.json({ message: "Internal server error" });
        }
    } else {
        return NextResponse.json({ error: "Method not allowed" });
    }
}