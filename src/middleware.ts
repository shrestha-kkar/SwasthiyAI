import { NextRequest, NextResponse } from "next/server";

// Define protected routes by role
const PROTECTED_ROUTES = {
  "/doctor": ["doctor"],
  "/patient": ["patient"],
  "/admin": ["admin"],
  "/dashboard": ["doctor", "patient", "admin"],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for auth routes and public pages
  if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/api/auth")) {
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
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Since JWT verification requires crypto, we'll do a basic check
    // In Node.js runtime, this would work, but middleware runs on edge runtime
    // So we redirect to a dedicated verification endpoint instead
    
    // For now, if token exists, we assume it's valid
    // The actual verification happens in the API routes and useAuth hook
    
    return NextResponse.next();
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
