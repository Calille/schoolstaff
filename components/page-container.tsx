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
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`container mx-auto px-4 py-12 flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

