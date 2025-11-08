import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getSchoolProfile } from '@/lib/auth'
import { notifyUserIds } from '@/lib/notifyServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      )
    }

    if (user.role !== 'school') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'School access required' } },
        { status: 403 }
      )
    }

    const schoolProfile = await getSchoolProfile()
    if (!schoolProfile?.school?.id) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'School profile not found',
          },
        },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { timesheet_id, action, comment } = body

    if (!timesheet_id || !action) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'timesheet_id and action are required',
          },
        },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'action must be "approve" or "reject"',
          },
        },
        { status: 400 }
      )
    }

    // Verify timesheet exists and belongs to this school
    const { data: timesheet, error: fetchError } = await supabaseAdmin
      .from('timesheets')
      .select(`
        *,
        staff:staff_profiles (
          profiles (
            id,
            full_name
          )
        )
      `)
      .eq('id', timesheet_id)
      .eq('school_id', schoolProfile.school.id)
      .single()

    if (fetchError || !timesheet) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Timesheet not found or does not belong to your school',
          },
        },
        { status: 404 }
      )
    }

    if (timesheet.status !== 'submitted') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: `Timesheet is already ${timesheet.status}`,
          },
        },
        { status: 409 }
      )
    }

    const newStatus = action === 'approve' ? 'approved_by_school' : 'rejected'

    // Update timesheet status
    const { data: updatedTimesheet, error: updateError } = await supabaseAdmin
      .from('timesheets')
      .update({
        status: newStatus,
        notes: comment || timesheet.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', timesheet_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating timesheet:', updateError)
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update timesheet',
            details: updateError.message,
          },
        },
        { status: 500 }
      )
    }

    // If approved, create or append to invoice draft
    if (action === 'approve') {
      try {
        // Use transaction-like pattern: find or create draft invoice
        const { data: draftInvoice } = await supabaseAdmin
          .from('school_invoices')
          .select('id')
          .eq('school_id', schoolProfile.school.id)
          .eq('status', 'draft')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        let invoiceId = draftInvoice?.id

        if (!invoiceId) {
          // Create new draft invoice
          const { data: newInvoice, error: invoiceError } = await supabaseAdmin
            .from('school_invoices')
            .insert({
              school_id: schoolProfile.school.id,
              status: 'draft',
              amount: 0,
            })
            .select()
            .single()

          if (invoiceError) {
            console.error('Error creating invoice:', invoiceError)
            throw invoiceError
          }

          invoiceId = newInvoice.id
        }

        // Check if invoice line already exists (idempotency)
        const { data: existingLine } = await supabaseAdmin
          .from('invoice_lines')
          .select('id')
          .eq('invoice_id', invoiceId)
          .eq('timesheet_id', timesheet_id)
          .maybeSingle()

        if (!existingLine) {
          // Create invoice line for this timesheet
          const { error: lineError } = await supabaseAdmin
            .from('invoice_lines')
            .insert({
              invoice_id: invoiceId,
              timesheet_id: timesheet_id,
              description: `Timesheet for ${timesheet.date} - ${timesheet.start_time} to ${timesheet.end_time}`,
              quantity: timesheet.total_hours || 0,
              unit_price: timesheet.hourly_rate || 0,
            })

          if (lineError) {
            console.error('Error creating invoice line:', lineError)
            throw lineError
          }

          // Recalculate invoice total
          const { data: lines } = await supabaseAdmin
            .from('invoice_lines')
            .select('line_total')
            .eq('invoice_id', invoiceId)

          const total =
            lines?.reduce((sum, line) => sum + Number(line.line_total || 0), 0) || 0

          await supabaseAdmin
            .from('school_invoices')
            .update({ amount: total })
            .eq('id', invoiceId)
        }
      } catch (invoiceError: any) {
        console.error('Error processing invoice:', invoiceError)
        // Don't fail the approval if invoice creation fails - log and continue
      }
    }

    // Notify staff member
    const staffData = Array.isArray(timesheet.staff) ? timesheet.staff[0] : timesheet.staff

    const staffProfile = staffData?.profiles
      ? Array.isArray(staffData.profiles)
        ? staffData.profiles[0]
        : staffData.profiles
      : null

    if (staffProfile?.id) {
      await notifyUserIds([staffProfile.id], action === 'approve' ? 'timesheet_approved' : 'timesheet_rejected', {
        timesheet_id: timesheet_id,
        date: timesheet.date,
        comment: comment || null,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        timesheet: updatedTimesheet,
        action: action,
      },
    })
  } catch (error: any) {
    console.error('Request error:', error)
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
