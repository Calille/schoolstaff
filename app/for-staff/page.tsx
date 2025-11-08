import { PageContainer } from '@/components/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SchoolCountTeaser } from '@/components/school-count-teaser'
import { SchoolList } from '@/components/school-list'

/**
 * For Staff Page
 * 
 * Marketing page explaining how teachers/staff can join and get booked.
 * Shows teaser count for non-logged-in users, full school listings for logged-in staff.
 */
export default async function ForStaffPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Join Our Network of School Staff
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Connect with schools that need your expertise. Flexible work opportunities on your schedule.
        </p>

        {/* School Count Teaser */}
        <div className="mb-12">
          <SchoolCountTeaser />
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Flexible Schedule</h3>
            <p className="text-gray-600">
              Choose assignments that fit your availability. Work when and where you want.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Competitive Rates</h3>
            <p className="text-gray-600">
              Fair compensation for your skills and experience. Get paid what you deserve.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Easy Application</h3>
            <p className="text-gray-600">
              Simple onboarding process. Get started quickly and start receiving opportunities.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Support & Resources</h3>
            <p className="text-gray-600">
              Access to training materials, support from our team, and ongoing professional development.
            </p>
          </Card>
        </div>

        {/* Show real school listings if logged in as staff */}
        {session && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Schools Hiring Near You
            </h2>
            <SchoolList />
          </div>
        )}

        {/* CTA */}
        {!session && (
          <div className="text-center">
            <Card className="p-8 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6">
                Join our network and start receiving booking opportunities from schools.
              </p>
              <Link href="/signup">
                <Button size="lg">Create Account</Button>
              </Link>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

