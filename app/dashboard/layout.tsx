import { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { requireRole } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const profile = await requireRole('school')

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar role="school" />
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

