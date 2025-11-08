'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { NotificationBell } from '@/components/notification-bell'
import { CartCount } from '@/components/cart-count'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<'school' | 'staff' | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  /**
   * Check if a navigation link is active
   * @param path - The path to check
   * @returns true if the path matches the current pathname
   */
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(path)
  }

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)

      if (session) {
        // Get user role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        setUserRole(profile?.role || null)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session)
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        setUserRole(profile?.role || null)
      } else {
        setUserRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserRole(null)
    router.push('/')
    router.refresh()
  }

  const getDashboardLink = () => {
    if (userRole === 'school') return '/dashboard/school'
    if (userRole === 'staff') return '/dashboard/staff'
    return '/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            School Staff
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/for-schools"
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive('/for-schools')
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                >
                  For Schools
                </Link>
                <Link
                  href="/for-staff"
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive('/for-staff')
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                >
                  For Staff
                </Link>
                <Link
                  href="/how-it-works"
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive('/how-it-works')
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                >
                  How It Works
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            ) : userRole === 'school' ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/school/staff">
                  <Button variant="ghost" size="sm">
                    Find Staff
                  </Button>
                </Link>
                <Link href="/dashboard/school/timesheets">
                  <Button variant="ghost" size="sm">
                    Timesheets
                  </Button>
                </Link>
                <CartCount />
                <NotificationBell />
                <Link href="/dashboard/school">
                  <Button variant="ghost" size="sm">
                    Account
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : userRole === 'staff' ? (
              <>
                <Link href={getDashboardLink()}>
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/staff/availability">
                  <Button variant="ghost" size="sm">
                    Availability
                  </Button>
                </Link>
                <NotificationBell />
                <Link href="/dashboard/staff">
                  <Button variant="ghost" size="sm">
                    Account
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/onboarding">
                  <Button variant="ghost" size="sm">
                    Complete Setup
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/for-schools"
                  className={cn(
                    'block text-sm font-medium transition-colors',
                    isActive('/for-schools')
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  For Schools
                </Link>
                <Link
                  href="/for-staff"
                  className={cn(
                    'block text-sm font-medium transition-colors',
                    isActive('/for-staff')
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  For Staff
                </Link>
                <Link
                  href="/how-it-works"
                  className={cn(
                    'block text-sm font-medium transition-colors',
                    isActive('/how-it-works')
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  How It Works
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </>
            ) : userRole === 'school' ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link
                  href="/dashboard/school/request"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Request Staff
                  </Button>
                </Link>
                <Link href="/dashboard/school" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Account
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                >
                  Logout
                </Button>
              </>
            ) : userRole === 'staff' ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Dashboard
                  </Button>
                </Link>
                <Link
                  href="/dashboard/staff/availability"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Availability
                  </Button>
                </Link>
                <Link href="/dashboard/staff" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Account
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/onboarding" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Complete Setup
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
