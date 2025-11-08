'use client'

import { ScrollReveal } from './scroll-reveal'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
}

interface AlternatingFeatureSectionProps {
  features: Feature[]
  sectionTitle?: string
  sectionSubtitle?: string
}

export function AlternatingFeatureSection({
  features,
  sectionTitle,
  sectionSubtitle,
}: AlternatingFeatureSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {sectionTitle && (
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {sectionTitle}
              </h2>
              {sectionSubtitle && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {sectionSubtitle}
                </p>
              )}
            </div>
          </ScrollReveal>
        )}

        <div className="space-y-32">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Text Content */}
              <ScrollReveal
                animation={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                duration={600}
                className={index % 2 === 1 ? 'lg:col-start-2' : ''}
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-100 text-primary-600">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>

              {/* Image */}
              <ScrollReveal
                animation={index % 2 === 0 ? 'fade-left' : 'fade-right'}
                delay={200}
                duration={600}
                className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}
              >
                <div className="relative">
                  {feature.imageSrc ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={feature.imageSrc}
                        alt={feature.imageAlt || feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    // Placeholder
                    <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-2xl">
                      <feature.icon className="w-24 h-24 text-primary-600" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

