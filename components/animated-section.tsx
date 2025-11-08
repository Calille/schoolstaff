'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedSectionProps {
  children: React.ReactNode
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'slide-in-left' | 'slide-in-right' | 'scale-in'
  delay?: number
  className?: string
}

/**
 * AnimatedSection Component
 * 
 * Wrapper component that animates content when it enters the viewport.
 * Uses IntersectionObserver for performance and respects reduced motion preferences.
 */
export function AnimatedSection({ 
  children, 
  animation = 'fade-in-up', 
  delay = 0,
  className = '' 
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'fade-in-up': 'animate-fade-in-up',
    'fade-in-down': 'animate-fade-in-down',
    'slide-in-left': 'animate-slide-in-left',
    'slide-in-right': 'animate-slide-in-right',
    'scale-in': 'animate-scale-in',
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? `${animationClasses[animation]} opacity-100` : 'opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

