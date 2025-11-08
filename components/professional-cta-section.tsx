'use client'

import { ScrollReveal } from './scroll-reveal'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ProfessionalCTASectionProps {
  title: string
  subtitle: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
  variant?: 'primary' | 'accent'
}

/**
 * ProfessionalCTASection Component
 * 
 * Professional call-to-action section with gradient background
 * and scroll-triggered animations.
 */
export function ProfessionalCTASection({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  variant = 'primary',
}: ProfessionalCTASectionProps) {
  const variants = {
    primary: 'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900',
    accent: 'bg-gradient-to-br from-primary-600 to-primary-800',
  }

  return (
    <section className={`py-20 ${variants[variant]} text-white relative overflow-hidden`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full filter blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <ScrollReveal animation="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {title}
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200}>
          <p className="text-xl md:text-2xl text-primary-100 mb-10 leading-relaxed">
            {subtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={primaryButton.href}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-primary-700 rounded-lg font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
            >
              {primaryButton.text}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className="inline-flex items-center justify-center px-10 py-5 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-primary-700 transform hover:scale-105 transition-all duration-300"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

