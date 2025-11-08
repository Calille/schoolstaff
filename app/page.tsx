'use client'

import { PageContainer } from '@/components/page-container'
import { AsymmetricHero } from '@/components/asymmetric-hero'
import { AlternatingFeatureSection } from '@/components/alternating-feature-section'
import { StatsDarkSection } from '@/components/stats-dark-section'
import { SplitCTASection } from '@/components/split-cta-section'
import { ProfessionalCTASection } from '@/components/professional-cta-section'
import { 
  DollarSign, 
  Users, 
  Zap, 
  Shield,
  School,
  User,
  Building,
  Award
} from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: DollarSign,
      title: 'Transparent Flat-Fee Pricing',
      description: 'Our straightforward pricing model eliminates commission-based fees. One competitive flat fee per successful placement, regardless of salary level or position. Predictable costs, exceptional value for schools nationwide.',
    },
    {
      icon: Users,
      title: 'Comprehensive Role Coverage',
      description: 'From executive leadership to support staff, we facilitate placements across all educational roles. Our platform serves Head Teachers, Classroom Teachers, Teaching Assistants, Administrative Personnel, Facilities Staff, and every position in between.',
    },
    {
      icon: Zap,
      title: 'Direct Candidate Access',
      description: 'Browse verified professional profiles, schedule interviews, and communicate directly with candidates. Our platform eliminates intermediaries, reducing time-to-hire and significantly improving candidate quality through direct engagement.',
    },
    {
      icon: Shield,
      title: 'Rigorous Compliance Verification',
      description: 'All professionals maintain current DBS checks, safeguarding certifications, and relevant qualifications. Our comprehensive verification process ensures full regulatory compliance and complete peace of mind for hiring schools.',
    },
  ]

  const stats = [
    { 
      icon: Building,
      value: 500, 
      suffix: '+', 
      label: 'Registered Schools' 
    },
    { 
      icon: Users,
      value: 2000, 
      suffix: '+', 
      label: 'Education Professionals' 
    },
    { 
      icon: Award,
      value: 1500, 
      suffix: '+', 
      label: 'Successful Placements' 
    },
  ]

  return (
    <PageContainer className="!px-0 !py-0 min-h-screen">
      {/* Asymmetric Hero */}
      <AsymmetricHero
        title="Permanent Recruitment Solutions for Education"
        subtitle="School Staff is the UK's leading permanent recruitment platform connecting schools with qualified professionals. Streamline your hiring process with our comprehensive database and transparent flat-fee structure."
        highlights={[
          'Flat-fee pricing with no hidden costs',
          'Direct access to 2,000+ verified professionals',
          'Comprehensive compliance verification included',
        ]}
        primaryCTA={{
          text: 'For Schools',
          href: '/for-schools',
        }}
        secondaryCTA={{
          text: 'For Education Professionals',
          href: '/for-staff',
        }}
        showIllustration={true}
      />

      {/* Alternating Features */}
      <AlternatingFeatureSection
        sectionTitle="Why Leading Schools Choose School Staff"
        sectionSubtitle="Comprehensive recruitment solutions designed specifically for schools"
        features={features}
      />

      {/* Stats with Dark Background */}
      <StatsDarkSection
        title="Trusted by Schools Nationwide"
        subtitle="Join hundreds of schools and thousands of professionals transforming education recruitment"
        stats={stats}
      />

      {/* Split CTA Section */}
      <SplitCTASection
        leftSide={{
          icon: <School className="w-16 h-16" />,
          title: 'For Schools',
          benefits: [
            'Access 2,000+ verified professionals',
            'One transparent flat fee per hire',
            'Post unlimited job vacancies',
            'Direct candidate communication',
          ],
          ctaText: 'Register Your School',
          ctaHref: '/for-schools',
        }}
        rightSide={{
          icon: <User className="w-16 h-16" />,
          title: 'For Education Professionals',
          benefits: [
            '100% free forever - no charges',
            'Browse 500+ school vacancies',
            'Be discovered by hiring schools',
            'Direct interview scheduling',
          ],
          ctaText: 'Create Your Profile',
          ctaHref: '/for-staff',
        }}
      />

      {/* Final CTA */}
      <ProfessionalCTASection
        title="Transform Your Recruitment Strategy"
        subtitle="Join hundreds of schools leveraging our platform for efficient, cost-effective permanent recruitment."
        primaryButton={{
          text: 'Get Started Today',
          href: '/signup',
        }}
        secondaryButton={{
          text: 'Learn More',
          href: '/how-it-works',
        }}
      />
    </PageContainer>
  )
}
