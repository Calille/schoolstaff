import { ReactNode } from 'react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Page Container Component
 * 
 * Wraps marketing pages with navbar and footer.
 * Provides consistent layout and responsive design.
 * 
 * @param children - Page content
 * @param className - Additional CSS classes
 */
export function PageContainer({ children, className = '' }: PageContainerProps) {
  // If className includes !px-0 or !py-0, remove container constraints for full-width layouts
  const isFullWidth = className.includes('!px-0') || className.includes('!py-0')
  const mainClasses = isFullWidth 
    ? `flex-1 ${className}` 
    : `container mx-auto px-4 py-12 flex-1 ${className}`
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={mainClasses}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

