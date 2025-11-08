'use client'

import { ScrollReveal } from './scroll-reveal'
import { LucideIcon } from 'lucide-react'

interface ProcessStep {
  number: string
  title: string
  description: string
  icon?: LucideIcon
}

interface ProfessionalProcessProps {
  title: string
  subtitle?: string
  steps: ProcessStep[]
}

/**
 * ProfessionalProcess Component
 * 
 * Professional process/steps component with alternating layout.
 * Shows step-by-step processes with icons and descriptions.
 */
export function ProfessionalProcess({ title, subtitle, steps }: ProfessionalProcessProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary-200 transform -translate-x-1/2" />

          <div className="space-y-16">
            {steps.map((step, index) => (
              <ScrollReveal
                key={index}
                animation={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                delay={index * 100}
              >
                <div className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className="flex-1">
                    <div className={`max-w-xl ${index % 2 === 0 ? 'lg:ml-auto lg:text-right' : 'lg:text-left'}`}>
                      <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-bold text-sm mb-4">
                        {step.number}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon/Number Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white shadow-xl">
                      {step.icon ? (
                        <step.icon className="w-12 h-12" />
                      ) : (
                        <span className="text-4xl font-bold">{index + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

