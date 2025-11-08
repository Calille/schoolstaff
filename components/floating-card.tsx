'use client'

interface FloatingCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

/**
 * FloatingCard Component
 * 
 * Card with subtle floating animation for visual interest.
 * Perfect for feature cards and content sections.
 */
export function FloatingCard({ children, delay = 0, className = '' }: FloatingCardProps) {
  return (
    <div
      className={`
        animate-float rounded-2xl p-8 
        bg-white shadow-xl border border-primary-100
        transition-all duration-300
        hover:shadow-2xl hover:border-primary-300
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

