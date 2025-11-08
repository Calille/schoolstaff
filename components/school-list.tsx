import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getUserProfile } from '@/lib/auth'

/**
 * School List Component
 * 
 * Displays a list of schools hiring for logged-in staff members.
 * 
 * @returns Server component displaying school list
 */
export async function SchoolList() {
  const user = await getUserProfile()

  // Only show if user is staff
  if (!user || user.role !== 'staff') {
    return null
  }

  const supabase = await createClient()

  // Get schools
  const { data: schools, error } = await supabase
    .from('schools')
    .select(`
      id,
      school_name,
      profile_id,
      profiles (
        id,
        email
      )
    `)
    .limit(10) // Limit to 10 for performance

  if (error || !schools || schools.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-gray-600">No schools available at this time.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {schools.map((school) => {
        const profile = Array.isArray(school.profiles) ? school.profiles[0] : school.profiles
        return (
          <Card key={school.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {school.school_name}
                </h3>
                {profile?.email && (
                  <p className="text-sm text-gray-600">{profile.email}</p>
                )}
              </div>
              <Link href={`/dashboard/staff/requests`}>
                <Button size="sm" variant="outline">
                  View Opportunities
                </Button>
              </Link>
            </div>
          </Card>
        )
      })}
      <div className="text-center mt-6">
        <Link href="/dashboard/staff/requests">
          <Button variant="outline">View All Opportunities</Button>
        </Link>
      </div>
    </div>
  )
}

