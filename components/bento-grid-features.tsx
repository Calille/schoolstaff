'use client'

import { ScrollReveal } from './scroll-reveal'
import { LucideIcon } from 'lucide-react'

interface BentoFeature {
  icon: LucideIcon
  title: string
  description: string
  size: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'accent'
}

interface BentoGridFeaturesProps {
  features: BentoFeature[]
  sectionTitle?: string
}

export function BentoGridFeatures({ features, sectionTitle }: BentoGridFeaturesProps) {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1'
      case 'medium':
        return 'col-span-1 md:col-span-2 row-span-1'
      case 'large':
        return 'col-span-1 md:col-span-2 row-span-2'
      default:
        return 'col-span-1'
    }
  }

  const getVariantClasses = (variant: string = 'primary') => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-primary-600 to-primary-800 text-white'
      case 'secondary':
        return 'bg-white border-2 border-primary-200 text-gray-900'
      case 'accent':
        return 'bg-gradient-to-br from-primary-100 to-primary-200 text-primary-900'
      default:
        return 'bg-white border-2 border-gray-200 text-gray-900'
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {sectionTitle && (
          <ScrollReveal animation="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-16">
              {sectionTitle}
            </h2>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-6">
          {features.map((feature, index) => (
            <ScrollReveal
              key={index}
              animation="zoom-in"
              delay={index * 100}
              duration={500}
              className={getSizeClasses(feature.size)}
            >
              <div
                className={`
                  h-full min-h-[200px] p-6 md:p-8 rounded-3xl shadow-lg
                  transform hover:scale-105 hover:shadow-2xl
                  transition-all duration-300
                  flex flex-col justify-between
                  ${getVariantClasses(feature.variant)}
                `}
              >
                <div>
                  <div className={`
                    inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
                    ${feature.variant === 'secondary' ? 'bg-primary-100 text-primary-600' : 'bg-white/20 text-current'}
                  `}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{feature.title}</h3>
                </div>
                <p className={`
                  text-sm md:text-base leading-relaxed
                  ${feature.variant === 'primary' ? 'text-white/90' : 'text-gray-600'}
                `}>
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

