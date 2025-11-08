'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/page-container'
import { createClient } from '@/lib/supabase/client'
import { Building2, User } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }

      // Check if user already has a role
      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (profile?.role) {
            // User already has a role, redirect to appropriate dashboard
            if (profile.role === 'school') {
              router.push('/dashboard/school')
            } else if (profile.role === 'staff') {
              router.push('/dashboard/staff')
            }
          } else {
            setChecking(false)
          }
        })
    })
  }, [router, supabase])

  const handleRoleSelection = async (role: 'school' | 'staff') => {
    setLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Update profile with role
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', user.id)

    if (error) {
      console.error('Error setting role:', error)
      setLoading(false)
      return
    }

    // Redirect to role-specific onboarding
    if (role === 'school') {
      router.push('/onboarding/school')
    } else {
      router.push('/onboarding/staff')
    }
  }

  if (checking) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-gray-600">Loading...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to School Staff
          </h1>
          <p className="text-xl text-gray-600">
            Let's get started. Are you a School or Staff member?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Building2 className="h-8 w-8 text-gray-900" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                I am a School
              </h2>
              <p className="text-gray-600 mb-6">
                Looking to find qualified staff members for your school
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={() => handleRoleSelection('school')}
                disabled={loading}
              >
                Continue as School
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <User className="h-8 w-8 text-gray-900" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                I am Staff
              </h2>
              <p className="text-gray-600 mb-6">
                Looking for teaching and support opportunities
              </p>
              <Button
                size="lg"
                className="w-full"
                variant="outline"
                onClick={() => handleRoleSelection('staff')}
                disabled={loading}
              >
                Continue as Staff
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}

