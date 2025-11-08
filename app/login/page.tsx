'use client'

import { AuthLayout } from '@/components/auth-layout'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      // Get user profile to determine redirect
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        // Redirect based on role or onboarding status
        if (!profile?.role) {
          router.push('/onboarding')
        } else if (profile.role === 'school') {
          router.push('/dashboard/school')
        } else if (profile.role === 'staff') {
          router.push('/dashboard/staff')
        } else {
          router.push('/onboarding')
        }
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your School Staff account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full pl-12 pr-4 py-3 
                border-2 border-gray-200 rounded-lg 
                focus:border-primary-500 focus:ring-4 focus:ring-primary-100 
                outline-none transition-all
                text-gray-900
              "
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                w-full pl-12 pr-4 py-3 
                border-2 border-gray-200 rounded-lg 
                focus:border-primary-500 focus:ring-4 focus:ring-primary-100 
                outline-none transition-all
                text-gray-900
              "
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          <Link 
            href="/forgot-password"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-4 
            bg-gradient-to-r from-primary-600 to-primary-700 
            text-white font-bold text-lg rounded-lg
            shadow-lg hover:shadow-xl
            transform hover:scale-105
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Sign Up Link */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/signup"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
