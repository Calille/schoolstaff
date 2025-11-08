import { requireRole } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, Calendar, Shield, Receipt, Users } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole('admin')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Operations Dashboard
              </Link>
              <div className="flex space-x-4">
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                </Link>
                <Link href="/admin/requests/open">
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Open Requests
                  </Button>
                </Link>
                <Link href="/admin/daily-sheet">
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Daily Sheet
                  </Button>
                </Link>
                <Link href="/admin/compliance">
                  <Button variant="ghost" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Compliance
                  </Button>
                </Link>
                <Link href="/admin/invoicing">
                  <Button variant="ghost" size="sm">
                    <Receipt className="h-4 w-4 mr-2" />
                    Invoicing
                  </Button>
                </Link>
                <Link href="/admin/payroll">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Payroll
                  </Button>
                </Link>
              </div>
            </div>
            <div className="text-sm text-gray-600">Admin Portal</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
