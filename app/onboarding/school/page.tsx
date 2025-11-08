'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { PageContainer } from '@/components/page-container'
import { createClient } from '@/lib/supabase/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SchoolOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    schoolName: '',
    contactName: '',
    phone: '',
    postcode: '',
    preferredContactMethod: '',
  })

  useEffect(() => {
    // Verify user has school role
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }

      supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .then(({ data: profile }) => {
          if (!profile || profile.role !== 'school') {
            router.push('/onboarding')
          }
        })
    })
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

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

      if (!profile || profile.role !== 'school') {
        setError('Invalid role')
        setLoading(false)
        return
      }

      // Create or update school profile
      const { error: schoolError } = await supabase.from('schools').upsert({
        profile_id: user.id,
        school_name: formData.schoolName,
        contact_name: formData.contactName,
        phone: formData.phone,
        postcode: formData.postcode,
        preferred_contact_method: formData.preferredContactMethod,
      })

      if (schoolError) {
        setError(`Failed to save school profile: ${schoolError.message}`)
        setLoading(false)
        return
      }

      // Update profile with contact name
      await supabase
        .from('profiles')
        .update({ full_name: formData.contactName })
        .eq('id', user.id)

      // Redirect to school dashboard
      router.push('/dashboard/school')
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
            School Onboarding
          </h1>
          <p className="text-gray-600">
            Tell us about your school to get started
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="schoolName">School Name *</Label>
              <Input
                id="schoolName"
                type="text"
                value={formData.schoolName}
                onChange={(e) =>
                  setFormData({ ...formData, schoolName: e.target.value })
                }
                required
                className="mt-1"
                placeholder="Enter your school name"
              />
            </div>

            <div>
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                type="text"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                required
                className="mt-1"
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
                className="mt-1"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <Label htmlFor="postcode">Postcode *</Label>
              <Input
                id="postcode"
                type="text"
                value={formData.postcode}
                onChange={(e) =>
                  setFormData({ ...formData, postcode: e.target.value })
                }
                required
                className="mt-1"
                placeholder="Enter postcode"
              />
            </div>

            <div>
              <Label htmlFor="preferredContactMethod">
                Preferred Contact Method *
              </Label>
              <Select
                value={formData.preferredContactMethod}
                onValueChange={(value) =>
                  setFormData({ ...formData, preferredContactMethod: value })
                }
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                </SelectContent>
              </Select>
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

