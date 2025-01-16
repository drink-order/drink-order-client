import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define the user roles
type UserRole = 'admin' | 'shopOwner' | 'staff';

// Define the expected structure of the token
interface Token {
  role: UserRole;
}

// Define role-based access and redirection
const roleRedirects: Record<UserRole, string> = {
  admin: '/admin',
  shopOwner: '/shop-owner',
  staff: '/staff',
};

// Define restricted routes
const restrictedRoutes = [
  "/admin/:path*", 
  "/shop-owner/:path*", 
  "/staff/:path*"
];

// Middleware function
export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.nextauth?.token as unknown as Token | null;

    // If the user is not authenticated and they try to access a restricted route, redirect to /sign-in
    if (!token && restrictedRoutes.some(route => path.startsWith(route))) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    // User is authenticated, check their role and redirect to the appropriate path if needed
    if (token) {
      const userRole = token.role;
      const redirectPath = roleRedirects[userRole];

      // Check if the user is accessing an authorized route
      if (path.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
      if (path.startsWith('/shop-owner') && userRole !== 'shopOwner') {
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
      if (path.startsWith('/staff') && userRole !== 'staff') {
        return NextResponse.redirect(new URL(redirectPath, req.url));
      }
    }

    // Allow the request to proceed if no redirection is needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        // Allow access only if the user has a valid token and has a role
        return !!token?.role;
      },
    },
  }
);

// Define matcher for routes
export const config = {
  matcher: [
    "/admin/:path*", 
    "/shop-owner/:path*", 
    "/staff/:path*"
  ],
};
