'use client'

import { ScrollReveal } from './scroll-reveal'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SplitCTASectionProps {
  leftSide: {
    icon: React.ReactNode
    title: string
    benefits: string[]
    ctaText: string
    ctaHref: string
  }
  rightSide: {
    icon: React.ReactNode
    title: string
    benefits: string[]
    ctaText: string
    ctaHref: string
  }
}

export function SplitCTASection({ leftSide, rightSide }: SplitCTASectionProps) {
  return (
    <section className="py-0 my-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Side - Schools */}
          <ScrollReveal animation="fade-right" duration={600}>
            <Link href={leftSide.ctaHref} className="block group">
              <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12 h-full min-h-[500px] flex flex-col justify-between transform transition-all duration-300 group-hover:scale-[1.02]">
                <div>
                  <div className="mb-6">
                    {leftSide.icon}
                  </div>
                  <h3 className="text-4xl font-bold mb-6">{leftSide.title}</h3>
                  <ul className="space-y-4 mb-8">
                    {leftSide.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1" />
                        <span className="text-lg text-white/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="inline-flex items-center gap-2 text-lg font-semibold group-hover:gap-4 transition-all">
                  {leftSide.ctaText}
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </ScrollReveal>

          {/* Right Side - Staff */}
          <ScrollReveal animation="fade-left" duration={600}>
            <Link href={rightSide.ctaHref} className="block group">
              <div className="bg-gradient-to-br from-primary-800 to-primary-950 text-white p-12 h-full min-h-[500px] flex flex-col justify-between transform transition-all duration-300 group-hover:scale-[1.02]">
                <div>
                  <div className="mb-6">
                    {rightSide.icon}
                  </div>
                  <h3 className="text-4xl font-bold mb-6">{rightSide.title}</h3>
                  <ul className="space-y-4 mb-8">
                    {rightSide.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 flex-shrink-0 mt-1" />
                        <span className="text-lg text-white/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="inline-flex items-center gap-2 text-lg font-semibold group-hover:gap-4 transition-all">
                  {rightSide.ctaText}
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

