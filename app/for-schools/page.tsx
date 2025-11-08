'use client'

import { AsymmetricHero } from '@/components/asymmetric-hero'
import { BentoGridFeatures } from '@/components/bento-grid-features'
import { ProfessionalProcess } from '@/components/professional-process'
import { PricingCardLarge } from '@/components/pricing-card-large'
import { StaffDatabaseTeaser } from '@/components/staff-database-teaser'
import { ProfessionalCTASection } from '@/components/professional-cta-section'
import { 
  DollarSign, 
  Users, 
  Zap, 
  Shield,
  UserCheck,
  Search,
  MessageSquare,
  CheckCircle
} from 'lucide-react'

export default function ForSchools() {
  const bentoFeatures = [
    {
      icon: DollarSign,
      title: 'Predictable Costs',
      description: 'One flat fee per placement. Budget with confidence.',
      size: 'large' as const,
      variant: 'primary' as const,
    },
    {
      icon: Users,
      title: '2,000+ Professionals',
      description: 'Verified candidates ready to join your team.',
      size: 'small' as const,
      variant: 'secondary' as const,
    },
    {
      icon: Shield,
      title: 'Fully Compliant',
      description: 'All checks verified and current.',
      size: 'small' as const,
      variant: 'accent' as const,
    },
    {
      icon: Zap,
      title: 'Direct Communication',
      description: 'Message candidates directly through our platform. No intermediaries, no delays.',
      size: 'medium' as const,
      variant: 'secondary' as const,
    },
    {
      icon: CheckCircle,
      title: 'Zero Cost Until Hire',
      description: 'Browse, post, and interview completely free.',
      size: 'medium' as const,
      variant: 'accent' as const,
    },
  ]

  const processSteps = [
    {
      number: 'Step 1',
      title: 'Institution Registration',
      description: 'Complete our brief registration process in under 5 minutes. Verify your institution credentials and gain immediate platform access to our comprehensive database.',
      icon: UserCheck,
    },
    {
      number: 'Step 2',
      title: 'Post Vacancies or Search Database',
      description: 'Publish detailed job descriptions for qualified professionals to review, or search our database by location, qualifications, experience, and specialization. Access comprehensive profiles with CVs and certifications.',
      icon: Search,
    },
    {
      number: 'Step 3',
      title: 'Candidate Engagement',
      description: 'Request interviews with qualified candidates, receive applications from interested professionals, and communicate directly through our secure messaging system. Schedule interviews at your convenience.',
      icon: MessageSquare,
    },
    {
      number: 'Step 4',
      title: 'Complete Your Placement',
      description: 'Select your ideal candidate and finalize the placement. Process our flat fee and receive comprehensive compliance documentation support.',
      icon: CheckCircle,
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Asymmetric Hero */}
      <AsymmetricHero
        title="Efficient Permanent Recruitment for Educational Institutions"
        subtitle="Access our comprehensive database of verified education professionals. From senior leadership to support staff, find qualified candidates with our transparent flat-fee recruitment platform."
        highlights={[
          'One flat fee covers all positions',
          'Browse 2,000+ verified professionals',
          'Post unlimited job vacancies',
        ]}
        primaryCTA={{
          text: 'Explore Candidates',
          href: '/signup?role=school',
        }}
        secondaryCTA={{
          text: 'View Pricing',
          href: '#pricing',
        }}
        showIllustration={true}
      />

      {/* Bento Grid Features */}
      <BentoGridFeatures
        sectionTitle="Advantages for Educational Institutions"
        features={bentoFeatures}
      />

      {/* Process Steps */}
      <ProfessionalProcess
        title="Your Recruitment Journey"
        subtitle="Four streamlined steps to transform your hiring process"
        steps={processSteps}
      />

      {/* Large Pricing Card */}
      <div id="pricing">
        <PricingCardLarge
          price="£2,500"
          period="per placement"
          description="Single payment per successful hire. All positions, all salary levels, complete transparency."
          features={[
            'No salary-based commission - ever',
            'No hidden charges or additional fees',
            'No ongoing subscription costs',
            'Unlimited candidate browsing and searches',
            'Unlimited interview scheduling',
            'Direct messaging with all candidates',
            'Compliance documentation support',
            'Dedicated account management',
          ]}
          comparisonTitle="Traditional Agency Fee"
          comparisonPrice="15-25% of salary (£6,000-£10,000)"
          ctaText="Register Your Institution Free"
          ctaHref="/signup?role=school"
        />
      </div>

      {/* Staff Database Teaser */}
      <StaffDatabaseTeaser
        totalCount={2000}
        previewCount={6}
        isLoggedIn={false}
      />

      {/* Final CTA */}
      <ProfessionalCTASection
        title="Begin Recruiting Exceptional Talent"
        subtitle="Join educational institutions across the UK benefiting from efficient, cost-effective permanent recruitment."
        primaryButton={{
          text: 'Register Your Institution',
          href: '/signup?role=school',
        }}
        secondaryButton={{
          text: 'Schedule Consultation',
          href: '/contact',
        }}
        variant="primary"
      />
    </main>
  )
}
