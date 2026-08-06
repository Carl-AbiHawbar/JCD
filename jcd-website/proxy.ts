import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth cookie on admin requests so a long-lived tab
 * does not fall off its session. Access control itself lives in lib/auth.ts.
 *
 * The response is created with `NextResponse.next()` and no argument on
 * purpose. Passing `{ request }` here forwards a rewritten header set
 * downstream, and that stripped the auth cookie from server actions: the
 * proxy could see it on the incoming POST while `cookies()` inside the action
 * saw nothing, so every save bounced to the login page. A refreshed token is
 * written to the browser via the response; this request keeps using the token
 * it arrived with, which is still valid.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Before .env.local exists there is no session to refresh.
  if (!url || !anonKey) return NextResponse.next();

  const response = NextResponse.next();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
