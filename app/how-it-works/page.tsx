'use client'

import { ScrollReveal } from '@/components/scroll-reveal'
import { ProfessionalProcess } from '@/components/professional-process'
import { ProfessionalCTASection } from '@/components/professional-cta-section'
import { 
  School,
  User,
  ArrowRight,
  CheckCircle,
  X,
  UserCheck,
  Search,
  MessageSquare,
  Award,
  Calendar,
  Briefcase
} from 'lucide-react'
import { useState } from 'react'

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'schools' | 'staff'>('schools')

  const schoolSteps = [
    {
      number: 'Step 1',
      title: 'Institution Registration',
      description: 'Establish your institutional account in under 5 minutes. Complete brief verification procedures and access our comprehensive platform immediately upon approval.',
      icon: UserCheck,
    },
    {
      number: 'Step 2',
      title: 'Candidate Discovery',
      description: 'Two complementary approaches: Post detailed permanent vacancies for our professional network to review, or browse our database with advanced filters by location, qualifications, and experience.',
      icon: Search,
    },
    {
      number: 'Step 3',
      title: 'Candidate Review & Engagement',
      description: 'Evaluate applications from interested professionals, review comprehensive profiles, and request interviews. Utilize our secure messaging system for direct, transparent communication.',
      icon: MessageSquare,
    },
    {
      number: 'Step 4',
      title: 'Candidate Assessment',
      description: 'Conduct comprehensive interviews in person or virtually. Evaluate candidate suitability, assess cultural fit, and make informed hiring decisions without agency pressure.',
      icon: Calendar,
    },
    {
      number: 'Step 5',
      title: 'Placement Completion',
      description: 'Select your ideal candidate and finalize the placement. Process our one-time flat fee, receive compliance documentation support, and welcome your new hire to the team.',
      icon: Award,
    },
  ]

  const staffSteps = [
    {
      number: 'Step 1',
      title: 'Professional Profile Creation',
      description: 'Register at no cost and develop your comprehensive professional profile including current role, qualifications, experience, specializations, professional biography, and compliance documentation.',
      icon: User,
    },
    {
      number: 'Step 2',
      title: 'Opportunity Discovery',
      description: 'Two approaches to position sourcing: Be discovered by institutions browsing our database, or actively search and apply to posted vacancies matching your qualifications and career objectives.',
      icon: Search,
    },
    {
      number: 'Step 3',
      title: 'Institution Engagement',
      description: 'Receive interview requests from interested institutions, apply to roles matching your skills, communicate directly regarding opportunities, and schedule interviews accommodating your availability.',
      icon: MessageSquare,
    },
    {
      number: 'Step 4',
      title: 'Interview & Evaluation',
      description: 'Meet with institutions to discuss roles, responsibilities, compensation, and terms. Evaluate opportunities based on your career objectives without agency influence or pressure.',
      icon: Calendar,
    },
    {
      number: 'Step 5',
      title: 'Position Acceptance',
      description: 'Accept your ideal position and commence your new role. Straightforward, professional, efficient - exactly as recruitment should be in modern education.',
      icon: CheckCircle,
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Simple Centered Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal animation="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Recruitment Process
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-xl text-gray-600 mb-12">
              School Staff provides a transparent, efficient permanent recruitment platform. Direct connections between educational institutions and qualified professionals, without traditional agency barriers.
            </p>
          </ScrollReveal>

          {/* Visual Diagram */}
          <ScrollReveal animation="zoom-in" delay={400}>
            <div className="flex items-center justify-center gap-6 mb-12">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center mb-3">
                  <School className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Schools</span>
              </div>

              <ArrowRight className="w-8 h-8 text-primary-600" />

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mb-3">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Platform</span>
              </div>

              <ArrowRight className="w-8 h-8 text-primary-600" />

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center mb-3">
                  <User className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Staff</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview Section - Side by Side */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
              Two-Way Recruitment Marketplace
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Schools */}
            <ScrollReveal animation="slide-in-left">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl p-10">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <School className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-6">For Educational Institutions</h3>
                <ul className="space-y-4">
                  {[
                    'Post permanent vacancies for professional applications',
                    'Search our database of verified education professionals',
                    'Request interviews with qualified candidates',
                    'Complete placements with transparent flat-fee pricing',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* For Staff */}
            <ScrollReveal animation="slide-in-right">
              <div className="bg-gradient-to-br from-primary-800 to-primary-950 text-white rounded-2xl p-10">
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-6">For Education Professionals</h3>
                <ul className="space-y-4">
                  {[
                    'Develop comprehensive professional profiles',
                    'Apply to institutional vacancies directly',
                    'Be discovered by institutions seeking specific expertise',
                    'Communicate directly with hiring decision-makers',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Shared Benefits */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mt-12 text-center">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Mutual Benefits</h4>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  'No agency intermediaries',
                  'Direct, transparent communication',
                  'Clear, predictable pricing',
                  'Accelerated recruitment timelines',
                ].map((benefit, index) => (
                  <div key={index} className="p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                    <CheckCircle className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tabbed Process Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-16">
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                activeTab === 'schools'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              School Process
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                activeTab === 'staff'
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Staff Process
            </button>
          </div>

          {/* Process Steps */}
          {activeTab === 'schools' ? (
            <ProfessionalProcess
              title="The Institution Recruitment Process"
              steps={schoolSteps}
            />
          ) : (
            <ProfessionalProcess
              title="The Professional Career Path"
              steps={staffSteps}
            />
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
              Platform Advantages
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="zoom-in" delay={200}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary-600 text-white">
                    <th className="p-6 text-left text-lg font-bold">Feature</th>
                    <th className="p-6 text-center text-lg font-bold">Traditional Agency</th>
                    <th className="p-6 text-center text-lg font-bold bg-primary-700">School Staff</th>
                    <th className="p-6 text-center text-lg font-bold">Direct Hiring</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Cost Structure', traditional: '15-25% of salary', schoolStaff: 'Flat fee (£2,500)', direct: 'Free' },
                    { feature: 'Time to Hire', traditional: '4-8 weeks', schoolStaff: '1-3 weeks', direct: '8-12 weeks' },
                    { feature: 'Candidate Pool', traditional: 'Limited', schoolStaff: '2,000+ verified', direct: 'Limited reach' },
                    { feature: 'Direct Communication', traditional: false, schoolStaff: true, direct: true },
                    { feature: 'Compliance Verified', traditional: true, schoolStaff: true, direct: false },
                    { feature: 'Post Unlimited Jobs', traditional: false, schoolStaff: true, direct: true },
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-6 font-semibold text-gray-900">{row.feature}</td>
                      <td className="p-6 text-center text-gray-700">
                        {typeof row.traditional === 'boolean' ? (
                          row.traditional ? (
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-red-600 mx-auto" />
                          )
                        ) : (
                          row.traditional
                        )}
                      </td>
                      <td className="p-6 text-center font-bold bg-primary-50">
                        {typeof row.schoolStaff === 'boolean' ? (
                          row.schoolStaff ? (
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-red-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-primary-700">{row.schoolStaff}</span>
                        )}
                      </td>
                      <td className="p-6 text-center text-gray-700">
                        {typeof row.direct === 'boolean' ? (
                          row.direct ? (
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                          ) : (
                            <X className="w-6 h-6 text-red-600 mx-auto" />
                          )
                        ) : (
                          row.direct
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pricing Transparency */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
              Clear, Transparent Pricing
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Schools Pricing */}
            <ScrollReveal animation="slide-in-left">
              <div className="bg-white rounded-2xl shadow-xl p-10 border-2 border-primary-200">
                <div className="text-center mb-8">
                  <School className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">For Schools</h3>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Free institution registration',
                    'Free unlimited vacancy postings',
                    'Free unlimited professional profile access',
                    'Free unlimited messaging and interview scheduling',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center pt-8 border-t border-gray-200">
                  <p className="text-6xl font-bold text-primary-600 mb-2">£2,500</p>
                  <p className="text-gray-600 font-semibold">flat fee per hire*</p>
                  <p className="text-sm text-gray-500 mt-4">*All positions, all salary levels</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Staff Pricing */}
            <ScrollReveal animation="slide-in-right">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white rounded-2xl shadow-xl p-10">
                <div className="text-center mb-8">
                  <User className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold mb-2">For Professionals</h3>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    'Free professional registration',
                    'Free profile creation and management',
                    'Free unlimited job applications',
                    'Free unlimited messaging and interviews',
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-center pt-8 border-t border-white/20">
                  <p className="text-6xl font-bold mb-2">£0</p>
                  <p className="font-semibold text-xl">Forever free</p>
                  <p className="text-sm text-primary-100 mt-4">No hidden costs, no charges, ever</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <ProfessionalCTASection
        title="Ready to Transform Your Recruitment Experience?"
        subtitle="Join the modern approach to education recruitment. Direct connections, transparent pricing, exceptional results."
        primaryButton={{
          text: 'Register as Institution',
          href: '/signup?role=school',
        }}
        secondaryButton={{
          text: 'Register as Professional',
          href: '/signup?role=staff',
        }}
        variant="primary"
      />
    </main>
  )
}
