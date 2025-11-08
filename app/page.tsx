import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/page-container'
import { trackPageView } from '@/lib/analytics'

/**
 * Home Page
 * 
 * Landing page for the School Staff platform.
 * Provides overview and navigation to key sections.
 */
export default function Home() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Your Perfect Match in Education
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          We're connecting schools with brilliant education professionals across the UK. Whether you're a school looking for talent or a teacher seeking your next role, we've made it dead simple.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/for-schools">
            <Button size="lg">For Schools</Button>
          </Link>
          <Link href="/for-staff">
            <Button size="lg" variant="outline">
              For Staff
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button size="lg" variant="outline">
              How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Everyone's Switching to School Staff
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">One Flat Fee, That's It</h3>
            <p className="text-gray-600">
              No surprise bills. No commission on salaries. Just one simple, honest fee when you hire. Done.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Every Role Under the Sun</h3>
            <p className="text-gray-600">
              Head Teacher? Yep. Teaching Assistant? Got 'em. Even the midday supervisors and cleaning crew. If your school needs it, we've got it.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Cut Out the Middleman</h3>
            <p className="text-gray-600">
              Browse profiles, message directly, book meetings yourself. No waiting around for agencies to get back to you.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Quality People Only</h3>
            <p className="text-gray-600">
              Everyone's verified with proper compliance docs and qualifications. We do the boring stuff so you don't have to.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Honestly, It's Pretty Simple
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sign Up (Takes 2 Minutes)</h3>
                  <p className="text-gray-600">
                    Free for everyone. No credit card needed.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Start Browsing</h3>
                  <p className="text-gray-600">
                    Schools: Check out our talented staff near you. Staff: See what roles are going and apply.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Connect Directly</h3>
                  <p className="text-gray-600">
                    Message, book meetings, have a chat. Do it all through our platform.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Make It Official</h3>
                  <p className="text-gray-600">
                    Schools pay our flat fee when you hire. Staff? You never pay a penny.
                  </p>
                </div>
              </div>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 text-center">
        <Card className="p-12 bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make Better Connections?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of schools and thousands of education pros who are hiring (and getting hired) the smart way.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg">Sign Up as a School</Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline">
                Sign Up as Staff
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </PageContainer>
  )
}
