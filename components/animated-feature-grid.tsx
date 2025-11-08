'use client'

import { LucideIcon } from 'lucide-react'
import { AnimatedTextBox } from './animated-text-box'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface AnimatedFeatureGridProps {
  features: Feature[]
  columns?: 2 | 3 | 4
}

/**
 * AnimatedFeatureGrid Component
 * 
 * Grid of animated feature cards with staggered animations.
 * Supports 2, 3, or 4 column layouts.
 */
export function AnimatedFeatureGrid({ features, columns = 3 }: AnimatedFeatureGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-8`}>
      {features.map((feature, index) => (
        <AnimatedTextBox
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          delay={index * 100}
          variant={index % 2 === 0 ? 'primary' : 'secondary'}
        />
      ))}
    </div>
  )
}

