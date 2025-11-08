import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const traceId = randomUUID()
  
  try {
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { date_from, date_to } = body

    if (!date_from || !date_to) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'date_from and date_to are required',
          },
        },
        { status: 400 }
      )
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date_from) || !dateRegex.test(date_to)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dates must be in YYYY-MM-DD format',
          },
        },
        { status: 400 }
      )
    }

    if (date_from > date_to) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'date_from must be before or equal to date_to',
          },
        },
        { status: 400 }
      )
    }

    console.info({
      action: 'payroll_export_start',
      userId: user.id,
      dateFrom: date_from,
      dateTo: date_to,
      traceId,
    })

    // Atomic select + mark processed using FOR UPDATE SKIP LOCKED
    const { data: timesheets, error: fetchError } = await supabaseAdmin.rpc(
      'select_and_mark_payroll',
      {
        p_date_from: date_from,
        p_date_to: date_to,
      }
    )

    // Fallback to manual query if RPC function doesn't exist yet
    if (fetchError && (fetchError.message.includes('function') || fetchError.message.includes('does not exist'))) {
      console.warn({
        action: 'payroll_export_fallback',
        message: 'RPC function not found, using manual query',
        traceId,
      })

      // Manual query with simplified filter (removed redundant .neq)
      const { data: manualTimesheets, error: manualError } = await supabaseAdmin
        .from('timesheets')
        .select(`
          id,
          staff_id,
          date,
          total_hours,
          amount,
          staff:staff_profiles (
            profiles (
              id,
              full_name,
              email
            )
          )
        `)
        .eq('status', 'approved_by_school')
        .gte('date', date_from)
        .lte('date', date_to)
        .order('staff_id', { ascending: true })
        .order('date', { ascending: true })

      if (manualError) {
        console.error({
          action: 'payroll_export_error',
          error: 'Failed to fetch timesheets',
          details: manualError.message,
          traceId,
        })
        return NextResponse.json(
          {
            error: {
              code: 'DATABASE_ERROR',
              message: 'Failed to fetch timesheets',
              details: manualError.message,
            },
          },
          { status: 500 }
        )
      }

      if (!manualTimesheets || manualTimesheets.length === 0) {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: 'No timesheets found for date range',
            },
          },
          { status: 404 }
        )
      }

      // Mark as processed (non-atomic, but better than nothing)
      const timesheetIds = manualTimesheets.map((t) => t.id)
      await supabaseAdmin
        .from('timesheets')
        .update({ status: 'processed_for_payroll' })
        .in('id', timesheetIds)

      // Process the data
      const payrollData = processTimesheetsForPayroll(manualTimesheets)
      const csvContent = generatePayrollCSV(payrollData, date_from, date_to)

      console.info({
        action: 'payroll_export_success',
        timesheetCount: timesheetIds.length,
        staffCount: Object.keys(payrollData).length,
        traceId,
      })

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="payroll_${date_from}_to_${date_to}.csv"`,
        },
      })
    }

    if (fetchError) {
      console.error({
        action: 'payroll_export_error',
        error: 'Failed to fetch timesheets atomically',
        details: fetchError.message,
        traceId,
      })
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch timesheets',
            details: fetchError.message,
          },
        },
        { status: 500 }
      )
    }

    if (!timesheets || timesheets.length === 0) {
      return NextResponse.json(
        {
          message: 'No timesheets to process',
        },
        { status: 200 }
      )
    }

    // Process the data
    const payrollData = processTimesheetsForPayroll(timesheets)
    const csvContent = generatePayrollCSV(payrollData, date_from, date_to)

    console.info({
      action: 'payroll_export_success',
      timesheetCount: timesheets.length,
      staffCount: Object.keys(payrollData).length,
      traceId,
    })

    // Return CSV file
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="payroll_${date_from}_to_${date_to}.csv"`,
      },
    })
  } catch (error: any) {
    console.error({
      action: 'payroll_export_error',
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

// Helper function to process timesheets into payroll data
function processTimesheetsForPayroll(timesheets: any[]) {
  // Aggregate by staff (using Record for simpler grouping)
  const grouped: Record<string, {
    staff_id: string
    full_name: string
    email: string
    bank_name: string
    bank_account: string
    total_hours: number
    gross_amount: number
    timesheet_ids: string[]
  }> = {}

  timesheets.forEach((timesheet) => {
    // Handle both RPC result format and direct query format
    const staffId = timesheet.staff_id || timesheet.staff?.profiles?.id || timesheet.staff?.id
    
    if (!staffId) return

    if (!grouped[staffId]) {
      // RPC function may return staff details directly, or we need to fetch
      const staffData = Array.isArray(timesheet.staff)
        ? timesheet.staff[0]
        : timesheet.staff

      const staffProfile = staffData?.profiles
        ? Array.isArray(staffData.profiles)
          ? staffData.profiles[0]
          : staffData.profiles
        : null

      grouped[staffId] = {
        staff_id: staffId,
        full_name: timesheet.staff_full_name || staffProfile?.full_name || 'Unknown',
        email: timesheet.staff_email || staffProfile?.email || '',
        bank_name: timesheet.bank_name || '',
        bank_account: timesheet.bank_account || '',
        total_hours: 0,
        gross_amount: 0,
        timesheet_ids: [],
      }
    }

    grouped[staffId].total_hours += Number(timesheet.total_hours || 0)
    grouped[staffId].gross_amount += Number(timesheet.amount || 0)
    grouped[staffId].timesheet_ids.push(timesheet.id)
  })

  return grouped
}

// Helper function to generate CSV content
function generatePayrollCSV(
  payrollData: Record<string, any>,
  dateFrom: string,
  dateTo: string
): string {
  const headers = [
    'Staff ID',
    'Full Name',
    'Email',
    'Bank Name',
    'Bank Account',
    'Total Hours',
    'Gross Amount',
    'Timesheet IDs',
  ]

  const rows = Object.values(payrollData).map((data) => [
    data.staff_id,
    data.full_name,
    data.email,
    data.bank_name,
    data.bank_account,
    data.total_hours.toFixed(2),
    data.gross_amount.toFixed(2),
    data.timesheet_ids.join(';'),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  return csvContent
}
