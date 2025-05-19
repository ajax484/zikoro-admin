import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function useFetchHelpArticles() {
    const [loading, setLoading] = useState(false);
    const [articles, setArticles] = useState<any[]>([]); // Store fetched data

    useEffect(() => {
        fetchHelpArticles();
    }, []);

    async function fetchHelpArticles() {
        try {
            setLoading(true);
            const { data, error } = await supabase.from("support").select("*")
            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error("Error fetching articles:", error);
        } finally {
            setLoading(false);
        }
    }

    return { articles, loading, fetchHelpArticles };
}
