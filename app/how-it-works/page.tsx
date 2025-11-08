import { PageContainer } from '@/components/page-container'
import { Card } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

/**
 * How It Works Page
 * 
 * Explains the process of booking staff through the platform.
 * Includes step-by-step guide and benefits.
 */
export default function HowItWorksPage() {
  const steps = [
    {
      number: '1',
      title: 'Create Your Account',
      description: 'Sign up as a school and complete your profile with your school details.',
    },
    {
      number: '2',
      title: 'Request Staff',
      description: 'Submit a booking request with dates, times, and requirements.',
    },
    {
      number: '3',
      title: 'We Match & Assign',
      description: 'Our team reviews your request and assigns qualified staff members.',
    },
    {
      number: '4',
      title: 'Confirm & Track',
      description: 'Review the assignment, confirm details, and track your booking status.',
    },
  ]

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          How It Works
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          Simple, straightforward process to get the staff you need.
        </p>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <Card className="p-8 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Why Schools Choose Us
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Fast response times',
              'Verified and qualified staff',
              'Easy booking management',
              'Dedicated support team',
              'Flexible scheduling options',
              'Competitive pricing',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gray-900" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

