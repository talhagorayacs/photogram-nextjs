"use client";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/",
    "/verify/:path*",
    "/posts",
    "/upload",
    "/create",
  ],
};

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  console.log("Token retrieved in middleware:", token);

  if (token) {
    const name = token.username;
    console.log("Authenticated Username:", name);

    if (
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (
      url.pathname.startsWith("/dashboard/:path*") ||
      url.pathname.startsWith("/posts") ||
      url.pathname.startsWith("/upload") ||
      url.pathname === "/create"
    ) {
      console.log("Redirecting to sign-in");
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}
