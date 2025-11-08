'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const WEEKDAYS = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
  { value: 'fri', label: 'Friday' },
]

interface WeekdaySelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (weekdays: string[]) => void
}

export function WeekdaySelectorDialog({
  open,
  onOpenChange,
  onConfirm,
}: WeekdaySelectorDialogProps) {
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])

  const toggleWeekday = (weekday: string) => {
    setSelectedWeekdays((prev) =>
      prev.includes(weekday)
        ? prev.filter((w) => w !== weekday)
        : [...prev, weekday]
    )
  }

  const handleConfirm = () => {
    if (selectedWeekdays.length === 0) {
      return // Don't allow empty selection
    }
    onConfirm(selectedWeekdays)
    onOpenChange(false)
    setSelectedWeekdays([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Required Days</DialogTitle>
          <DialogDescription>
            Which day(s) do you need this staff member?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {WEEKDAYS.map((day) => (
            <div
              key={day.value}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <Label
                htmlFor={`dialog-${day.value}`}
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                {day.label}
              </Label>
              <Switch
                id={`dialog-${day.value}`}
                checked={selectedWeekdays.includes(day.value)}
                onCheckedChange={() => toggleWeekday(day.value)}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedWeekdays.length === 0}
          >
            Continue ({selectedWeekdays.length} selected)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

