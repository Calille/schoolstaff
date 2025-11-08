import { Card } from '@/components/ui/card'
import { requireRole, getStaffProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function StaffDashboardPage() {
  const profile = await requireRole('staff')
  const staffProfile = await getStaffProfile()
  const supabase = await createClient()

  // Check compliance status
  const { data: complianceStatus } = await supabase
    .from('staff_compliance_status')
    .select('is_compliant')
    .eq('staff_id', profile.id)
    .single()

  const isCompliant = complianceStatus?.is_compliant ?? false

  // Get pending requests count
  const { count: pendingCount } = await supabase
    .from('staff_requests')
    .select('*', { count: 'exact', head: true })
    .eq('staff_id', profile.id)
    .eq('status', 'pending')

  // Get accepted requests count
  const { count: acceptedCount } = await supabase
    .from('staff_requests')
    .select('*', { count: 'exact', head: true })
    .eq('staff_id', profile.id)
    .eq('status', 'accepted')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {profile.full_name}</p>
      </div>

      {!isCompliant && (
        <Card className="mb-6 border-red-500 bg-red-50">
          <div className="flex items-start gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold mb-1">
                Your profile is not currently eligible for school placements.
              </p>
              <p className="text-red-700 text-sm">
                Please upload and verify all required compliance documents.{' '}
                <Link href="/dashboard/staff/compliance" className="underline font-medium">
                  Go to Compliance
                </Link>
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Requests</h3>
          <p className="text-3xl font-bold text-gray-900">{pendingCount || 0}</p>
          <p className="text-sm text-gray-600 mt-2">Awaiting your response</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Accepted Requests</h3>
          <p className="text-3xl font-bold text-gray-900">{acceptedCount || 0}</p>
          <p className="text-sm text-gray-600 mt-2">Confirmed placements</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/dashboard/staff/requests">
              <Button variant="outline" className="w-full justify-start">
                View Requests
              </Button>
            </Link>
            <Link href="/dashboard/staff/availability">
              <Button variant="outline" className="w-full justify-start">
                Manage Availability
              </Button>
            </Link>
            <Link href="/dashboard/staff/compliance">
              <Button variant="outline" className="w-full justify-start">
                Compliance Documents
              </Button>
            </Link>
            <Link href="/dashboard/staff/timesheets">
              <Button variant="outline" className="w-full justify-start">
                Timesheets
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Status</h3>
          {isCompliant ? (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600"></div>
              <p className="text-sm text-gray-900">All documents verified</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-600"></div>
                <p className="text-sm text-gray-900">Documents pending verification</p>
              </div>
              <Link href="/dashboard/staff/compliance">
                <Button size="sm" variant="outline">
                  Upload Documents
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
