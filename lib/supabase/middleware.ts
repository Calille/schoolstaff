import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables')
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login for protected routes
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check role-based access
  const pathname = request.nextUrl.pathname

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Handle onboarding flow
  if (pathname.startsWith('/onboarding')) {
    // If user has no role, allow access to onboarding
    if (!profile?.role) {
      return supabaseResponse
    }
    // If user has role but is on onboarding page, redirect to dashboard
    if (profile.role === 'school') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/school'
      return NextResponse.redirect(url)
    } else if (profile.role === 'staff') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/staff'
      return NextResponse.redirect(url)
    }
  }

  // Check role for dashboard routes
  if (pathname.startsWith('/dashboard/school')) {
    if (!profile || profile.role !== 'school') {
      const url = request.nextUrl.clone()
      if (!profile?.role) {
        url.pathname = '/onboarding'
      } else {
        url.pathname = '/dashboard/staff'
      }
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith('/dashboard/staff')) {
    if (!profile || profile.role !== 'staff') {
      const url = request.nextUrl.clone()
      if (!profile?.role) {
        url.pathname = '/onboarding'
      } else {
        url.pathname = '/dashboard/school'
      }
      return NextResponse.redirect(url)
    }
  }

  // Legacy dashboard route - redirect based on role
  if (pathname === '/dashboard') {
    const url = request.nextUrl.clone()
    if (!profile?.role) {
      url.pathname = '/onboarding'
    } else if (profile.role === 'school') {
      url.pathname = '/dashboard/school'
    } else if (profile.role === 'staff') {
      url.pathname = '/dashboard/staff'
    } else {
      url.pathname = '/onboarding'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
