'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface AvailabilitySlotProps {
  slot: {
    id?: string
    weekday: number | null
    start_time: string
    end_time: string
    recurring: boolean
  }
  onSave: (slot: any) => void
  onDelete?: () => void
  weekdays: string[]
}

export function AvailabilitySlot({
  slot,
  onSave,
  onDelete,
  weekdays,
}: AvailabilitySlotProps) {
  const [weekday, setWeekday] = useState<number | null>(slot.weekday)
  const [startTime, setStartTime] = useState(slot.start_time)
  const [endTime, setEndTime] = useState(slot.end_time)

  const handleSave = () => {
    onSave({
      ...slot,
      weekday,
      start_time: startTime,
      end_time: endTime,
    })
  }

  return (
    <div className="flex gap-4 items-end p-3 border rounded-lg">
      <div className="flex-1">
        <Label>Day of Week</Label>
        <Select
          value={weekday?.toString() || ''}
          onValueChange={(value) => setWeekday(value ? parseInt(value) : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select day" />
          </SelectTrigger>
          <SelectContent>
            {weekdays.map((day, index) => (
              <SelectItem key={index} value={index.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Start Time</Label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div>
        <Label>End Time</Label>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm">
          {slot.id ? 'Update' : 'Save'}
        </Button>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

