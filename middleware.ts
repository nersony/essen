// middleware.ts
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for the admin area
  if (pathname.startsWith('/admin')) {
    // Don't apply middleware to the login page itself to avoid loops
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Check for the token
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET || "THIS_IS_AN_EXAMPLE_SECRET_THAT_SHOULD_BE_CHANGED"
    })

    // If no token, redirect to login
    if (!token) {
      const url = new URL('/admin/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Only run middleware on admin routes
export const config = {
  matcher: ['/admin/:path*'],
}