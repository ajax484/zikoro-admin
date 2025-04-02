// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// export async function fetchBlogPosts() {
//     const { data, error } = await supabase.from("blog").select("*");
//     if (error) throw error;
//     return data;
// }

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
      const { data, error } = await supabase.from("blog").select("*");
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
