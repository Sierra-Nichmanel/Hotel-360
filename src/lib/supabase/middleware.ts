import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake can make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    request.nextUrl.pathname !== "/"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, {
        path: cookie.path,
        domain: cookie.domain,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        expires: cookie.expires,
        sameSite: cookie.sameSite,
      });
    });
    return response;
  }

  // Subscription Enforcement Logic
  if (user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("hotels(subscription_status)")
      .eq("id", user.id)
      .single();

    const status = (profile?.hotels as any)?.subscription_status;
    const isRestrictedPath = !request.nextUrl.pathname.startsWith("/dashboard/subscription");

    if (status === "onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      const response = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          expires: cookie.expires,
          sameSite: cookie.sameSite,
        });
      });
      return response;
    }

    if (status === "pending_payment") {
      const url = request.nextUrl.clone();
      url.pathname = "/checkout";
      const response = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          expires: cookie.expires,
          sameSite: cookie.sameSite,
        });
      });
      return response;
    }

    if (isRestrictedPath && (status === "expired" || status === "suspended" || status === "inactive")) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/subscription";
      url.searchParams.set("error", "subscription_required");
      const response = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          expires: cookie.expires,
          sameSite: cookie.sameSite,
        });
      });
      return response;
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({
  //      request,
  //    })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
