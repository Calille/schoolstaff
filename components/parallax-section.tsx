'use client'

import { useEffect, useRef, useState } from 'react'

interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

/**
 * ParallaxSection Component
 * 
 * Creates a parallax scrolling effect for sections.
 * Adjusts element position based on scroll position.
 */
export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = '' 
}: ParallaxSectionProps) {
  const [offsetY, setOffsetY] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        setOffsetY(scrollPercent * 100 * speed)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div style={{ transform: `translateY(${offsetY}px)` }}>
        {children}
      </div>
    </div>
  )
}

