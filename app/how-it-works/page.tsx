import { PageContainer } from '@/components/page-container'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedSection } from '@/components/animated-section'
import { AnimatedGradientText } from '@/components/animated-gradient-text'
import { FloatingCard } from '@/components/floating-card'

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
          <AnimatedSection animation="fade-in-down">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Recruitment Process
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-up" delay={200}>
            <p className="text-xl text-gray-600">
              School Staff provides a transparent, efficient permanent recruitment platform. Direct connections between educational institutions and qualified professionals, without traditional agency barriers.
            </p>
          </AnimatedSection>
        </div>

        {/* Overview Section */}
        <section className="mb-12">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Two-Way Recruitment Marketplace
            </h2>
            <p className="text-gray-700 mb-6 text-center">
              School Staff operates as a comprehensive permanent recruitment platform serving both educational institutions and education professionals:
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">For Educational Institutions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Post permanent vacancies for professional applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Search our database of verified education professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Request interviews with qualified candidates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Complete placements with transparent flat-fee pricing</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">For Education Professionals:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Develop comprehensive professional profiles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Apply to institutional vacancies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Be discovered by institutions seeking specific expertise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span>Communicate directly with hiring decision-makers</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-center">Mutual Benefits:</h3>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">Elimination of agency intermediaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">Direct, transparent communication</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">Clear, predictable pricing structure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-700">Accelerated recruitment timelines</span>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* For Schools Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            The Institution Recruitment Process
          </h2>
          <div className="space-y-6">
            {[
              { num: 1, title: "Institution Registration", desc: "Establish your institutional account. Complete brief verification procedures and access our platform immediately.", list: null },
              { num: 2, title: "Candidate Discovery", desc: "Two complementary approaches to candidate sourcing:", list: [
                { strong: "Post Permanent Vacancies:", text: "Publish detailed job descriptions for our professional network to review and apply" },
                { strong: "Database Search:", text: "Browse professional profiles filtered by location, qualifications, experience, and specialization" }
              ]},
              { num: 3, title: "Candidate Review & Engagement", desc: null, list: [
                { text: "Evaluate applications from interested professionals" },
                { text: "Review profiles and request interviews with qualified candidates" },
                { text: "Utilize our secure messaging system for direct communication" },
                { text: "Schedule interviews at mutually convenient times" }
              ]},
              { num: 4, title: "Candidate Assessment", desc: "Conduct comprehensive interviews in person or virtually. Evaluate candidate suitability, assess cultural fit, and make informed hiring decisions.", list: null },
              { num: 5, title: "Placement Completion", desc: "Select your ideal candidate and finalize the placement. Process our one-time flat fee and receive compliance documentation support. Your new hire begins their position.", list: null }
            ].map((step, index) => (
              <AnimatedSection key={index} animation="fade-in-up" delay={index * 100}>
                <FloatingCard delay={index * 100}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      {step.desc && <p className="text-gray-600">{step.desc}</p>}
                      {step.list && (
                        <ul className="text-gray-600 list-disc list-inside space-y-1">
                          {step.list.map((item, i) => (
                            <li key={i}>
                              {'strong' in item && item.strong && <strong>{item.strong} </strong>}
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </FloatingCard>
              </AnimatedSection>
            ))}
          </div>
          <Card className="p-6 mt-6 bg-primary-50 border-primary-200">
            <p className="text-gray-700">
              <strong>Zero Investment Until Placement</strong> - Browse unlimited profiles, post unlimited vacancies, communicate with candidates, and conduct interviews at no cost. Investment occurs only upon successful placement.
            </p>
          </Card>
        </section>

        {/* For Staff Section */}
        <section className="mb-12">
          <AnimatedSection animation="fade-in">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              The Professional Career Path
            </h2>
          </AnimatedSection>
          <div className="space-y-6">
            {[
              { num: 1, title: "Professional Profile Creation", desc: "Register at no cost. Develop your comprehensive profile:", list: [
                { text: "Current role and professional title" },
                { text: "Qualifications and professional certifications" },
                { text: "Years of experience and career progression" },
                { text: "Subject specializations and expertise areas" },
                { text: "Professional biography and unique value proposition" },
                { text: "CV and compliance documentation" }
              ]},
              { num: 2, title: "Opportunity Discovery", desc: "Two approaches to position sourcing:", list: [
                { strong: "Professional Discovery:", text: "Institutions browse profiles and initiate contact" },
                { strong: "Active Application:", text: "Browse posted vacancies and apply to suitable positions" }
              ]},
              { num: 3, title: "Institution Engagement", desc: null, list: [
                { text: "Receive interview requests from interested institutions" },
                { text: "Apply to positions matching your qualifications and career objectives" },
                { text: "Communicate directly with institutions regarding opportunities" },
                { text: "Schedule interviews accommodating your availability" }
              ]},
              { num: 4, title: "Interview & Evaluation", desc: "Meet with institutions to discuss roles, responsibilities, and terms. Evaluate opportunities based on your career objectives without agency influence.", list: null },
              { num: 5, title: "Position Acceptance", desc: "Accept your ideal position and commence your new role. Straightforward, professional, efficient.", list: null }
            ].map((step, index) => (
              <AnimatedSection key={index} animation="fade-in-up" delay={index * 100}>
                <FloatingCard delay={index * 100}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      {step.desc && <p className="text-gray-600 mb-2">{step.desc}</p>}
                      {step.list && (
                        <ul className="text-gray-600 list-disc list-inside space-y-1">
                          {step.list.map((item, i) => (
                            <li key={i}>
                              {'strong' in item && item.strong && <strong>{item.strong} </strong>}
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </FloatingCard>
              </AnimatedSection>
            ))}
          </div>
          <Card className="p-6 mt-6 bg-green-50 border-green-200">
            <p className="text-gray-700">
              <strong>Permanent Free Access</strong> - Profile creation, position applications, and institution communication remain free indefinitely. No costs, no hidden fees, no charges to professionals.
            </p>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Platform Advantages
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">For Educational Institutions:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Flat-Fee Structure: Consistent pricing regardless of position or salary</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Immediate Access: No delays waiting for agency candidate sourcing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive Database: Access our complete professional network</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Full Control: Recruitment proceeds at your pace, following your protocols</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">For Education Professionals:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Permanent Free Access: Never pay to advance your career</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Direct Communication: Engage institutions directly, eliminating intermediaries</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Complete Transparency: View institutional details, roles, and expectations clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Enhanced Opportunities: Be discovered by institutions AND actively apply to positions</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">For All Users:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Accelerated Process: Direct communication expedites recruitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Superior Matching: Comprehensive information enables better decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Transparent Costs: Complete pricing clarity for all parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                  <span>Modern Platform: User-friendly interface, mobile-optimized experience</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-12">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Clear, Transparent Pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">For Educational Institutions:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Free institution registration</li>
                  <li>✓ Free unlimited vacancy postings</li>
                  <li>✓ Free unlimited professional profile access</li>
                  <li>✓ Free unlimited messaging and interview scheduling</li>
                  <li className="font-semibold text-gray-900 mt-4">£[Amount] flat fee per successful placement*</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  *Single fee applicable to all positions regardless of salary level
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">For Education Professionals:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="text-2xl font-bold text-gray-900">£0 - Permanent Free Access</li>
                  <li>No hidden costs or charges</li>
                  <li>No fees, ever</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Final CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Recruitment Experience?
            </h2>
            <p className="text-gray-600 mb-6">
              Join the modern approach to education recruitment.
            </p>
            <div className="flex gap-4 justify-center flex-wrap mb-6">
              <Link href="/signup">
                <Button size="lg">Register as Institution</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Register as Professional
                </Button>
              </Link>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Questions?</p>
              <div className="flex gap-4 justify-center">
                <Link href="/contact" className="text-gray-900 hover:underline">
                  Contact Us
                </Link>
                <span>|</span>
                <Link href="/faq" className="text-gray-900 hover:underline">
                  Frequently Asked Questions
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </PageContainer>
  )
}

