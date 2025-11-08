import { PageContainer } from '@/components/page-container'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

/**
 * How It Works Page
 * 
 * Explains the process of booking staff through the platform.
 * Includes step-by-step guide and benefits.
 */
export default function HowItWorksPage() {
  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            How School Staff Works
          </h1>
          <p className="text-xl text-gray-600">
            The simple way for schools and teachers to connect. No agencies taking a cut, no commission on salaries, just honest connections.
          </p>
        </div>

        {/* Overview Section */}
        <section className="mb-12">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              It's a Two-Way Thing
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              School Staff is basically a permanent recruitment marketplace that works both ways:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Schools Can:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Post your open jobs for teachers to apply</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Browse our database of qualified people</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Message candidates directly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Hire with one simple flat fee</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Staff Can:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Build a proper profile showing off your skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Apply to school roles you like</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Get discovered by schools looking for you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Chat directly with hiring schools</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">Everyone Wins:</h3>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">No agency playing messenger</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">Actual direct communication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">You know exactly what you're paying (or not paying)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">Everything happens faster</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* For Schools Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How Schools Hire With Us
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sign Up (Free)</h3>
                  <p className="text-gray-600">
                    Create your account. Takes about 2 minutes. Add your school details.
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
                  <h3 className="text-xl font-semibold mb-2">Find People</h3>
                  <p className="text-gray-600 mb-2">You've got two options:</p>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>Post Your Jobs:</strong> Stick up your open roles and let our network apply</li>
                    <li><strong>Browse Profiles:</strong> Search by location, role, qualifications, experience – whatever matters</li>
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
                  <h3 className="text-xl font-semibold mb-2">Connect</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Check out applications from interested people</li>
                    <li>Browse profiles and message anyone who looks good</li>
                    <li>Chat directly on our platform</li>
                    <li>Book interviews whenever suits you</li>
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
                  <h3 className="text-xl font-semibold mb-2">Interview</h3>
                  <p className="text-gray-600">
                    Meet them properly (in person or on video). Talk about the role, see if they're a good fit. No pressure from us.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Hire</h3>
                  <p className="text-gray-600">
                    Found the right person? Great! Pay our one-time flat fee. We'll help with compliance paperwork and they can start.
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <p className="text-gray-700">
              <strong>Zero Cost Until You Hire</strong> - Everything's free until you actually make a hire. Browse all day, message everyone, book a million interviews – doesn't cost a thing until you find the one.
            </p>
          </Card>
        </section>

        {/* For Staff Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How to Find Your Next Role
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Make Your Profile</h3>
                  <p className="text-gray-600 mb-2">Sign up for free. Add your details:</p>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>What you do now</li>
                    <li>Your qualifications</li>
                    <li>How long you've been doing this</li>
                    <li>What you're really good at</li>
                    <li>A bit about who you are</li>
                    <li>Your CV and compliance stuff</li>
                  </ul>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Get Discovered or Start Looking</h3>
                  <p className="text-gray-600 mb-2">Two ways to land your next gig:</p>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li><strong>Be Found:</strong> Schools browse profiles and message you</li>
                    <li><strong>Hunt Yourself:</strong> Browse open roles and apply to ones you like</li>
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
                  <h3 className="text-xl font-semibold mb-2">Connect with Schools</h3>
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Get meeting requests from schools</li>
                    <li>Apply to roles that look good</li>
                    <li>Message schools with questions</li>
                    <li>Book interviews that work for your schedule</li>
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
                  <h3 className="text-xl font-semibold mb-2">Interview & Chat Terms</h3>
                  <p className="text-gray-600">
                    Meet the school. Talk about the role, the school, what you want. No agency taking a chunk of your salary.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Say Yes</h3>
                  <p className="text-gray-600">
                    Love it? Accept the offer and start your new job. Easy.
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <Card className="p-6 mt-6 bg-green-50 border-green-200">
            <p className="text-gray-700">
              <strong>Always Free for You</strong> - Making a profile, applying to jobs, connecting with schools – never costs you anything. Not now, not ever.
            </p>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why This Actually Works Better
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">For Schools:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>One Flat Fee: Same price whether you're hiring a Head or a cleaner</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>No Waiting: Stop waiting for agencies to "look into it"</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>More People: Our whole database is yours to browse</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>You're in Control: Hire on your timeline, your way</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">For Staff:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Never Pay: Finding jobs is free. Always.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Direct Line: Talk to schools directly, no playing telephone</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>See Everything: Know what you're getting into before you apply</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>More Options: Schools find you AND you find them</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">For Everyone:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Faster: Direct chat means quicker decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Better Matches: More info = better choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>No Surprises: What you see is what you get</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Modern Platform: Works on your phone, easy to use</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-12">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What It Actually Costs
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">For Schools:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Free to sign up</li>
                  <li>✓ Free to post unlimited jobs</li>
                  <li>✓ Free to browse everyone</li>
                  <li>✓ Free to message and interview</li>
                  <li className="font-semibold text-gray-900 mt-4">£[Amount] flat fee per hire*</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  *One payment per hire. Doesn't matter what role or what salary.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">For Staff:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="text-2xl font-bold text-gray-900">£0. Forever.</li>
                  <li>Seriously, it's free</li>
                  <li>We never charge teachers</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Fancy Giving It a Go?
            </h2>
            <p className="text-gray-600 mb-6">
              Join the smarter way to hire and get hired in education.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-6">
              <Link href="/signup">
                <Button size="lg">Sign Up as a School</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Sign Up as Staff
                </Button>
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Questions?</p>
              <div className="flex gap-4 justify-center">
                <Link href="/contact" className="text-gray-900 hover:underline">
                  Get in Touch
                </Link>
                <span>|</span>
                <Link href="/faq" className="text-gray-900 hover:underline">
                  FAQs
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}

