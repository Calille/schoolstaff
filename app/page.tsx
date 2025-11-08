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
          Find Qualified School Staff
          <br />
          <span className="text-gray-600">When You Need Them</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Connect with experienced educators and support staff. Fast, reliable, and trusted by schools across the country.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/for-schools">
            <Button size="lg">Find Staff</Button>
          </Link>
          <Link href="/for-staff">
            <Button size="lg" variant="outline">
              Join as Staff
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose School Staff?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Quick Booking</h3>
            <p className="text-gray-600">
              Request staff in minutes. Our streamlined process gets you the help you need fast.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Verified Staff</h3>
            <p className="text-gray-600">
              All staff members are vetted and verified. Quality assurance you can trust.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Flexible Options</h3>
            <p className="text-gray-600">
              Full-time, part-time, or temporary placements. We match your needs.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <Card className="p-12 bg-gray-50">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of schools already using School Staff.
          </p>
          <Link href="/signup">
            <Button size="lg">Create Account</Button>
          </Link>
        </Card>
      </section>
    </PageContainer>
  )
}
