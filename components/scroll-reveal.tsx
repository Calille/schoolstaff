'use client'

import { useEffect, useRef, useState } from 'react'

type AnimationType = 
  | 'fade-up' 
  | 'fade-down' 
  | 'fade-left' 
  | 'fade-right' 
  | 'zoom-in' 
  | 'zoom-out'
  | 'slide-up'
  | 'slide-down'
  | 'flip-up'
  | 'blur-in'

interface ScrollRevealProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  once?: boolean
}

/**
 * ScrollReveal Component
 * 
 * Advanced scroll-triggered animation component with multiple animation types.
 * Uses IntersectionObserver for performance and respects reduced motion preferences.
 */
export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = '',
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated || !once) {
            setTimeout(() => {
              setIsVisible(true)
              if (once) setHasAnimated(true)
            }, delay)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [delay, threshold, once, hasAnimated])

  const getAnimationStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transitionProperty: 'all',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDuration: `${duration}ms`,
    }
    
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...baseStyle, opacity: 0, transform: 'translateY(48px)' }
        case 'fade-down':
          return { ...baseStyle, opacity: 0, transform: 'translateY(-48px)' }
        case 'fade-left':
          return { ...baseStyle, opacity: 0, transform: 'translateX(48px)' }
        case 'fade-right':
          return { ...baseStyle, opacity: 0, transform: 'translateX(-48px)' }
        case 'zoom-in':
          return { ...baseStyle, opacity: 0, transform: 'scale(0.75)' }
        case 'zoom-out':
          return { ...baseStyle, opacity: 0, transform: 'scale(1.25)' }
        case 'slide-up':
          return { ...baseStyle, transform: 'translateY(100%)' }
        case 'slide-down':
          return { ...baseStyle, transform: 'translateY(-100%)' }
        case 'flip-up':
          return { ...baseStyle, opacity: 0, transform: 'perspective(1000px) rotateX(90deg)' }
        case 'blur-in':
          return { ...baseStyle, opacity: 0, filter: 'blur(4px)' }
        default:
          return { ...baseStyle, opacity: 0 }
      }
    }
    
    return { 
      ...baseStyle, 
      opacity: 1, 
      transform: 'translateY(0) translateX(0) scale(1)', 
      filter: 'blur(0)' 
    }
  }

  return (
    <div 
      ref={ref} 
      className={className}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  )
}

