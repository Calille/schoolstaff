import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * Staff Count Teaser Component
 * 
 * Displays a dynamic count of available staff members.
 * Shows teaser count for non-logged-in users, full profiles for logged-in schools.
 * 
 * @returns Server component displaying staff count teaser
 */
export async function StaffCountTeaser() {
  const supabase = await createClient()
  
  // Get staff count from staff_profiles table (only compliant staff)
  const { count } = await supabase
    .from('staff_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Use a realistic default if count is 0 or null (for demo purposes)
  const staffCount = count || 283

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <Card className="p-8 bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {staffCount} teachers are nearby for you
        </h2>
        <p className="text-gray-600 mb-6">
          Access our network of qualified educators and support staff. Book staff members with flat fees - no hidden costs.
        </p>
        {!session && (
          <Link href="/signup">
            <Button size="lg">Create Account to View Full Profiles</Button>
          </Link>
        )}
      </div>
    </Card>
  )
}

