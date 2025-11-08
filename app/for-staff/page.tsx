'use client'

import { PageContainer } from '@/components/page-container'
import { ScrollReveal } from '@/components/scroll-reveal'
import { StaggeredGrid } from '@/components/staggered-grid'
import { ProfessionalFeatureCard } from '@/components/professional-feature-card'
import { ProfilePreviewShowcase } from '@/components/profile-preview-showcase'
import { SchoolCarousel } from '@/components/school-carousel'
import { ProfessionalCTASection } from '@/components/professional-cta-section'
import { 
  User,
  MessageSquare,
  Briefcase,
  Search,
  DollarSign,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function ForStaff() {
  const benefits = [
    {
      icon: User,
      title: 'Professional Profile Showcase',
      description: 'Develop a comprehensive profile highlighting your qualifications, experience, specializations, and unique value proposition. Enable institutions to discover your expertise.',
      variant: 'white' as const,
    },
    {
      icon: MessageSquare,
      title: 'Direct Institution Access',
      description: 'Eliminate agency intermediaries. Communicate directly with hiring institutions, schedule your own interviews, and negotiate terms transparently.',
      variant: 'white' as const,
    },
    {
      icon: Briefcase,
      title: 'Comprehensive Opportunity Access',
      description: 'Whether you\'re seeking leadership positions, classroom teaching roles, learning support, or specialized positions, our platform serves all education career paths.',
      variant: 'white' as const,
    },
    {
      icon: Search,
      title: 'Dual Application Approach',
      description: 'Browse posted vacancies and submit applications while maintaining visibility to institutions searching our database. Maximize your exposure to opportunities.',
      variant: 'white' as const,
    },
    {
      icon: DollarSign,
      title: 'Permanent Access at No Cost',
      description: 'Create your profile, apply to positions, and connect with institutions completely free. Our platform never charges education professionals.',
      variant: 'white' as const,
    },
  ]

  // Mock school data - replace with real data
  const schools = Array(10).fill(null).map((_, i) => ({
    id: `school-${i}`,
    name: `Example School ${i + 1}`,
    location: i % 3 === 0 ? 'London' : i % 3 === 1 ? 'Manchester' : 'Birmingham',
    openRoles: Math.floor(Math.random() * 5) + 1,
    type: 'Primary Academy',
  }))

  return (
    <PageContainer className="!px-0 !py-0 min-h-screen">
      {/* Centered Hero with Background */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden py-24 lg:py-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating badge */}
        <div className="absolute top-10 right-10 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-lg animate-bounce-subtle">
          100% Free Forever
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal animation="fade-down">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Advance Your Career in Education
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed">
              Join 2,000+ education professionals utilizing School Staff to secure permanent positions. Create your professional profile, showcase your qualifications, and connect directly with hiring institutions.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=staff"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Create Professional Profile
              </Link>
              <Link
                href="#opportunities"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-700 transform hover:scale-105 transition-all duration-300"
              >
                Browse Opportunities
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Education Professionals Choose Our Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to advance your education career in one professional platform
              </p>
            </div>
          </ScrollReveal>

          <StaggeredGrid columns={3} staggerDelay={100}>
            {benefits.map((benefit, index) => (
              <ProfessionalFeatureCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                variant={benefit.variant}
              />
            ))}
          </StaggeredGrid>
        </div>
      </section>

      {/* Profile Preview Showcase */}
      <ProfilePreviewShowcase />

      {/* School Carousel */}
      <div id="opportunities">
        <SchoolCarousel
          schools={schools}
          totalCount={500}
          isLoggedIn={false}
        />
      </div>

      {/* Roles Coverage - Expandable */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
              Comprehensive Position Coverage
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            {[
              {
                title: 'Teaching Positions',
                roles: [
                  'Head Teachers & Deputy Head Teachers',
                  'Primary Teachers (All Key Stages)',
                  'Secondary Teachers (All Subject Areas)',
                  'Early Years & Foundation Stage Teachers',
                  'Special Educational Needs Teachers & Specialists',
                ],
              },
              {
                title: 'Support Positions',
                roles: [
                  'Teaching Assistants & Learning Support',
                  'Higher Level Teaching Assistants (HLTA)',
                  'Special Educational Needs Support Staff',
                  'Cover Supervisors & Supply Teachers',
                  'Learning Mentors & Pastoral Support',
                ],
              },
              {
                title: 'Administrative & Operations',
                roles: [
                  'School Business Managers',
                  'Administrative & Office Staff',
                  'Site Managers & Caretakers',
                  'Midday Supervisors',
                  'Facilities & Cleaning Staff',
                ],
              },
            ].map((category, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-8 border-2 border-primary-100 hover:border-primary-300 transition-all">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <CheckCircle className="w-7 h-7 text-primary-600" />
                    {category.title}
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {category.roles.map((role, roleIndex) => (
                      <li key={roleIndex} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <ProfessionalCTASection
        title="Take the Next Step in Your Education Career"
        subtitle="Join thousands of education professionals who have secured their ideal permanent positions through our platform."
        primaryButton={{
          text: 'Create Your Profile',
          href: '/signup?role=staff',
        }}
        secondaryButton={{
          text: 'Browse Opportunities',
          href: '#opportunities',
        }}
        variant="accent"
      />
    </PageContainer>
  )
}
