import { PageContainer } from '@/components/page-container'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SchoolCountTeaser } from '@/components/school-count-teaser'
import { SchoolList } from '@/components/school-list'
import { AnimatedSection } from '@/components/animated-section'
import { AnimatedGradientText } from '@/components/animated-gradient-text'
import { FloatingCard } from '@/components/floating-card'

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <AnimatedSection animation="fade-in-down">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Advance Your Career in Education
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={200}>
            <p className="text-xl text-gray-600 mb-8">
              Join education professionals utilizing School Staff to secure permanent positions. Create your professional profile, showcase your qualifications, and connect directly with hiring institutions.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={400}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg">Create Professional Profile</Button>
              </Link>
              <Link href="/dashboard/staff/requests">
                <Button size="lg" variant="outline">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>

        {/* Main Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Education Professionals Choose Our Platform
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Professional Profile Showcase</h3>
              <p className="text-gray-600">
                Develop a comprehensive profile highlighting your qualifications, experience, specializations, and unique value proposition. Enable institutions to discover your expertise.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Direct Institution Access</h3>
              <p className="text-gray-600">
                Eliminate agency intermediaries. Communicate directly with hiring institutions, schedule your own interviews, and negotiate terms transparently.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Comprehensive Opportunity Access</h3>
              <p className="text-gray-600">
                Whether you're seeking leadership positions, classroom teaching roles, learning support, or specialized positions, our platform serves all education career paths.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Dual Application Approach</h3>
              <p className="text-gray-600">
                Browse posted vacancies and submit applications while maintaining visibility to institutions searching our database. Maximize your exposure to opportunities.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Permanent Access at No Cost</h3>
              <p className="text-gray-600">
                Create your profile, apply to positions, and connect with institutions completely free. Our platform never charges education professionals.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Career Advancement Path
          </h2>
          <div className="space-y-6">
            <AnimatedSection animation="fade-in-up" delay={0}>
              <FloatingCard delay={0}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Professional Registration</h3>
                  <p className="text-gray-600">
                    Complete our brief registration process. Establish your professional presence in minutes.
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
                  <h3 className="text-xl font-semibold mb-2">Profile Development</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Current position and professional title</li>
                    <li>Educational qualifications and certifications</li>
                    <li>Professional experience and achievements</li>
                    <li>Subject specializations and expertise areas</li>
                    <li>Professional CV and compliance documentation</li>
                    <li>Career objectives and position preferences</li>
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
                  <h3 className="text-xl font-semibold mb-2">Opportunity Engagement</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Receive interview requests from interested institutions</li>
                    <li>Browse available positions and submit applications</li>
                    <li>Access notifications regarding institutional interest</li>
                    <li>Schedule interviews according to your availability</li>
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
                  <h3 className="text-xl font-semibold mb-2">Secure Your Position</h3>
                  <p className="text-gray-600">
                    Conduct interviews with institutions, evaluate opportunities, and make informed career decisions. Accept your ideal position and advance your career.
                  </p>
                </div>
              </div>
              </FloatingCard>
            </AnimatedSection>
          </div>
          <div className="text-center mt-8">
            <Link href="/signup">
              <Button size="lg">Create Your Profile</Button>
            </Link>
          </div>
        </section>

        {/* Schools Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Institutions Currently Recruiting
          </h2>
          <div className="mb-6">
            <SchoolCountTeaser />
          </div>
          <p className="text-center text-gray-600 mb-6">
            Educational institutions are actively recruiting qualified professionals.
          </p>
          {!session && (
            <div className="text-center">
              <Link href="/signup">
                <Button size="lg">Register to View All Opportunities</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Show real school listings if logged in as staff */}
        {session && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Schools Hiring Near You
            </h2>
            <SchoolList />
          </div>
        )}

        {/* Roles We Cover Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comprehensive Position Coverage
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Teaching Positions</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Head Teachers & Deputy Head Teachers</li>
                <li>• Primary Teachers (All Key Stages)</li>
                <li>• Secondary Teachers (All Subject Areas)</li>
                <li>• Early Years & Foundation Stage Teachers</li>
                <li>• Special Educational Needs Teachers & Specialists</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Support Positions</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Teaching Assistants & Learning Support</li>
                <li>• Higher Level Teaching Assistants (HLTA)</li>
                <li>• Special Educational Needs Support Staff</li>
                <li>• Cover Supervisors & Supply Teachers</li>
                <li>• Learning Mentors & Pastoral Support</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Administrative & Operations</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• School Business Managers</li>
                <li>• Administrative & Office Staff</li>
                <li>• Site Managers & Caretakers</li>
                <li>• Midday Supervisors</li>
                <li>• Facilities & Cleaning Staff</li>
              </ul>
            </Card>
          </div>
          <p className="text-center text-gray-600 mt-4">Additional specialized roles available</p>
          <div className="text-center mt-6">
            <Link href="/dashboard/staff/requests">
              <Button size="lg" variant="outline">
                View All Opportunities
              </Button>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Take the Next Step in Your Education Career
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of education professionals who have secured their ideal permanent positions through our platform.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg">Create Your Profile</Button>
              </Link>
              <Link href="/dashboard/staff/requests">
                <Button size="lg" variant="outline">
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}

