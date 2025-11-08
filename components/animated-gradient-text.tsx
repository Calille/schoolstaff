'use client'

interface AnimatedGradientTextProps {
  children: React.ReactNode
  className?: string
}

/**
 * AnimatedGradientText Component
 * 
 * Eye-catching animated gradient text effect using dark blue color scheme.
 */
export function AnimatedGradientText({ children, className = '' }: AnimatedGradientTextProps) {
  return (
    <span
      className={`
        bg-gradient-to-r from-primary-500 via-accent-blue to-primary-700 
        bg-clip-text text-transparent 
        animate-pulse-subtle
        ${className}
      `}
    >
      {children}
    </span>
  )
}

