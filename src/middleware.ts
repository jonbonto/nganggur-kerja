import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();

  if (!token) {
    // Redirect unauthenticated users to login
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/jobs/post') && token.role !== 'employer') {
    // Restrict access to job posting page for non-employers
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

   // Optionally, add additional route checks (for example, for admin routes)
   if (url.pathname.startsWith('/admin') && token.role !== 'admin') {
    url.pathname = '/unauthorized';  // Redirect to unauthorized if the user is not an admin
    return NextResponse.redirect(url);
  }

  // Check if the user has an 'admin' role to access admin routes
  if (url.pathname.startsWith('/api/admin') && token.role !== 'admin') {
    return NextResponse.json(
      { message: 'You do not have permission to access this page.' },
      { status: 403 } // Forbidden
    );
  }

  return NextResponse.next();
}

export const config = {
    matcher: [
        '/jobs/post/:path*',      // Apply to job posting routes
    '/dashboard/:path*',           // Protect dashboard routes
    '/admin/:path*',               // Admin-related routes (if any)
    '/api/admin/:path*',               // API Admin-related routes (if any)
    ],
};
