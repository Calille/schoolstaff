import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getSchoolProfile } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notifyUserIds } from '@/lib/notifyServer'
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

    if (user.role !== 'admin' && user.role !== 'school') {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Admin or school access required' } },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { invoice_id, timesheet_ids, finalize } = body

    console.info({
      action: 'invoice_generate_start',
      userId: user.id,
      role: user.role,
      invoiceId: invoice_id,
      timesheetCount: timesheet_ids?.length || 0,
      finalize,
      traceId,
    })

    let targetSchoolId: string | null = null

    // If school user, can only generate for their own school
    if (user.role === 'school') {
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
      targetSchoolId = schoolProfile.school.id
    }

    let invoiceId = invoice_id
    const skippedTimesheetIds: string[] = []

    // If timesheet_ids provided, create invoice from those timesheets
    if (timesheet_ids && Array.isArray(timesheet_ids) && timesheet_ids.length > 0) {
      // Validate all timesheets exist and are approved
      const { data: timesheets, error: timesheetError } = await supabaseAdmin
        .from('timesheets')
        .select('id, school_id, status, date, start_time, end_time, total_hours, hourly_rate, amount')
        .in('id', timesheet_ids)

      if (timesheetError) {
        console.error({
          action: 'invoice_generate_error',
          error: 'Failed to fetch timesheets',
          details: timesheetError.message,
          traceId,
        })
        return NextResponse.json(
          {
            error: {
              code: 'DATABASE_ERROR',
              message: 'Failed to fetch timesheets',
              details: timesheetError.message,
            },
          },
          { status: 500 }
        )
      }

      if (!timesheets || timesheets.length === 0) {
        return NextResponse.json(
          {
            error: {
              code: 'NOT_FOUND',
              message: 'No timesheets found',
            },
          },
          { status: 404 }
        )
      }

      // Validate all timesheets are approved
      const unapproved = timesheets.filter((t) => t.status !== 'approved_by_school')
      if (unapproved.length > 0) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: `Some timesheets are not approved: ${unapproved.map((t) => t.id).join(', ')}`,
            },
          },
          { status: 400 }
        )
      }

      // Check if school user can access these timesheets
      if (targetSchoolId) {
        const invalidSchool = timesheets.find((t) => t.school_id !== targetSchoolId)
        if (invalidSchool) {
          return NextResponse.json(
            {
              error: {
                code: 'FORBIDDEN',
                message: 'Some timesheets do not belong to your school',
              },
            },
            { status: 403 }
          )
        }
      } else {
        // Admin: use first timesheet's school
        targetSchoolId = timesheets[0].school_id
      }

      // Check idempotency: find already invoiced timesheets
      const { data: alreadyInvoiced } = await supabaseAdmin
        .from('invoice_lines')
        .select('invoice_id, timesheet_id')
        .in('timesheet_id', timesheet_ids)

      const invoicedTimesheetIds = alreadyInvoiced?.map((r) => r.timesheet_id) || []
      const toInvoiceIds = timesheet_ids.filter((id: string) => !invoicedTimesheetIds.includes(id))

      skippedTimesheetIds.push(...invoicedTimesheetIds)

      if (toInvoiceIds.length === 0) {
        // All timesheets already invoiced
        const existingInvoiceIds = new Set(alreadyInvoiced?.map((l) => l.invoice_id) || [])
        const invoiceIdsArray = Array.from(existingInvoiceIds)
        
        return NextResponse.json({
          success: true,
          message: 'All timesheets already invoiced',
          skipped_timesheet_ids: skippedTimesheetIds,
          invoices: invoiceIdsArray,
        })
      }

      // Call PL/pgSQL function with advisory lock
      const { data: invoiceResult, error: rpcError } = await supabaseAdmin.rpc(
        'lock_and_create_invoice',
        {
          p_school_id: targetSchoolId,
          p_timesheet_ids: toInvoiceIds,
          p_issued_by: user.id,
        }
      )

      if (rpcError) {
        console.error({
          action: 'invoice_generate_error',
          error: 'Failed to create invoice atomically',
          details: rpcError.message,
          traceId,
        })
        return NextResponse.json(
          {
            error: {
              code: 'DATABASE_ERROR',
              message: 'Failed to create invoice',
              details: rpcError.message,
            },
          },
          { status: 500 }
        )
      }

      if (!invoiceResult || invoiceResult.length === 0) {
        return NextResponse.json(
          {
            error: {
              code: 'DATABASE_ERROR',
              message: 'Invoice creation returned no result',
            },
          },
          { status: 500 }
        )
      }

      invoiceId = invoiceResult[0].invoice_id

      console.info({
        action: 'invoice_created_atomically',
        invoiceId,
        schoolId: targetSchoolId,
        timesheetCount: toInvoiceIds.length,
        skippedCount: skippedTimesheetIds.length,
        traceId,
      })
    }

    if (!invoiceId) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'invoice_id or timesheet_ids required',
          },
        },
        { status: 400 }
      )
    }

    // Get invoice with lines for finalization
    const { data: invoice, error: invoiceFetchError } = await supabaseAdmin
      .from('school_invoices')
      .select(`
        *,
        school:schools (
          stripe_customer_id,
          school_name,
          profile_id
        )
      `)
      .eq('id', invoiceId)
      .single()

    if (invoiceFetchError || !invoice) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Invoice not found',
          },
        },
        { status: 404 }
      )
    }

    // Recalculate invoice total from lines
    const { data: lines } = await supabaseAdmin
      .from('invoice_lines')
      .select('line_total')
      .eq('invoice_id', invoiceId)

    const total = lines?.reduce((sum, line) => sum + Number(line.line_total || 0), 0) || 0

    // Update invoice
    const updateData: any = {
      amount: total,
      updated_at: new Date().toISOString(),
    }

    let stripeInvoiceId: string | null = null
    let paymentUrl: string | null = null

    if (finalize) {
      updateData.status = 'open'
      updateData.issued_at = new Date().toISOString()
      updateData.last_error = null // Clear any previous errors

      const schoolData = Array.isArray(invoice.school)
        ? invoice.school[0]
        : invoice.school

      if (invoice && process.env.STRIPE_SECRET_KEY && schoolData?.stripe_customer_id) {
        try {
          const Stripe = (await import('stripe')).default
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-10-29.clover',
          })

          // Create Stripe invoice with idempotency
          const idempotencyKey = `invoice_${invoiceId}_${Date.now()}`

          const stripeInvoice = await stripe.invoices.create(
            {
              customer: schoolData.stripe_customer_id,
              auto_advance: false,
              collection_method: 'send_invoice',
              days_until_due: 30,
            },
            {
              idempotencyKey,
            }
          )

          // Add line items
          if (lines) {
            for (const line of lines) {
              await stripe.invoiceItems.create({
                customer: schoolData.stripe_customer_id,
                invoice: stripeInvoice.id,
                amount: Math.round(Number(line.line_total) * 100), // Convert to cents
                description: `Timesheet - ${Number(line.line_total).toFixed(2)} hours`,
              })
            }
          }

          // Finalize invoice
          const finalizedInvoice = await stripe.invoices.finalizeInvoice(stripeInvoice.id, {
            auto_advance: true,
          })

          stripeInvoiceId = finalizedInvoice.id
          paymentUrl = finalizedInvoice.hosted_invoice_url || null

          updateData.stripe_invoice_id = stripeInvoiceId

          console.info({
            action: 'stripe_invoice_created',
            invoiceId,
            stripeInvoiceId,
            traceId,
          })
        } catch (stripeError: any) {
          console.error({
            action: 'stripe_invoice_error',
            invoiceId,
            error: stripeError.message,
            traceId,
          })
          // Store error for manual retry
          updateData.last_error = `Stripe error: ${stripeError.message}`
          // Continue without Stripe if it fails - invoice remains in draft
          updateData.status = 'draft'
        }
      }

      // Notify school of invoice finalization (only if successfully finalized)
      if (schoolData && updateData.status === 'open') {
        if (schoolData.profile_id) {
          await notifyUserIds([schoolData.profile_id], 'invoice_finalized', {
            invoice_id: invoiceId,
            amount: total,
            stripe_invoice_id: stripeInvoiceId,
          })
        }
      }
    }

    const { data: updatedInvoice, error: updateError } = await supabaseAdmin
      .from('school_invoices')
      .update(updateData)
      .eq('id', invoiceId)
      .select()
      .single()

    if (updateError) {
      console.error({
        action: 'invoice_update_error',
        invoiceId,
        error: updateError.message,
        traceId,
      })
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update invoice',
            details: updateError.message,
          },
        },
        { status: 500 }
      )
    }

    console.info({
      action: 'invoice_generate_success',
      invoiceId,
      status: updatedInvoice.status,
      finalize,
      traceId,
    })

    return NextResponse.json({
      success: true,
      data: {
        ...updatedInvoice,
        payment_url: paymentUrl,
      },
      skipped_timesheet_ids: skippedTimesheetIds.length > 0 ? skippedTimesheetIds : undefined,
    })
  } catch (error: any) {
    console.error({
      action: 'invoice_generate_error',
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
