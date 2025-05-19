import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

type PostHelpRequestBody = {
    title: string;
    category: string;
    content: [];
};

export async function POST(req: NextRequest) {
    const supabase = createClient();

    if (req.method === "POST") {
        const body = (await req.json()) as PostHelpRequestBody | null;

        if (!body) {
            return NextResponse.json({ error: "Invalid request body" });
        }

        const {
            title,
            category,
            content,
        } = body;

        try {
            const { data, error } = await supabase.from("support").insert([
                {
                    title: title,
                    productCategory: category,
                    Details: content,
                    lastEditedDate: Date.now()
                },
            ]);

            if (error) {
                throw error;
            }

            return NextResponse.json({ message: "Saved successfully." });
        } catch (error) {
            return NextResponse.json({ error: "Internal server error." });
        }
    } else {
        NextResponse.json({ error: "Method Not Allowed" });
    }
}


export const dynamic = "force-dynamic";
