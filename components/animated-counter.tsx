'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

/**
 * AnimatedCounter Component
 * 
 * Animates a number from 0 to the target value when it enters the viewport.
 * Uses easing function for smooth animation.
 */
export function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = '' 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
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
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Ease out quadratic function for smooth deceleration
      const easeOutQuad = (t: number) => t * (2 - t)
      const currentCount = Math.floor(easeOutQuad(progress) * (end - startValue) + startValue)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  )
}

