'use client'

import { ProfessionalHero } from '@/components/professional-hero'
import { ProfessionalStats } from '@/components/professional-stats'
import { StaggeredGrid } from '@/components/staggered-grid'
import { ProfessionalFeatureCard } from '@/components/professional-feature-card'
import { ProfessionalProcess } from '@/components/professional-process'
import { ProfessionalCTASection } from '@/components/professional-cta-section'
import { ScrollReveal } from '@/components/scroll-reveal'
import { 
  DollarSign, 
  Users, 
  Zap, 
  Shield,
  CheckCircle,
  Search,
  Calendar,
  UserCheck 
} from 'lucide-react'
import { PageContainer } from '@/components/page-container'

/**
 * Landing Page
 * 
 * Professional landing page for School Staff platform.
 * Features scroll-triggered animations and modern layout.
 */
export default function Home() {
  const features = [
    {
      icon: DollarSign,
      title: 'Transparent Flat-Fee Pricing',
      description: 'Our straightforward pricing model eliminates commission-based fees. One competitive flat fee per successful placement, regardless of salary level or position. Predictable costs, exceptional value.',
      variant: 'white' as const,
    },
    {
      icon: Users,
      title: 'Comprehensive Role Coverage',
      description: 'From executive leadership to support staff, we facilitate placements across all educational roles. Our platform serves Head Teachers, Classroom Teachers, Teaching Assistants, Administrative Personnel, and Facilities Staff.',
      variant: 'white' as const,
    },
    {
      icon: Zap,
      title: 'Direct Candidate Access',
      description: 'Browse verified professional profiles, schedule interviews, and communicate directly with candidates. Our platform eliminates intermediaries, reducing time-to-hire and improving candidate quality.',
      variant: 'white' as const,
    },
    {
      icon: Shield,
      title: 'Rigorous Compliance Verification',
      description: 'All professionals maintain current DBS checks, safeguarding certifications, and relevant qualifications. Our verification process ensures regulatory compliance and peace of mind.',
      variant: 'white' as const,
    },
  ]

  const processSteps = [
    {
      number: 'Step 1',
      title: 'Registration & Setup',
      description: 'Complete our streamlined registration process at no cost. Access our platform immediately upon approval.',
      icon: UserCheck,
    },
    {
      number: 'Step 2',
      title: 'Search & Connect',
      description: 'Schools: Access our comprehensive database of qualified professionals. Professionals: Browse permanent opportunities and showcase your expertise.',
      icon: Search,
    },
    {
      number: 'Step 3',
      title: 'Interview & Evaluate',
      description: 'Schedule interviews directly through our platform. Conduct thorough assessments without agency pressure or time constraints.',
      icon: Calendar,
    },
    {
      number: 'Step 4',
      title: 'Secure Your Hire',
      description: 'Finalize your placement with our transparent flat fee. Professionals join at no cost. Simple, efficient, effective.',
      icon: CheckCircle,
    },
  ]

  const stats = [
    { value: 500, suffix: '+', label: 'Registered Schools' },
    { value: 2000, suffix: '+', label: 'Education Professionals' },
    { value: 1500, suffix: '+', label: 'Successful Placements' },
  ]

  return (
    <PageContainer>
      <main className="min-h-screen">
        {/* Hero Section */}
        <ProfessionalHero
          title="Permanent Recruitment Solutions for Education"
          subtitle="School Staff is the UK's leading permanent recruitment platform connecting educational institutions with qualified professionals. Streamline your hiring process with our comprehensive database and transparent flat-fee structure."
          highlights={[
            'Flat-fee pricing with no hidden costs',
            'Direct access to verified professionals',
            'Comprehensive compliance verification',
          ]}
          primaryCTA={{
            text: 'For Schools',
            href: '/for-schools',
          }}
          secondaryCTA={{
            text: 'For Education Professionals',
            href: '/for-staff',
          }}
        />

        {/* Statistics Section */}
        <ProfessionalStats
          title="Trusted by Educational Institutions Nationwide"
          stats={stats}
        />

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Why Leading Schools Choose School Staff
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our platform delivers comprehensive recruitment solutions designed for educational institutions
                </p>
              </div>
            </ScrollReveal>

            <StaggeredGrid columns={2} staggerDelay={150}>
              {features.map((feature, index) => (
                <ProfessionalFeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variant={feature.variant}
                />
              ))}
            </StaggeredGrid>
          </div>
        </section>

        {/* Process Section */}
        <ProfessionalProcess
          title="Streamlined Recruitment Process"
          subtitle="Four simple steps to transform your recruitment experience"
          steps={processSteps}
        />

        {/* Final CTA */}
        <ProfessionalCTASection
          title="Transform Your Recruitment Strategy"
          subtitle="Join hundreds of educational institutions leveraging our platform for efficient, cost-effective permanent recruitment."
          primaryButton={{
            text: 'Register as a School',
            href: '/signup?role=school',
          }}
          secondaryButton={{
            text: 'Register as a Professional',
            href: '/signup?role=staff',
          }}
        />
      </main>
    </PageContainer>
  )
}
