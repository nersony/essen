// middleware.ts
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for the admin area
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    // Check for the token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "THIS_IS_AN_EXAMPLE_SECRET_THAT_SHOULD_BE_CHANGED",
    })

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url)
      // Add the original URL as a callback parameter
      return NextResponse.redirect(loginUrl)
    }

    // Check user role if needed
    if (token.role !== "admin" && token.role !== "super_admin") {
      // If not admin or super_admin, redirect to home
      const homeUrl = new URL("/", request.url)
      return NextResponse.redirect(homeUrl)
    }
  }

  return NextResponse.next()
}

// Only run middleware on admin routes
export const config = {
  matcher: ["/admin/:path*"],
}
