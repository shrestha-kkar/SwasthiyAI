import { NextRequest, NextResponse } from "next/server";

// Define protected routes by role
const PROTECTED_ROUTES: Record<string, string[]> = {
  "/dashboard/doctor": ["doctor"],
  "/dashboard/patient": ["patient"],
  "/dashboard/admin": ["admin"],
  "/dashboard": ["doctor", "patient", "admin"],
};

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/login", "/register"];

// API routes that should be skipped by middleware
const API_ROUTES = ["/api/auth", "/api/auth/login", "/api/auth/logout", "/api/auth/me"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public routes and API auth endpoints
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    API_ROUTES.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiredRoles = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  if (!requiredRoles) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    // Redirect to login with return URL for better UX
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // Token exists, allow the request
  // Full JWT verification is done in API routes and client-side hooks
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
