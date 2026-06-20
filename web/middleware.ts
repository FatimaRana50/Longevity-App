import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const appRoutes = ['/today', '/explore', '/journal', '/profile', '/share', '/couples', '/onboarding']
  const isAppRoute = appRoutes.some(r => request.nextUrl.pathname.startsWith(r))
  const isAuthRoute = ['/login', '/signup'].includes(request.nextUrl.pathname)

  if (!user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/today', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
