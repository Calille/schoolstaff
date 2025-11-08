'use client'

import { ScrollReveal } from './scroll-reveal'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ProfessionalHeroProps {
  title: string
  subtitle: string
  highlights?: string[]
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  backgroundPattern?: boolean
}

/**
 * ProfessionalHero Component
 * 
 * Professional hero section with modern layout, gradient background,
 * and scroll-triggered animations.
 */
export function ProfessionalHero({
  title,
  subtitle,
  highlights = [],
  primaryCTA,
  secondaryCTA,
  backgroundPattern = true,
}: ProfessionalHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white overflow-hidden">
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="max-w-4xl">
          <ScrollReveal animation="fade-down" duration={600}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {title}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200} duration={600}>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              {subtitle}
            </p>
          </ScrollReveal>

          {highlights.length > 0 && (
            <ScrollReveal animation="fade-up" delay={400} duration={600}>
              <div className="flex flex-col gap-3 mb-10">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-lg text-primary-50">{highlight}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal animation="fade-up" delay={600} duration={600}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={primaryCTA.href}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                {primaryCTA.text}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {secondaryCTA && (
                <Link
                  href={secondaryCTA.href}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-700 transform hover:scale-105 transition-all duration-300"
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}

