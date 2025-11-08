'use client'

import { useEffect, useRef, useState } from 'react'
import { LucideIcon } from 'lucide-react'

interface AnimatedTextBoxProps {
  icon?: LucideIcon
  title: string
  description: string
  delay?: number
  variant?: 'primary' | 'secondary' | 'accent'
}

/**
 * AnimatedTextBox Component
 * 
 * Stylish animated box with icon, title, and description.
 * Supports different color variants and staggered animations.
 */
export function AnimatedTextBox({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0,
  variant = 'primary' 
}: AnimatedTextBoxProps) {
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

  const variantStyles = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-700 text-white',
    secondary: 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-primary-200',
    accent: 'bg-gradient-to-br from-accent-light-blue to-primary-500 text-white'
  }

  return (
    <div
      ref={ref}
      className={`
        p-6 rounded-xl shadow-lg transform transition-all duration-700
        hover:scale-105 hover:shadow-2xl
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        ${variantStyles[variant]}
      `}
    >
      {Icon && (
        <div className="mb-4">
          <Icon className="w-10 h-10 animate-bounce-subtle" />
        </div>
      )}
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className={`text-base ${variant === 'secondary' ? 'text-gray-700' : 'text-white/90'}`}>
        {description}
      </p>
    </div>
  )
}

