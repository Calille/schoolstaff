import { createClient } from './supabase/server'

export interface ConflictCheck {
  ok: boolean
  conflicts: Array<{
    type: 'block' | 'availability'
    message: string
    start?: string
    end?: string
  }>
}

/**
 * Check if a requested date/time conflicts with staff availability or blocks
 */
export async function checkAvailabilityConflicts(
  staffId: string,
  requestedDate: Date,
  requestedStartTime?: string,
  requestedEndTime?: string
): Promise<ConflictCheck> {
  const supabase = await createClient()
  const conflicts: ConflictCheck['conflicts'] = []

  // Check for blocks that overlap with requested date
  const requestedStart = new Date(requestedDate)
  const requestedEnd = new Date(requestedDate)

  if (requestedStartTime) {
    const [hours, minutes] = requestedStartTime.split(':').map(Number)
    requestedStart.setHours(hours, minutes, 0, 0)
  } else {
    requestedStart.setHours(0, 0, 0, 0)
  }

  if (requestedEndTime) {
    const [hours, minutes] = requestedEndTime.split(':').map(Number)
    requestedEnd.setHours(hours, minutes, 0, 0)
  } else {
    requestedEnd.setHours(23, 59, 59, 999)
  }

  // Check staff blocks
  const { data: blocks } = await supabase
    .from('staff_blocks')
    .select('*')
    .eq('staff_id', staffId)
    .or(
      `and(start.lte.${requestedEnd.toISOString()},end.gte.${requestedStart.toISOString()})`
    )

  if (blocks && blocks.length > 0) {
    blocks.forEach((block) => {
      conflicts.push({
        type: 'block',
        message: `Staff is blocked: ${block.reason || 'Unavailable'}`,
        start: block.start,
        end: block.end,
      })
    })
  }

  // Check recurring availability if time is provided
  if (requestedStartTime && requestedEndTime) {
    const weekday = requestedDate.getDay()
    const { data: availability } = await supabase
      .from('staff_availability')
      .select('*')
      .eq('staff_id', staffId)
      .eq('recurring', true)
      .eq('weekday', weekday)

    if (availability && availability.length > 0) {
      const hasMatchingSlot = availability.some((slot) => {
        if (!slot.start_time || !slot.end_time) return false

        const slotStart = slot.start_time
        const slotEnd = slot.end_time

        // Check if requested time falls within any availability slot
        return requestedStartTime >= slotStart && requestedEndTime <= slotEnd
      })

      if (!hasMatchingSlot) {
        conflicts.push({
          type: 'availability',
          message: `Staff may not be available at this time (check recurring availability)`,
        })
      }
    } else {
      // No recurring availability set for this weekday
      conflicts.push({
        type: 'availability',
        message: `No recurring availability set for ${getWeekdayName(weekday)}`,
      })
    }
  }

  return {
    ok: conflicts.length === 0,
    conflicts,
  }
}

function getWeekdayName(weekday: number): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return days[weekday] || 'Unknown'
}

