'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface BlockDateFormProps {
  onSuccess: () => void
}

export function BlockDateForm({ onSuccess }: BlockDateFormProps) {
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('00:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('23:59')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Not authenticated')
      setLoading(false)
      return
    }

    if (!startDate || !endDate) {
      toast.error('Please select start and end dates')
      setLoading(false)
      return
    }

    try {
      const start = new Date(`${startDate}T${startTime}`)
      const end = new Date(`${endDate}T${endTime}`)

      if (end <= start) {
        toast.error('End date/time must be after start date/time')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('staff_blocks').insert({
        staff_id: user.id,
        start: start.toISOString(),
        end: end.toISOString(),
        reason: reason || null,
      })

      if (error) throw error

      toast.success('Date blocked successfully')
      setStartDate('')
      setEndDate('')
      setStartTime('00:00')
      setEndTime('23:59')
      setReason('')
      onSuccess()
    } catch (error: any) {
      toast.error(error.message || 'Failed to block date')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Start Time</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>End Time</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label>Reason (optional)</Label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why are you blocking this date?"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Blocking...' : 'Block Date'}
      </Button>
    </form>
  )
}

