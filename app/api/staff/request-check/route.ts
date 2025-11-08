import { NextRequest, NextResponse } from 'next/server'
import { checkAvailabilityConflicts } from '@/lib/availability'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { staff_id, date, start_time, end_time } = body

    if (!staff_id || !date) {
      return NextResponse.json(
        { error: 'staff_id and date are required' },
        { status: 400 }
      )
    }

    const requestedDate = new Date(date)
    const result = await checkAvailabilityConflicts(
      staff_id,
      requestedDate,
      start_time,
      end_time
    )

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

