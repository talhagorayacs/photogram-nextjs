import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware configuration to protect specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*', '/posts'],
};

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  console.log("Token retrieved in middleware:", token); // Log the token

  if (token) {
    // User is authenticated
    const name = token.username; // Access username only if token is not null
    console.log('Authenticated Username:', name); // Log username

    // If authenticated, redirect from sign-in, sign-up, or home pages to posts
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'
    ) {
      return NextResponse.redirect(new URL('/posts', request.url));
    }
  } else {
    // If not authenticated and trying to access dashboard, redirect to sign-in
    if (url.pathname.startsWith('/dashboard')) {
      console.log('Redirecting to sign-in'); // Log the redirect action
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}
