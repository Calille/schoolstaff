import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { requireRole, getSchoolProfile } from '@/lib/auth'
import { Calendar, Users, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function SchoolDashboardPage() {
  const profile = await requireRole('school')
  const schoolProfile = await getSchoolProfile()
  const supabase = await createClient()

  // Get booking stats (only if school profile exists)
  const schoolId = schoolProfile?.school?.id
  const totalBookings = schoolId
    ? await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
    : { count: 0 }

  const pendingBookings = schoolId
    ? await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('school_id', schoolId)
        .eq('status', 'pending')
    : { count: 0 }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.full_name || 'User'}
        </h1>
        <p className="text-gray-600">
          {schoolProfile?.school?.school_name || 'School Dashboard'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings.count || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingBookings.count || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quick Actions</p>
              <Link href="/dashboard/school/staff">
                <Button size="sm" className="mt-2">
                  Find Staff
                </Button>
              </Link>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* School Info */}
      {schoolProfile?.school && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">School Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">School Name</p>
              <p className="font-medium text-gray-900">{schoolProfile.school.school_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact Name</p>
              <p className="font-medium text-gray-900">{schoolProfile.school.contact_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">{schoolProfile.school.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Postcode</p>
              <p className="font-medium text-gray-900">{schoolProfile.school.postcode}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="flex gap-4">
          <Link href="/dashboard/school/staff">
            <Button className="mt-4">Find Staff</Button>
          </Link>
          <Link href="/dashboard/school/requests">
            <Button variant="outline" className="mt-4">View Requests</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

