'use client'

import { ScrollReveal } from './scroll-reveal'
import { AnimatedCounter } from './animated-counter'

interface Stat {
  value: number
  suffix?: string
  prefix?: string
  label: string
}

interface ProfessionalStatsProps {
  stats: Stat[]
  title?: string
  subtitle?: string
}

/**
 * ProfessionalStats Component
 * 
 * Professional statistics showcase with animated counters.
 * Displays key metrics with scroll-triggered animations.
 */
export function ProfessionalStats({ stats, title, subtitle }: ProfessionalStatsProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {title && (
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} animation="zoom-in" delay={index * 150}>
              <div className="text-center">
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  className="text-6xl md:text-7xl font-bold text-primary-600 mb-3"
                />
                <p className="text-xl text-gray-700 font-medium">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

