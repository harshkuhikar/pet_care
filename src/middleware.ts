import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_PREFIXES = ["/profile", "/checkout", "/welcome"];

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return new TextEncoder().encode("pawswell_dev_fallback_secret_key_32_bytes_minimum!");
  }
  return new TextEncoder().encode(secret);
}

// Safely validate that a redirect target is a same-origin relative path
export function isValidRelativePath(urlPath: string): boolean {
  if (!urlPath) return false;
  // Must start with single slash, not double slash (protocol-relative URL attack)
  if (!urlPath.startsWith("/")) return false;
  if (urlPath.startsWith("//")) return false;
  if (urlPath.includes("\\")) return false;
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Check if route requires user authentication
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  let isAuthenticated = false;
  const sessionCookie = request.cookies.get("pawswell_session")?.value;

  if (sessionCookie) {
    try {
      const secretKey = getSecretKey();
      const { payload } = await jwtVerify(sessionCookie, secretKey, {
        algorithms: ["HS256"],
      });
      if (payload?.accountId) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // If accessing a protected route without valid auth, redirect to login
  if (isProtected && !isAuthenticated) {
    const fullPath = pathname + search;
    const redirectUrl = new URL("/login", request.url);
    if (isValidRelativePath(fullPath)) {
      redirectUrl.searchParams.set("next", fullPath);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Add security headers to response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self)"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, sitemap, robots
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|icons/|api/).*)",
  ],
};
