import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default async function StaffCalendarPage() {
  const profile = await requireRole('staff')
  const supabase = await createClient()

  // Check if Google Calendar is connected
  const { data: calendarConnection } = await supabase
    .from('external_calendars')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('provider', 'google')
    .single()

  // Get accepted bookings
  const { data: bookings } = await supabase
    .from('staff_requests')
    .select(`
      *,
      school:schools (
        school_name
      )
    `)
    .eq('staff_id', profile.id)
    .eq('status', 'accepted')
    .order('created_at', { ascending: false })

  const isConnected = !!calendarConnection

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
        <p className="text-gray-600">
          View your bookings and sync with Google Calendar
        </p>
      </div>

      {/* Google Calendar Connection */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CalendarIcon className="h-8 w-8 text-gray-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Google Calendar Sync
              </h2>
              <p className="text-sm text-gray-600">
                {isConnected
                  ? 'Connected - Your bookings will sync automatically'
                  : 'Connect your Google Calendar to sync bookings'}
              </p>
            </div>
          </div>
          {isConnected ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          ) : (
            <Link href={`/api/auth/google/start?profile_id=${profile.id}`}>
              <Button>Connect Google Calendar</Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Accepted Bookings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Accepted Bookings
        </h2>
        {!bookings || bookings.length === 0 ? (
          <p className="text-gray-600">No accepted bookings yet</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const schoolData = Array.isArray(booking.school)
                ? booking.school[0]
                : booking.school

              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {schoolData?.school_name || 'School'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Request ID: {booking.id.slice(0, 8)}...
                    </p>
                    {booking.paid && (
                      <Badge variant="default" className="mt-1">
                        Paid
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

