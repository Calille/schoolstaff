'use client'

import { ScrollReveal } from './scroll-reveal'

interface StaggeredGridProps {
  children: React.ReactNode[]
  columns?: 2 | 3 | 4
  staggerDelay?: number
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in'
  className?: string
}

/**
 * StaggeredGrid Component
 * 
 * Grid layout with staggered animation delays for visual interest.
 * Each child animates in sequence with a configurable delay.
 */
export function StaggeredGrid({
  children,
  columns = 3,
  staggerDelay = 100,
  animation = 'fade-up',
  className = '',
}: StaggeredGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-8 ${className}`}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          duration={600}
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}

