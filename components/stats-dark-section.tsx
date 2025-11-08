'use client'

import { ScrollReveal } from './scroll-reveal'
import { AnimatedCounter } from './animated-counter'
import { LucideIcon } from 'lucide-react'

interface Stat {
  icon: LucideIcon
  value: number
  suffix?: string
  prefix?: string
  label: string
}

interface StatsDarkSectionProps {
  stats: Stat[]
  title?: string
  subtitle?: string
}

export function StatsDarkSection({ stats, title, subtitle }: StatsDarkSectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {title && (
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xl text-primary-100">
                  {subtitle}
                </p>
              )}
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
                  <stat.icon className="w-10 h-10" />
                </div>
                <AnimatedCounter
                  end={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  className="text-6xl md:text-7xl font-bold mb-3"
                />
                <p className="text-xl text-primary-100 font-medium">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

