import { NextRequest, NextResponse } from 'next/server'
import { AUTH_ROLE, AUTH_TOKEN } from 'shared/constants/env'

export async function middleware(req: NextRequest) {
  const { cookies, nextUrl, url } = req
  const token = cookies.get(AUTH_TOKEN)?.value
  // const role = cookies.get(AUTH_ROLE)?.value
  // console.log('Checking Auth:', token, role)
  const protectedRoutes: Record<string, string> = {
    '/buyer': 'buyer',
    '/seller': 'seller',
    '/agent': 'agent',
    '/partner-dashboard': 'agent',
    '/dashboard': 'buyer'
  }

  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    nextUrl.pathname.startsWith(route)
  )

  if (matchedRoute) {
    const requiredRole = protectedRoutes[matchedRoute]
    if (!token) {
      return NextResponse.redirect(
        new URL(
          `/`,
          url
        )
      )
    }
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/requests',
    '/dashboard/:path*',
    '/buyer/:path*',
    '/seller/:path*',
    '/agent/:path*',
    '/partner-dashboard',
    '/dashboard/:path*'
  ]
}
