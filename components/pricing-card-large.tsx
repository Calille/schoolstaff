'use client'

import { ScrollReveal } from './scroll-reveal'
import { Check } from 'lucide-react'
import Link from 'next/link'

interface PricingCardLargeProps {
  price: string
  period?: string
  description: string
  features: string[]
  ctaText: string
  ctaHref: string
}

export function PricingCardLarge({
  price,
  period = 'per placement',
  description,
  features,
  ctaText,
  ctaHref,
}: PricingCardLargeProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
            Transparent Pricing Structure
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="zoom-in" delay={200}>
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-primary-200 p-12">
            {/* Main Pricing */}
            <div className="text-center mb-10">
              <div className="inline-flex items-baseline gap-2 mb-4">
                <span className="text-6xl md:text-7xl font-bold text-primary-600">{price}</span>
                <span className="text-2xl text-gray-600">{period}</span>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-lg text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href={ctaHref}
              className="block w-full py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center rounded-xl font-bold text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {ctaText}
            </Link>

            {/* Note */}
            <p className="text-center text-sm text-gray-500 mt-6">
              *Single payment per hire. All positions, all salary levels.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

