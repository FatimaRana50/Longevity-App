import { NextResponse, type NextRequest } from 'next/server'

const APP_ROUTES = ['/today', '/explore', '/journal', '/insights', '/profile', '/share', '/couples', '/onboarding', '/friends']
const AUTH_ROUTES = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const path = request.nextUrl.pathname

  const isAppRoute = APP_ROUTES.some(r => path.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.includes(path)

  if (!token && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/today', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
