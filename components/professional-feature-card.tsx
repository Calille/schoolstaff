'use client'

import { LucideIcon } from 'lucide-react'

interface ProfessionalFeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  variant?: 'primary' | 'white' | 'accent'
}

/**
 * ProfessionalFeatureCard Component
 * 
 * Professional feature card with icon, title, and description.
 * Supports multiple visual variants with hover effects.
 */
export function ProfessionalFeatureCard({
  icon: Icon,
  title,
  description,
  variant = 'white',
}: ProfessionalFeatureCardProps) {
  const variants = {
    primary: 'bg-gradient-to-br from-primary-600 to-primary-800 text-white border-primary-700',
    white: 'bg-white text-gray-900 border-gray-200 hover:border-primary-300',
    accent: 'bg-gradient-to-br from-primary-50 to-primary-100 text-primary-900 border-primary-200',
  }

  const iconVariants = {
    primary: 'text-white bg-white/20',
    white: 'text-primary-600 bg-primary-50',
    accent: 'text-primary-700 bg-white',
  }

  return (
    <div
      className={`
        p-8 rounded-2xl border-2 shadow-lg
        transform hover:scale-105 hover:shadow-2xl
        transition-all duration-300
        ${variants[variant]}
      `}
    >
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${iconVariants[variant]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className={`text-lg leading-relaxed ${variant === 'white' ? 'text-gray-600' : 'text-current opacity-90'}`}>
        {description}
      </p>
    </div>
  )
}

