import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";


const publicPaths: string[] = [
  "/login",
  "/forgot-password",
  "/update-password",
  "/verify-email",
  "/auth/callback",
];

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const path = request.nextUrl.pathname;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if the request path is a public path
    const isPublicPath = publicPaths.some((publicPath) =>
      path === publicPath || path.startsWith(publicPath + "/")
    );

    if (!isPublicPath) {
      if (!user) {
        // If user is not authenticated and path is not public, redirect/reject
        if (path.startsWith("/api")) {
          return NextResponse.json(
            { error: "Authorization failed: Authenticated user required" },
            { status: 401 }
          );
        } else {
          const redirectUrl = new URL("/login", request.url);
          redirectUrl.searchParams.set("redirectedFrom", path);
          return NextResponse.redirect(redirectUrl);
        }
      }

      // Check if user is a platform admin
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("userEmail", user.email)
        .maybeSingle();

      const isAdmin = userData && userData.role === 'admin';


      if (!isAdmin) {
        // Sign out non-admins and redirect them to login with error query
        await supabase.auth.signOut();
        
        if (path.startsWith("/api")) {
          return NextResponse.json(
            { error: "Access denied: Platform Administrator role required" },
            { status: 403 }
          );
        } else {
          const redirectUrl = new URL("/login", request.url);
          redirectUrl.searchParams.set("error", "unauthorized");
          return NextResponse.redirect(redirectUrl);
        }
      }
    }

    return response;
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
