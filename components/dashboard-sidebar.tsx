'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BookOpen, Calendar, Users, Settings } from 'lucide-react'

interface DashboardSidebarProps {
  role: 'school' | 'admin'
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname()

  const schoolLinks = [
    { href: '/dashboard/school', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/school/staff', label: 'Find Staff', icon: Users },
    { href: '/dashboard/school/requests', label: 'My Requests', icon: Calendar },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/staff', label: 'Staff Management', icon: Users },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  ]

  const links = role === 'admin' ? adminLinks : schoolLinks

  return (
    <aside className="w-64 border-r bg-gray-50 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          {role === 'admin' ? 'Admin' : 'School'} Dashboard
        </h2>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

