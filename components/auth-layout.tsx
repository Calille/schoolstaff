import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle,
  showBackButton = true 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {showBackButton ? (
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          ) : (
            <Link href="/" className="text-2xl font-bold text-primary-600">
              School Staff
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-primary-100">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p>© 2025 School Staff. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

