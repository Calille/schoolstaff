import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/lib/auth'

/**
 * School Staff List Component
 * 
 * Displays a list of available staff members for logged-in schools.
 * Only shows compliant staff members.
 * 
 * @returns Server component displaying staff list
 */
export async function SchoolStaffList() {
  const user = await getUserProfile()

  // Only show if user is a school
  if (!user || user.role !== 'school') {
    return null
  }

  const supabase = await createClient()

  // Get compliant staff members
  const { data: staffProfiles, error } = await supabase
    .from('staff_profiles')
    .select(`
      id,
      profiles (
        id,
        full_name,
        email
      )
    `)
    .eq('is_active', true)
    .limit(10) // Limit to 10 for performance

  if (error || !staffProfiles || staffProfiles.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-gray-600">No staff members available at this time.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {staffProfiles.map((staff) => {
        const profile = Array.isArray(staff.profiles) ? staff.profiles[0] : staff.profiles
        return (
          <Card key={staff.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile?.full_name || 'Staff Member'}
                </h3>
                <p className="text-sm text-gray-600">{profile?.email}</p>
              </div>
              <Link href={`/dashboard/school/staff`}>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </Link>
            </div>
          </Card>
        )
      })}
      <div className="text-center mt-6">
        <Link href="/dashboard/school/staff">
          <Button variant="outline">View All Staff Members</Button>
        </Link>
      </div>
    </div>
  )
}

