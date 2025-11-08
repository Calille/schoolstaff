'use client'

import { AuthLayout } from '@/components/auth-layout'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Building, ArrowRight, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [role, setRole] = useState<'school' | 'staff'>('school')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      // Sign up user - this will trigger the handle_new_user() function
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            role: role,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setIsLoading(false)
        return
      }

      if (!authData.user) {
        setError('Failed to create account')
        setIsLoading(false)
        return
      }

      // Update profile with full_name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: formData.name, role: role })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        // Don't fail here, profile was created by trigger
      }

      // Redirect to onboarding to complete setup
      router.push('/onboarding')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join School Staff today"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            I am a...
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('school')}
              className={`
                p-4 rounded-lg border-2 font-semibold transition-all
                ${role === 'school' 
                  ? 'border-primary-600 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Building className="w-6 h-6 mx-auto mb-2" />
              School
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`
                p-4 rounded-lg border-2 font-semibold transition-all
                ${role === 'staff' 
                  ? 'border-primary-600 bg-primary-50 text-primary-700' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              Staff Member
            </button>
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            {role === 'school' ? 'School Name' : 'Full Name'}
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="
                w-full pl-12 pr-4 py-3 
                border-2 border-gray-200 rounded-lg 
                focus:border-primary-500 focus:ring-4 focus:ring-primary-100 
                outline-none transition-all
                text-gray-900
              "
              placeholder={role === 'school' ? 'Springfield Primary School' : 'John Smith'}
            />
          </div>
        </div>

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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            required
            className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
          />
          <label className="text-sm text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-semibold">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-semibold">
              Privacy Policy
            </Link>
          </label>
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
            <span>Creating account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
