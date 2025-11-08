import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth'
import { Calendar, Users, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const profile = await requireRole('school')
  const supabase = await createClient()

  // Get booking stats
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', profile.school_id)

  const { count: pendingBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('school_id', profile.school_id)
    .eq('status', 'pending')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile.full_name || 'User'}
        </h1>
        <p className="text-gray-600">
          Manage your staff bookings and requests from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingBookings || 0}</p>
            </div>
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Quick Actions</p>
              <Link href="/dashboard/book">
                <Button size="sm" className="mt-2">
                  Request Staff
                </Button>
              </Link>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
        <p className="text-gray-600">No recent bookings. Start by requesting staff.</p>
        <Link href="/dashboard/book">
          <Button className="mt-4">Request Staff</Button>
        </Link>
      </Card>
    </div>
  )
}

