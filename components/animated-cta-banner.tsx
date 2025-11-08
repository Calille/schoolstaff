'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface AnimatedCTABannerProps {
  title: string
  subtitle: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

/**
 * AnimatedCTABanner Component
 * 
 * Eye-catching animated call-to-action banner with gradient background
 * and animated background elements.
 */
export function AnimatedCTABanner({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
}: AnimatedCTABannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-accent-blue rounded-3xl p-12 my-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
          {title}
        </h2>
        <p className="text-xl text-white/90 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href={primaryButtonLink}
            className="
              inline-flex items-center gap-2 
              px-8 py-4 
              bg-white text-primary-600 
              rounded-full font-semibold text-lg
              shadow-lg hover:shadow-2xl
              transform hover:scale-105
              transition-all duration-300
              group
            "
          >
            {primaryButtonText}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          {secondaryButtonText && secondaryButtonLink && (
            <Link
              href={secondaryButtonLink}
              className="
                px-8 py-4 
                border-2 border-white text-white 
                rounded-full font-semibold text-lg
                hover:bg-white hover:text-primary-600
                transform hover:scale-105
                transition-all duration-300
              "
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

