'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/page-container'
import { trackPageView } from '@/lib/analytics'
import { AnimatedSection } from '@/components/animated-section'
import { AnimatedGradientText } from '@/components/animated-gradient-text'
import { AnimatedCounter } from '@/components/animated-counter'
import { AnimatedCTABanner } from '@/components/animated-cta-banner'
import { AnimatedFeatureGrid } from '@/components/animated-feature-grid'
import { FloatingCard } from '@/components/floating-card'
import { CheckCircle, Users, TrendingUp, Award } from 'lucide-react'

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
        <AnimatedSection animation="fade-in-down">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Find Your Perfect Match in{' '}
            <AnimatedGradientText>Education</AnimatedGradientText>
          </h1>
        </AnimatedSection>
        <AnimatedSection animation="fade-in-up" delay={200}>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're connecting schools with brilliant education professionals across the UK. Whether you're a school looking for talent or a teacher seeking your next role, we've made it dead simple.
          </p>
        </AnimatedSection>
        <AnimatedSection animation="fade-in-up" delay={400}>
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
        </AnimatedSection>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20">
        <AnimatedSection animation="fade-in">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Everyone's Switching to School Staff
          </h2>
        </AnimatedSection>
        <AnimatedFeatureGrid
          features={[
            {
              icon: CheckCircle,
              title: "One Flat Fee, That's It",
              description: "No surprise bills. No commission on salaries. Just one simple, honest fee when you hire. Done."
            },
            {
              icon: Users,
              title: "Every Role Under the Sun",
              description: "Head Teacher? Yep. Teaching Assistant? Got 'em. Even the midday supervisors and cleaning crew. If your school needs it, we've got it."
            },
            {
              icon: TrendingUp,
              title: "Cut Out the Middleman",
              description: "Browse profiles, message directly, book meetings yourself. No waiting around for agencies to get back to you."
            },
            {
              icon: Award,
              title: "Quality People Only",
              description: "Everyone's verified with proper compliance docs and qualifications. We do the boring stuff so you don't have to."
            }
          ]}
          columns={2}
        />
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection animation="fade-in">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Honestly, It's Pretty Simple
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { num: 1, title: "Sign Up (Takes 2 Minutes)", desc: "Free for everyone. No credit card needed." },
              { num: 2, title: "Start Browsing", desc: "Schools: Check out our talented staff near you. Staff: See what roles are going and apply." },
              { num: 3, title: "Connect Directly", desc: "Message, book meetings, have a chat. Do it all through our platform." },
              { num: 4, title: "Make It Official", desc: "Schools pay our flat fee when you hire. Staff? You never pay a penny." }
            ].map((step, index) => (
              <AnimatedSection key={index} animation="fade-in-up" delay={index * 100}>
                <FloatingCard delay={index * 100}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                </FloatingCard>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection animation="fade-in-up" delay={400}>
            <div className="text-center mt-8">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <AnimatedCTABanner
          title="Ready to Make Better Connections?"
          subtitle="Join hundreds of schools and thousands of education pros who are hiring (and getting hired) the smart way."
          primaryButtonText="Sign Up as a School"
          primaryButtonLink="/signup?role=school"
          secondaryButtonText="Sign Up as Staff"
          secondaryButtonLink="/signup?role=staff"
        />
      </section>
    </PageContainer>
  )
}
