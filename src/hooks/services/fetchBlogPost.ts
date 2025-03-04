// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { useEffect, useState } from "react";

// const supabase = createServerComponentClient({ cookies });

// export function useFetchAllBlogPost() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any | null>(null);

//   useEffect(() => {
//     fetchAllBlogPost();
//   }, []);

//   async function fetchAllBlogPost() {
//     try {
//       setLoading(true);
//       // Fetch the event by ID
//       const { data, error: fetchError } = await supabase
//         .from("blog")
//         .select()
//         .eq("status", "publish")
//         .order("created_at", { ascending: false });

//       if (fetchError) {
//         console.log(fetchError.message);
//         setLoading(false);
//         return null;
//       }
//       setLoading(false);
//       setData(data);
//     } catch (error) {
//       setLoading(false);
//       return null;
//     }
//   }
//   return {
//     data,
//     loading,
//     refetch: fetchAllBlogPost,
//   };
// }


// export function useFetchEventsBlogPost() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any | null>(null);

//   useEffect(() => {
//     fetchEventsBlogPost();
//   }, []);

//   async function fetchEventsBlogPost() {
//     try {
//       setLoading(true);
//       // Fetch the event by ID
//       const { data, error: fetchError } = await supabase
//         .from("blog")
//         .select()
//         .eq("status", "publish")
//         .eq('category', 'event')
//         .order("created_at", { ascending: false });

//       if (fetchError) {
//         console.log(fetchError.message);
//         setLoading(false);
//         return null;
//       }
//       setLoading(false);
//       setData(data);
//     } catch (error) {
//       setLoading(false);
//       return null;
//     }
//   }
//   return {
//     data,
//     loading,
//     refetch: fetchEventsBlogPost,
//   };
// }


// export function useFetchCaseBlogPost() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any | null>(null);

//   useEffect(() => {
//     fetchCaseBlogPost();
//   }, []);

//   async function fetchCaseBlogPost() {
//     try {
//       setLoading(true);
//       // Fetch the event by ID
//       const { data, error: fetchError } = await supabase
//         .from("blog")
//         .select()
//         .eq("status", "publish")
//         .eq("category", "case")
//         .order("created_at", { ascending: false });

//       if (fetchError) {
//         console.log(fetchError.message);
//         setLoading(false);
//         return null;
//       }
//       setLoading(false);
//       setData(data);
//     } catch (error) {
//       setLoading(false);
//       return null;
//     }
//   }
//   return {
//     data,
//     loading,
//     refetch: fetchCaseBlogPost,
//   };
// }

// export function useFetchProductBlogPost() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any | null>(null);

//   useEffect(() => {
//     fetchProductBlogPost();
//   }, []);

//   async function fetchProductBlogPost() {
//     try {
//       setLoading(true);
//       // Fetch the event by ID
//       const { data, error: fetchError } = await supabase
//         .from("blog")
//         .select()
//         .eq("status", "publish")
//         .eq('category', 'Product')
//         .order("created_at", { ascending: false });

//       if (fetchError) {
//         console.log(fetchError.message);
//         setLoading(false);
//         return null;
//       }
//       setLoading(false);
//       setData(data);
//     } catch (error) {
//       setLoading(false);
//       return null;
//     }
//   }
//   return {
//     data,
//     loading,
//     refetch: fetchProductBlogPost,
//   };
// }

// export function useFetchGuideBlogPost() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any | null>(null);

//   useEffect(() => {
//     fetchGuideBlogPost();
//   }, []);

//   async function fetchGuideBlogPost() {
//     try {
//       setLoading(true);
//       // Fetch the event by ID
//       const { data, error: fetchError } = await supabase
//         .from("blog")
//         .select()
//         .eq("status", "publish")
//         .eq("category", "guide")
//         .order("created_at", { ascending: false });

//       if (fetchError) {
//         console.log(fetchError.message);
//         setLoading(false);
//         return null;
//       }
//       setLoading(false);
//       setData(data);
//     } catch (error) {
//       setLoading(false);
//       return null;
//     }
//   }
//   return {
//     data,
//     loading,
//     refetch: fetchGuideBlogPost,
//   };
// }

