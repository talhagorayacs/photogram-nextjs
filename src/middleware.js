import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Retrieve the token
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If a token exists and the user is trying to access sign-in, sign-up, or verify pages, redirect to /home
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // If no token exists and the user is trying to access protected routes (like /dashboard), redirect to sign-in page
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow the request to proceed if no conditions are met
  return NextResponse.next();
}

// Matching the routes for middleware
export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard/:path*", "/verify/:path*"],
};
