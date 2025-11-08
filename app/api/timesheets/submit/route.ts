import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth'
import { notifyUserIds } from '@/lib/notifyServer'
import { computeHoursAndAmount } from '@/lib/computeHours'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const traceId = randomUUID()
  
  try {
    const supabase = await createClient()
    const user = await getUserProfile()
    
    console.info({
      action: 'timesheet_submit_start',
      userId: user?.id,
      traceId,
    })

    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    if (user.role !== 'staff') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Staff access required' } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { date, start_time, end_time, break_minutes, hourly_rate, request_id, notes } = body

    // Validation
    if (!date || !start_time || !end_time) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'date, start_time, and end_time are required',
          },
        },
        { status: 400 }
      )
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'date must be in YYYY-MM-DD format',
          },
        },
        { status: 400 }
      )
    }

    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'start_time and end_time must be in HH:MM format',
          },
        },
        { status: 400 }
      )
    }

    // Time validation - explicit checks
    const [startH, startM] = start_time.split(':').map(Number)
    const [endH, endM] = end_time.split(':').map(Number)
    const startTotalMinutes = startH * 60 + startM
    const endTotalMinutes = endH * 60 + endM

    if (isNaN(startTotalMinutes) || isNaN(endTotalMinutes)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid time format',
          },
        },
        { status: 400 }
      )
    }

    if (startTotalMinutes === endTotalMinutes) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Start and end times cannot be the same',
          },
        },
        { status: 400 }
      )
    }

    // Allow overnight shifts - computeHoursAndAmount handles it

    const breakMins = break_minutes || 0
    if (breakMins < 0) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'break_minutes must be >= 0',
          },
        },
        { status: 400 }
      )
    }

    // Get staff profile
    const { data: staffProfile, error: staffError } = await supabase
      .from('staff_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (staffError || !staffProfile) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Staff profile not found',
          },
        },
        { status: 404 }
      )
    }

    // Get school_id from request if provided, otherwise require it in body
    let schoolId: string | null = null

    if (request_id) {
      const { data: requestData, error: requestError } = await supabase
        .from('staff_requests')
        .select('school_id')
        .eq('id', request_id)
        .eq('staff_id', user.id)
        .single()

      if (requestError || !requestData) {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: 'Request not found or does not belong to you',
            },
          },
          { status: 404 }
        )
      }

      schoolId = requestData.school_id
    } else {
      // Require school_id in body if no request_id
      if (!body.school_id) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'school_id is required when request_id is not provided',
            },
          },
          { status: 400 }
        )
      }
      schoolId = body.school_id
    }

    // Verify school exists
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id, school_name, profile_id')
      .eq('id', schoolId)
      .single()

    if (schoolError || !school) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'School not found',
          },
        },
        { status: 404 }
      )
    }

    // Get hourly rate (from body or staff profile)
    let rate = hourly_rate

    if (!rate || rate <= 0) {
      // TODO: Pull from staff_profiles.hourly_rate or contract table
      // For now, use default
      rate = 25.0
    }

    // Compute hours and amount server-side
    const { totalHours, amount } = computeHoursAndAmount(
      start_time,
      end_time,
      breakMins,
      rate
    )

    // Insert timesheet
    const { data: timesheet, error: insertError } = await supabase
      .from('timesheets')
      .insert({
        staff_id: user.id,
        school_id: schoolId,
        request_id: request_id || null,
        date: date,
        start_time: start_time,
        end_time: end_time,
        break_minutes: breakMins,
        hourly_rate: rate,
        status: 'submitted',
        notes: notes || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating timesheet:', insertError)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to submit timesheet',
            details: insertError.message,
          },
        },
        { status: 500 }
      )
    }

    // Notify school users
    if (school.profile_id) {
      await notifyUserIds([school.profile_id], 'timesheet_submitted', {
        timesheet_id: timesheet.id,
        staff_name: user.full_name,
        school_name: school.school_name,
        date: date,
        amount: amount,
      })
    }

    console.info({
      action: 'timesheet_submit_success',
      timesheetId: timesheet.id,
      userId: user.id,
      schoolId: schoolId,
      traceId,
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: timesheet.id,
          date: timesheet.date,
          total_hours: timesheet.total_hours,
          amount: timesheet.amount,
          status: timesheet.status,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error({
      action: 'timesheet_submit_error',
      error: error.message,
      traceId,
    })
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          details: error.message,
        },
      },
      { status: 500 }
    )
  }
}
