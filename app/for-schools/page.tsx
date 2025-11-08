import { PageContainer } from '@/components/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StaffCountTeaser } from '@/components/staff-count-teaser'
import { trackPageView } from '@/lib/analytics'
import { SchoolStaffList } from '@/components/school-staff-list'

/**
 * For Schools Page
 * 
 * Marketing page explaining how schools can book staff for flat fees.
 * Shows teaser count for non-logged-in users, full staff listings for logged-in schools.
 */
export default async function ForSchoolsPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Find Qualified Staff for Your School
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Access our network of experienced educators and support staff. Book staff members quickly and efficiently with transparent flat fees - no hidden costs.
        </p>

        {/* Staff Count Teaser */}
        <div className="mb-12">
          <StaffCountTeaser />
        </div>

        {/* Flat Fee Explanation */}
        <Card className="p-6 mb-12 bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Simple Flat Fee Pricing
          </h2>
          <p className="text-gray-700 mb-4">
            We believe in transparency. When you book staff through our platform, you pay a simple flat fee per booking. No hourly rate surprises, no hidden charges, no complicated calculations.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>One flat fee per staff booking</li>
            <li>No hourly rate calculations</li>
            <li>No hidden fees or charges</li>
            <li>Transparent pricing upfront</li>
          </ul>
        </Card>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Easy Booking Process</h3>
            <p className="text-gray-600">
              Submit your staff request with details about dates, times, and requirements. Our team handles the rest.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
            <p className="text-gray-600">
              All staff members undergo background checks and verification. We ensure quality and reliability.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Track Your Bookings</h3>
            <p className="text-gray-600">
              Monitor all your staff requests in one place. See status updates and manage your bookings easily.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Support When You Need It</h3>
            <p className="text-gray-600">
              Our team is here to help. Get assistance with bookings, questions, or special requests.
            </p>
          </Card>
        </div>

        {/* Show real staff listings if logged in as school */}
        {session && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Staff Members
            </h2>
            <SchoolStaffList />
          </div>
        )}

        {/* CTA */}
        {!session && (
          <div className="text-center">
            <Card className="p-8 bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Find Staff?
              </h2>
              <p className="text-gray-600 mb-6">
                Create an account to view full staff profiles and start booking with our simple flat fee system.
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

