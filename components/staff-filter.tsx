'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const WEEKDAYS = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
]

interface StaffFilterProps {
  selectedWeekdays: string[]
}

export function StaffFilter({ selectedWeekdays }: StaffFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const toggleWeekday = (weekday: string) => {
    startTransition(() => {
      const current = new URLSearchParams(searchParams.toString())
      const currentWeekdays = current.get('weekdays')?.split(',') || []

      let newWeekdays: string[]
      if (currentWeekdays.includes(weekday)) {
        newWeekdays = currentWeekdays.filter((w) => w !== weekday)
      } else {
        newWeekdays = [...currentWeekdays, weekday]
      }

      if (newWeekdays.length > 0) {
        current.set('weekdays', newWeekdays.join(','))
      } else {
        current.delete('weekdays')
      }

      router.push(`?${current.toString()}`)
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      const current = new URLSearchParams(searchParams.toString())
      current.delete('weekdays')
      router.push(`?${current.toString()}`)
    })
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Filter by Availability</h3>
          <p className="text-xs text-gray-600">
            Show only staff available on selected days
          </p>
        </div>
        {selectedWeekdays.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {WEEKDAYS.map((day) => {
          const isSelected = selectedWeekdays.includes(day.value)
          return (
            <div
              key={day.value}
              className="flex items-center gap-2 p-2 border rounded-lg"
            >
              <Switch
                id={`filter-${day.value}`}
                checked={isSelected}
                onCheckedChange={() => toggleWeekday(day.value)}
              />
              <Label
                htmlFor={`filter-${day.value}`}
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {day.label}
              </Label>
            </div>
          )
        })}
      </div>

      {selectedWeekdays.length > 0 && (
        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
          Showing staff available on:{' '}
          {selectedWeekdays
            .map((w) => WEEKDAYS.find((d) => d.value === w)?.label)
            .join(', ')}
        </div>
      )}
    </Card>
  )
}

