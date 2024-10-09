'use client'
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware configuration to protect specific routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
    '/posts',
    '/upload',
    '/create',
  ],
};

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  console.log("Token retrieved in middleware:", token); // Log the token

  if (token) {
    // User is authenticated
    const name = token.username; // Access username only if token is not null
    console.log('Authenticated Username:', name); // Log username

    // If authenticated, redirect from sign-in, sign-up, or verify pages to dashboard
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If not authenticated and trying to access restricted pages, redirect to sign-in
    if (
      url.pathname.startsWith('/dashboard') ||
      url.pathname.startsWith('/posts') ||
      url.pathname.startsWith('/upload') ||
      url.pathname === '/create'
    ) {
      console.log('Redirecting to sign-in'); // Log the redirect action
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}
