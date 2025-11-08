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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Hire Amazing Staff Without the Headache
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get instant access to our database of qualified education professionals across the UK. Every role covered, one flat fee, zero faff.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/dashboard/school/staff">
              <Button size="lg">Browse Staff Now</Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Here's Why Schools Love Us
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">One Flat Fee. Seriously.</h3>
              <p className="text-gray-600">
                No percentage nonsense. Whether you're hiring a Head Teacher or a lunchtime supervisor, it's the same flat fee. Simple maths, simple budgeting.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">We've Got Everyone</h3>
              <div className="text-gray-600 space-y-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>Head Teachers & Senior Leadership</li>
                  <li>All Your Classroom Teachers</li>
                  <li>Teaching Assistants & Support Staff</li>
                  <li>SEN Specialists</li>
                  <li>Cover Supervisors</li>
                  <li>Admin Team</li>
                  <li>Site Staff & Caretakers</li>
                  <li>Lunchtime Crew</li>
                  <li>Cleaning Staff</li>
                  <li>Literally everyone else</li>
                </ul>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Direct Access to Real People</h3>
              <p className="text-gray-600">
                See full profiles with actual experience, qualifications, and what makes them tick. Then message them directly. No 'we'll send some CVs over' rubbish.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Browse for Free, Pay When You Hire</h3>
              <p className="text-gray-600">
                Create your account, post unlimited roles, scroll through profiles, book meetings – all free. You only pay when you've found the one and want to hire them.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your New Favourite Way to Hire
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sign Up (It's Free)</h3>
                  <p className="text-gray-600">
                    Quick as you like. Pop in your school details and you're good to go.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Post Roles or Browse Away</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Stick up your open positions for staff to apply</li>
                    <li>Search our database by location, role, experience – whatever you need</li>
                    <li>Check out detailed profiles with CVs and all the good stuff</li>
                  </ul>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Chat & Meet</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Send meeting requests to people you like the look of</li>
                    <li>Get applications from interested candidates</li>
                    <li>Message them directly (no playing telephone with agencies)</li>
                    <li>Book interviews when it suits you</li>
                  </ul>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Hire Your Star Player</h3>
                  <p className="text-gray-600">
                    Found someone brilliant? Lovely! Pay our flat fee and they're all yours. We'll sort the paperwork.
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/dashboard/school/staff">
              <Button size="lg">Start Browsing</Button>
            </Link>
          </div>
        </section>

        {/* Staff Database Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Meet Some of Our Crew
          </h2>
          <div className="mb-6">
            <StaffCountTeaser />
          </div>
          <p className="text-center text-gray-600 mb-6">
            Right now we've got verified education professionals ready to join your team.
          </p>
          {!session && (
            <div className="text-center">
              <Link href="/signup">
                <Button size="lg">Sign Up to See Everyone</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Show real staff listings if logged in as school */}
        {session && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Staff Members
            </h2>
            <SchoolStaffList />
          </div>
        )}

        {/* Pricing Section */}
        <section className="mb-12">
          <Card className="p-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              No Hidden Costs. Promise.
            </h2>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                Flat Fee Per Hire: £[Amount]*
              </p>
              <ul className="text-gray-700 space-y-2 mt-4">
                <li>✓ No commission on salaries (ever)</li>
                <li>✓ No sneaky extra charges</li>
                <li>✓ No ongoing subscription</li>
                <li>✓ Browse and message unlimited</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                *One-time payment per hire. Head Teacher or cleaner – same price.
              </p>
            </div>
            <div className="text-center">
              <Link href="/signup">
                <Button size="lg">Get Started Free</Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Let's Find Your Next Superstar
            </h2>
            <p className="text-gray-600 mb-6">
              Join schools across the UK who've ditched the agencies and started hiring smarter.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg">Create Your Account</Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  Book a Quick Demo
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}

