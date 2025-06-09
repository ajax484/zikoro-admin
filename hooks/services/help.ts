import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";


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


export function useFetchArticle(id: number) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetchArticle();
  }, []);

  async function fetchArticle() {
    try {
      setLoading(true);
      // Fetch the event by ID
      const { data, error: fetchError } = await supabase
        .from("support")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        toast.error(fetchError.message);
        setLoading(false);
        return null;
      }
      setLoading(false);
      setData(data);
    } catch (error) {
      setLoading(false);
      return null;
    }
  }
  return {
    data,
    loading,
    refetch: fetchArticle,
  };
}