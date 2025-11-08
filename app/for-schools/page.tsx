import { PageContainer } from '@/components/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StaffCountTeaser } from '@/components/staff-count-teaser'
import { trackPageView } from '@/lib/analytics'
import { SchoolStaffList } from '@/components/school-staff-list'
import { AnimatedSection } from '@/components/animated-section'
import { AnimatedGradientText } from '@/components/animated-gradient-text'
import { FloatingCard } from '@/components/floating-card'

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
          <AnimatedSection animation="fade-in-down">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Efficient Permanent Recruitment for Educational Institutions
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={200}>
            <p className="text-xl text-gray-600 mb-8">
              Access our comprehensive database of verified education professionals. From senior leadership to support staff, find qualified candidates with our transparent flat-fee recruitment platform.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={400}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/dashboard/school/staff">
                <Button size="lg">Explore Candidates</Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>

        {/* Main Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Advantages for Educational Institutions
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Predictable Recruitment Costs</h3>
              <p className="text-gray-600">
                Our flat-fee structure provides complete cost transparency. Budget confidently with a single competitive fee per placement, regardless of salary level or position type.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Complete Role Coverage</h3>
              <div className="text-gray-600 space-y-1">
                <ul className="list-disc list-inside space-y-1">
                  <li>Senior Leadership & Head Teachers</li>
                  <li>Qualified Teachers (Primary & Secondary)</li>
                  <li>Teaching Assistants & Learning Support</li>
                  <li>Special Educational Needs Specialists</li>
                  <li>Administrative & Business Management</li>
                  <li>Facilities & Operations Staff</li>
                  <li>Support & Ancillary Personnel</li>
                </ul>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Direct Candidate Engagement</h3>
              <p className="text-gray-600">
                Review comprehensive professional profiles including qualifications, experience, and specializations. Schedule interviews directly and communicate without intermediary delays.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Zero Cost Until Placement</h3>
              <p className="text-gray-600">
                Register your institution, post unlimited vacancies, review candidates, and conduct interviews at no charge. Investment occurs only upon successful placement.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Recruitment Journey
          </h2>
          <div className="space-y-6">
            <AnimatedSection animation="fade-in-up" delay={0}>
              <FloatingCard delay={0}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Institution Registration</h3>
                  <p className="text-gray-600">
                    Complete our brief registration process. Verify your institution credentials and gain immediate platform access.
                  </p>
                </div>
              </div>
              </FloatingCard>
            </AnimatedSection>
            <AnimatedSection animation="fade-in-up" delay={200}>
              <FloatingCard delay={200}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    2
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Post Vacancies or Search Database</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Publish detailed job descriptions for qualified professionals to review</li>
                    <li>Search our database by location, qualifications, experience, and specialization</li>
                    <li>Review comprehensive profiles with CVs, certifications, and references</li>
                  </ul>
                </div>
              </div>
              </FloatingCard>
            </AnimatedSection>
            <AnimatedSection animation="fade-in-up" delay={400}>
              <FloatingCard delay={400}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    3
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Candidate Engagement</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Request interviews with qualified candidates</li>
                    <li>Receive applications from interested professionals</li>
                    <li>Communicate directly through our secure messaging system</li>
                    <li>Schedule interviews at your convenience</li>
                  </ul>
                </div>
              </div>
              </FloatingCard>
            </AnimatedSection>
            <AnimatedSection animation="fade-in-up" delay={600}>
              <FloatingCard delay={600}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    4
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete Your Placement</h3>
                  <p className="text-gray-600">
                    Select your ideal candidate and finalize the placement. Process our flat fee and receive compliance documentation support.
                  </p>
                </div>
              </div>
              </FloatingCard>
            </AnimatedSection>
          </div>
          <div className="text-center mt-8">
            <Link href="/signup">
              <Button size="lg">Register Your Institution</Button>
            </Link>
          </div>
        </section>

        {/* Staff Database Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Our Professional Network
          </h2>
          <div className="mb-6">
            <StaffCountTeaser />
          </div>
          <p className="text-center text-gray-600 mb-6">
            Access our network of verified education professionals actively seeking permanent positions.
          </p>
          {!session && (
            <div className="text-center">
              <Link href="/signup">
                <Button size="lg">Register to View All Candidates</Button>
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
          <Card className="p-8 bg-primary-50 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Transparent Pricing Structure
            </h2>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                Flat Fee Per Placement: £[Amount]*
              </p>
              <ul className="text-gray-700 space-y-2 mt-4">
                <li>✓ No salary-based commission</li>
                <li>✓ No hidden charges or additional fees</li>
                <li>✓ No ongoing subscription costs</li>
                <li>✓ Unlimited candidate browsing</li>
                <li>✓ Unlimited interview scheduling</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                *Single payment per successful placement, applicable to all positions and salary levels.
              </p>
            </div>
            <div className="text-center">
              <Link href="/signup">
                <Button size="lg">Register Free</Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Begin Recruiting Exceptional Talent
            </h2>
            <p className="text-gray-600 mb-6">
              Join educational institutions across the UK benefiting from efficient, cost-effective permanent recruitment.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg">Register Your Institution</Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}

