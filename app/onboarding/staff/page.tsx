'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/page-container'
import { createClient } from '@/lib/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'

export default function StaffOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    keyStages: [] as string[],
    dbsNumber: '',
    experienceYears: '',
    availability: '',
  })

  const keyStageOptions = ['KS1', 'KS2', 'KS3', 'KS4', 'SEN']

  useEffect(() => {
    // Verify user has staff role
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }

      supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (!profile || profile.role !== 'staff') {
            router.push('/onboarding')
          } else if (profile.full_name) {
            setFormData((prev) => ({ ...prev, fullName: profile.full_name || '' }))
          }
        })
    })
  }, [router, supabase])

  const handleKeyStageToggle = (stage: string) => {
    setFormData((prev) => {
      const current = prev.keyStages
      if (current.includes(stage)) {
        return { ...prev, keyStages: current.filter((s) => s !== stage) }
      } else {
        return { ...prev, keyStages: [...current, stage] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.keyStages.length === 0) {
      setError('Please select at least one key stage')
      setLoading(false)
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      // Get profile to ensure role is set
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'staff') {
        setError('Invalid role')
        setLoading(false)
        return
      }

      // Update profile with full name
      await supabase
        .from('profiles')
        .update({ full_name: formData.fullName })
        .eq('id', user.id)

      // Create or update staff profile
      const { error: staffError } = await supabase
        .from('staff_profiles')
        .upsert({
          id: user.id,
          key_stages: formData.keyStages,
          dbs_number: formData.dbsNumber,
          experience_years: parseInt(formData.experienceYears) || null,
          availability: formData.availability,
        })

      if (staffError) {
        setError(`Failed to save staff profile: ${staffError.message}`)
        setLoading(false)
        return
      }

      // Redirect to staff dashboard
      router.push('/dashboard/staff')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Onboarding
          </h1>
          <p className="text-gray-600">
            Tell us about yourself to start receiving opportunities
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
                className="mt-1"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label>Key Stages You Can Teach *</Label>
              <div className="mt-2 space-y-2">
                {keyStageOptions.map((stage) => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      id={stage}
                      checked={formData.keyStages.includes(stage)}
                      onCheckedChange={() => handleKeyStageToggle(stage)}
                    />
                    <Label
                      htmlFor={stage}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {stage}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="dbsNumber">DBS Number</Label>
              <Input
                id="dbsNumber"
                type="text"
                value={formData.dbsNumber}
                onChange={(e) =>
                  setFormData({ ...formData, dbsNumber: e.target.value })
                }
                className="mt-1"
                placeholder="Enter DBS number (optional)"
              />
            </div>

            <div>
              <Label htmlFor="experienceYears">Years of Experience *</Label>
              <Input
                id="experienceYears"
                type="number"
                min="0"
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, experienceYears: e.target.value })
                }
                required
                className="mt-1"
                placeholder="Enter years of experience"
              />
            </div>

            <div>
              <Label htmlFor="availability">Availability *</Label>
              <Textarea
                id="availability"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                required
                className="mt-1"
                placeholder="Describe your availability (e.g., Monday-Friday, mornings only, etc.)"
                rows={4}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Onboarding'}
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  )
}

