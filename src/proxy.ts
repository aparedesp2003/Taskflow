import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/projects", "/settings"];
const AUTH_ROUTES      = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  // Must be reassignable — setAll replaces this with a new response carrying refreshed cookies
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write refreshed tokens back to the request (for downstream server reads)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Rebuild the response so Set-Cookie headers reach the browser
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() validates the session server-side and refreshes the access token
  // when expired, writing fresh tokens via setAll above.
  // Never use getSession() here — it trusts the cookie without server validation.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthPage  = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  // Guard: skip redirects for paths that are already the redirect destination
  // to eliminate any possibility of a redirect loop.
  if (!user && isProtected && pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage && pathname !== "/dashboard") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match every path except:
     * - _next/static  (Next.js build assets)
     * - _next/image   (image optimisation endpoint)
     * - favicon.ico
     * - Static file extensions (svg, png, jpg, jpeg, gif, webp, ico, woff, woff2)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
