import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { requireRole, getSchoolProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { StaffRequestButton } from '@/components/staff-request-button'
import { Users } from 'lucide-react'
import { StaffFilter } from '@/components/staff-filter'

export default async function SchoolStaffPage({
  searchParams,
}: {
  searchParams?: Promise<{ weekdays?: string }>
}) {
  const profile = await requireRole('school')
  const schoolProfile = await getSchoolProfile()
  const supabase = await createClient()

  // Parse weekdays from search params
  const params = searchParams ? await searchParams : {}
  const selectedWeekdays = params?.weekdays
    ? params.weekdays.split(',').filter((w) => ['mon', 'tue', 'wed', 'thu', 'fri'].includes(w))
    : []

  // Get compliant staff IDs (only show compliant staff by default)
  const { data: complianceData } = await supabase
    .from('staff_compliance_status')
    .select('staff_id')
    .eq('is_compliant', true)

  const compliantStaffIds = complianceData?.map((c) => c.staff_id) || []

  // Fetch compliant staff profiles with their profile info and availability
  let query = supabase
    .from('staff_profiles')
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      ),
      availability:staff_availability_weekdays (
        weekday,
        available
      )
    `)

  // Only show compliant staff
  if (compliantStaffIds.length > 0) {
    query = query.in('id', compliantStaffIds)
  } else {
    // No compliant staff - return empty
    query = query.eq('id', '00000000-0000-0000-0000-000000000000')
  }

  // If weekdays are selected, filter by availability
  if (selectedWeekdays.length > 0) {
    // Get staff IDs who are available for ALL selected weekdays
    const { data: availableStaff } = await supabase
      .from('staff_availability_weekdays')
      .select('staff_id')
      .in('weekday', selectedWeekdays)
      .eq('available', true)

    if (availableStaff && availableStaff.length > 0) {
      // Count occurrences - staff must be available for ALL selected days
      const staffCounts = new Map<string, number>()
      availableStaff.forEach((item) => {
        staffCounts.set(item.staff_id, (staffCounts.get(item.staff_id) || 0) + 1)
      })

      // Filter to only staff available for ALL selected weekdays
      const fullyAvailableStaffIds = Array.from(staffCounts.entries())
        .filter(([_, count]) => count === selectedWeekdays.length)
        .map(([staffId]) => staffId)

      if (fullyAvailableStaffIds.length > 0) {
        query = query.in('id', fullyAvailableStaffIds)
      } else {
        // No staff available for all selected days
        query = query.eq('id', '00000000-0000-0000-0000-000000000000') // Return empty
      }
    } else {
      // No staff available for selected days
      query = query.eq('id', '00000000-0000-0000-0000-000000000000') // Return empty
    }
  }

  const { data: staffProfiles, error } = await query

  if (error) {
    console.error('Error fetching staff:', error)
  }

  const staffList = staffProfiles || []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Staff</h1>
        <p className="text-gray-600">
          Browse available staff members and request bookings
        </p>
      </div>

      {/* Filter Component */}
      <div className="mb-6">
        <StaffFilter selectedWeekdays={selectedWeekdays} />
      </div>

      {staffList.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {selectedWeekdays.length > 0
              ? 'No staff members available for the selected days'
              : 'No staff members available at the moment'}
          </p>
          {selectedWeekdays.length > 0 && (
            <p className="text-sm text-gray-500">
              Try selecting different days or clear filters
            </p>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((staff) => {
            const profileData = Array.isArray(staff.profiles)
              ? staff.profiles[0]
              : staff.profiles

            const availabilityData = Array.isArray(staff.availability)
              ? staff.availability
              : staff.availability
                ? [staff.availability]
                : []

            // Get available weekdays
            const availableDays = availabilityData
              .filter((a: any) => a.available)
              .map((a: any) => a.weekday)

            return (
              <Card key={staff.id} className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {profileData?.full_name || 'Staff Member'}
                    </h3>
                    {profileData?.email && (
                      <p className="text-sm text-gray-600">{profileData.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Key Stages</p>
                      <div className="flex flex-wrap gap-2">
                        {staff.key_stages && staff.key_stages.length > 0 ? (
                          staff.key_stages.map((stage: string) => (
                            <Badge key={stage} variant="secondary">
                              {stage}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">Not specified</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Experience</p>
                      <p className="text-sm font-medium text-gray-900">
                        {staff.experience_years || 0} years
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Available Days</p>
                      <div className="flex flex-wrap gap-1">
                        {availableDays.length > 0 ? (
                          availableDays.map((day: string) => {
                            const dayLabels: Record<string, string> = {
                              mon: 'Mon',
                              tue: 'Tue',
                              wed: 'Wed',
                              thu: 'Thu',
                              fri: 'Fri',
                            }
                            return (
                              <Badge key={day} variant="outline" className="text-xs">
                                {dayLabels[day] || day}
                              </Badge>
                            )
                          })
                        ) : (
                          <span className="text-sm text-gray-400">Not set</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">DBS Status</p>
                      <p className="text-sm font-medium text-gray-900">
                        {staff.dbs_number ? '✅ DBS Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>

                  <StaffRequestButton
                    staffId={staff.id}
                    schoolId={schoolProfile?.school?.id || ''}
                  />
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
