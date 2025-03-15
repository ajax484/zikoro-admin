import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};



// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req, res });

//   // Check session data
//   const {
//     data: { session },
//     error,
//   } = await supabase.auth.getSession();

//   // If user is on the index page and not logged in, allow them to stay
//   if (req.nextUrl.pathname === "/" && !session) {
//     return res;
//   }

//   // If user tries to access other pages without being logged in, redirect to /login
//   if (!session) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return res;
// }

// // Target only the index page for session check
// export const config = {
//   matcher: ["/", "/((?!_next|favicon\\.ico|public|api/).*)"],
// };


