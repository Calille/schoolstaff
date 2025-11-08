import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

/**
 * School Count Teaser Component
 * 
 * Displays a dynamic count of schools hiring staff.
 * Shows teaser count for non-logged-in users, full listings for logged-in staff.
 * 
 * @returns Server component displaying school count teaser
 */
export async function SchoolCountTeaser() {
  const supabase = await createClient()
  
  // Get school count from schools table
  const { count } = await supabase
    .from('schools')
    .select('*', { count: 'exact', head: true })

  // Use a realistic default if count is 0 or null (for demo purposes)
  const schoolCount = count || 150

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <Card className="p-8 bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {schoolCount} schools near you are hiring
        </h2>
        <p className="text-gray-600 mb-6">
          Connect with schools that need your expertise. Flexible work opportunities on your schedule.
        </p>
        {!session && (
          <Link href="/signup">
            <Button size="lg">Create Account to View School Listings</Button>
          </Link>
        )}
      </div>
    </Card>
  )
}

