'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LoadingSpinner } from '@/components/loading-spinner'
import { trackTimesheetSubmission } from '@/lib/analytics'

export default function NewTimesheetPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [schools, setSchools] = useState<Array<{ id: string; school_name: string }>>([])
  const [requests, setRequests] = useState<Array<{ id: string; school_id: string }>>([])
  const supabase = createClient()

  const [formData, setFormData] = useState({
    school_id: '',
    request_id: '',
    date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    break_minutes: 0,
    notes: '',
  })

  useEffect(() => {
    loadSchools()
    loadRequests()
  }, [])

  useEffect(() => {
    if (formData.school_id) {
      loadRequests()
    }
  }, [formData.school_id])

  const loadSchools = async () => {
    const { data } = await supabase.from('schools').select('id, school_name').order('school_name')
    if (data) {
      setSchools(data)
    }
  }

  const loadRequests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } = await supabase
      .from('staff_requests')
      .select('id, school_id')
      .eq('staff_id', user.id)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })

    if (data) {
      setRequests(data)
    }
  }

  const calculatePreview = () => {
    if (!formData.start_time || !formData.end_time) return { hours: 0, amount: 0 }

    const start = new Date(`2000-01-01T${formData.start_time}`)
    const end = new Date(`2000-01-01T${formData.end_time}`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const breakHours = (formData.break_minutes || 0) / 60
    const hours = Math.max(0, diffHours - breakHours)
    const hourlyRate = 25.0 // Default rate - should come from server
    const amount = hours * hourlyRate

    return { hours: hours.toFixed(2), amount: amount.toFixed(2) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.school_id || !formData.date || !formData.start_time || !formData.end_time) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.start_time >= formData.end_time) {
      toast.error('Start time must be before end time')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/timesheets/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_id: formData.school_id,
          request_id: formData.request_id || null,
          date: formData.date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          break_minutes: formData.break_minutes || 0,
          notes: formData.notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to submit timesheet')
      }

      trackTimesheetSubmission(true)
      toast.success('Timesheet submitted successfully')
      router.push('/dashboard/staff/timesheets')
      router.refresh()
    } catch (error: any) {
      trackTimesheetSubmission(false)
      toast.error(error.message || 'Failed to submit timesheet')
    } finally {
      setSubmitting(false)
    }
  }

  const preview = calculatePreview()

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/staff/timesheets">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timesheets
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit New Timesheet</h1>
        <p className="text-gray-600">Enter your shift details</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="school">School *</Label>
            <select
              id="school"
              value={formData.school_id}
              onChange={(e) => {
                setFormData({ ...formData, school_id: e.target.value, request_id: '' })
              }}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.school_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="request">Linked Request (Optional)</Label>
            <select
              id="request"
              value={formData.request_id}
              onChange={(e) => setFormData({ ...formData, request_id: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              disabled={!formData.school_id}
            >
              <option value="">None</option>
              {requests
                .filter((r) => r.school_id === formData.school_id)
                .map((req) => (
                  <option key={req.id} value={req.id}>
                    Request {req.id.slice(0, 8)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="break_minutes">Break Minutes</Label>
            <Input
              id="break_minutes"
              type="number"
              min="0"
              value={formData.break_minutes}
              onChange={(e) =>
                setFormData({ ...formData, break_minutes: parseInt(e.target.value) || 0 })
              }
              className="mt-1"
            />
          </div>

          {formData.start_time && formData.end_time && (
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                Preview: <strong>{preview.hours}</strong> hours = £<strong>{preview.amount}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Final calculation will be done server-side
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/staff/timesheets">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Timesheet'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

