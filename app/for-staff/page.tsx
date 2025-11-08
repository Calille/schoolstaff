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
              Your Next School Role is{' '}
              <AnimatedGradientText>Waiting</AnimatedGradientText>
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={200}>
            <p className="text-xl text-gray-600 mb-8">
              Join education professionals who are finding their perfect school matches with us. Build your profile, show off what you're good at, and connect directly with hiring schools.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={400}>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg">Create Your Profile</Button>
              </Link>
              <Link href="/dashboard/staff/requests">
                <Button size="lg" variant="outline">
                  Browse School Roles
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>

        {/* Main Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Teachers Love School Staff
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Show Off Your Skills</h3>
              <p className="text-gray-600">
                Build a profile that actually shows who you are – your qualifications, experience, what makes you great. Let schools come to you.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Talk Directly to Schools</h3>
              <p className="text-gray-600">
                No agency in the middle taking a cut. Message schools, book your own interviews, sort out your terms face-to-face.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Every Type of School Job</h3>
              <p className="text-gray-600">
                Head Teacher, Classroom Teacher, TA, SEN Specialist, Support Staff – doesn't matter what you do, there's a spot for you.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Apply to Everything</h3>
              <p className="text-gray-600">
                Browse open roles and apply to as many as you fancy. Plus schools can find you and reach out directly.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Totally Free Forever</h3>
              <p className="text-gray-600">
                Create your profile, apply to jobs, connect with schools – all free. We never charge staff. Ever.
              </p>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Four Dead Simple Steps
          </h2>
          <div className="space-y-6">
            <AnimatedSection animation="fade-in-up" delay={0}>
              <FloatingCard delay={0}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                    1
                  </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create Your Profile (Free)</h3>
                  <p className="text-gray-600">
                    Quick sign-up. Add your details and you're in.
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
                  <h3 className="text-xl font-semibold mb-2">Make Yourself Look Good</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Your job title and current gig</li>
                    <li>Qualifications and certs</li>
                    <li>Your experience and what you're brilliant at</li>
                    <li>Chuck up your CV and compliance docs</li>
                    <li>Write a bit about yourself (keep it real)</li>
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
                  <h3 className="text-xl font-semibold mb-2">Get Found or Go Looking</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Schools browse profiles and message you</li>
                    <li>Check out available roles and apply</li>
                    <li>Get notified when schools are interested</li>
                    <li>Book interviews that work for you</li>
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
                  <h3 className="text-xl font-semibold mb-2">Interview & Accept</h3>
                  <p className="text-gray-600">
                    Meet the school, have a proper chat, see if it feels right. When you're happy, accept the offer and start your new role.
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
            Schools Looking Right Now
          </h2>
          <div className="mb-6">
            <SchoolCountTeaser />
          </div>
          {!session && (
            <div className="text-center">
              <Link href="/signup">
                <Button size="lg">Sign Up to See All Roles</Button>
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
            Every Education Job Going
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Teaching Roles</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Head Teachers & Deputies</li>
                <li>• Primary Teachers (All Years)</li>
                <li>• Secondary Teachers (All Subjects)</li>
                <li>• Early Years Teachers</li>
                <li>• SEN Teachers & Specialists</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Support Roles</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Teaching Assistants</li>
                <li>• HLTAs</li>
                <li>• SEN Support Staff</li>
                <li>• Cover Supervisors</li>
                <li>• Learning Mentors</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Admin & Facilities</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• School Business Managers</li>
                <li>• Office Staff</li>
                <li>• Caretakers & Site Managers</li>
                <li>• Lunchtime Supervisors</li>
                <li>• Cleaning Staff</li>
              </ul>
            </Card>
          </div>
          <p className="text-center text-gray-600 mt-4">And loads more...</p>
          <div className="text-center mt-6">
            <Link href="/dashboard/staff/requests">
              <Button size="lg" variant="outline">
                Browse All Roles
              </Button>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready for Your Next Move?
            </h2>
            <p className="text-gray-600 mb-6">
              Join thousands of education pros who've found their perfect school on here.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <Button size="lg">Create Your Profile</Button>
              </Link>
              <Link href="/dashboard/staff/requests">
                <Button size="lg" variant="outline">
                  See What's Available
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}

