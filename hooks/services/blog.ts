import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useFetchBlogPosts() {
    const [loading, setLoading] = useState(false);
    const [blogPosts, setBlogPosts] = useState<any[]>([]); // Store fetched data

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    async function fetchBlogPosts() {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("blog").select("*").eq("status", "publish").order("created_at", { ascending: false })
            if (error) throw error;
            setBlogPosts(data || []);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setLoading(false);
        }
    }

    return { blogPosts, loading, fetchBlogPosts };
}
