import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware configuration to protect specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request) {
  // Retrieve the token (which acts as session data) from the request
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  console.log('Token retrieved in middleware:', token);

  // Check if the user is authenticated (based on the presence of a token)
  if (token) {
    // If authenticated, redirect from sign-in, sign-up, or home pages to dashboard
    if (
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else {
    // If not authenticated and trying to access dashboard, redirect to sign-in
    if (url.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}
