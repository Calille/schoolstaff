'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Calendar } from 'lucide-react'

interface WeekdayAvailability {
  weekday: string
  available: boolean
}

const WEEKDAYS = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
]

export default function StaffAvailabilityPage() {
  const [availability, setAvailability] = useState<WeekdayAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadAvailability()
  }, [])

  const loadAvailability = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('staff_availability_weekdays')
      .select('*')
      .eq('staff_id', user.id)
      .order('weekday', { ascending: true })

    if (error) {
      console.error('Error loading availability:', error)
      toast.error('Failed to load availability')
    } else {
      // Ensure all weekdays are present
      const weekdaysMap = new Map(
        (data || []).map((item) => [item.weekday, item])
      )

      const fullAvailability = WEEKDAYS.map((wd) => ({
        weekday: wd.value,
        available: weekdaysMap.get(wd.value)?.available ?? true,
        id: weekdaysMap.get(wd.value)?.id,
      }))

      setAvailability(fullAvailability)
    }
    setLoading(false)
  }

  const toggleAvailability = async (weekday: string, currentValue: boolean) => {
    setUpdating(weekday)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Not authenticated')
      setUpdating(null)
      return
    }

    try {
      const newValue = !currentValue

      // Check if record exists
      const { data: existing } = await supabase
        .from('staff_availability_weekdays')
        .select('id')
        .eq('staff_id', user.id)
        .eq('weekday', weekday)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('staff_availability_weekdays')
          .update({ available: newValue, updated_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('staff_availability_weekdays')
          .insert({
            staff_id: user.id,
            weekday,
            available: newValue,
          })

        if (error) throw error
      }

      // Optimistically update UI
      setAvailability((prev) =>
        prev.map((item) =>
          item.weekday === weekday ? { ...item, available: newValue } : item
        )
      )

      toast.success(`${WEEKDAYS.find((w) => w.value === weekday)?.label} availability updated`)
    } catch (error: any) {
      console.error('Error updating availability:', error)
      toast.error(error.message || 'Failed to update availability')
      // Reload to sync state
      loadAvailability()
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Availability</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability</h1>
        <p className="text-gray-600">
          Set which days of the week you're available for bookings
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {WEEKDAYS.map((day) => {
            const dayAvailability = availability.find(
              (a) => a.weekday === day.value
            )
            const isAvailable = dayAvailability?.available ?? true
            const isUpdating = updating === day.value

            return (
              <div
                key={day.value}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <Label
                    htmlFor={day.value}
                    className="text-lg font-medium text-gray-900 cursor-pointer"
                  >
                    {day.label}
                  </Label>
                </div>
                <Switch
                  id={day.value}
                  checked={isAvailable}
                  onCheckedChange={() => toggleAvailability(day.value, isAvailable)}
                  disabled={isUpdating}
                />
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Schools will only see you in search results for days you mark as available.
            You can update this anytime.
          </p>
        </div>
      </Card>
    </div>
  )
}
