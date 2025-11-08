import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { notifyUsers } from '@/lib/notifications'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  try {
    const event = verifyWebhookSignature(body, signature)
    const supabase = await createClient()

    // Handle different event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.metadata?.request_id) {
        const requestId = session.metadata.request_id

        // Get request details
        const { data: request, error: requestError } = await supabase
          .from('staff_requests')
          .select(`
            *,
            school:schools!staff_requests_school_id_fkey (
              profile_id,
              school_name
            ),
            staff:staff_profiles!staff_requests_staff_id_fkey (
              id
            )
          `)
          .eq('id', requestId)
          .single()

        if (!requestError && request) {
          // Mark request as paid
          await supabase
            .from('staff_requests')
            .update({ paid: true })
            .eq('id', requestId)

          // Create invoice record
          const schoolData = Array.isArray(request.school)
            ? request.school[0]
            : request.school

          const amount = session.amount_total
            ? session.amount_total / 100
            : null

          await supabase.from('school_invoices').insert({
            school_id: request.school_id,
            stripe_invoice_id: session.payment_intent as string,
            amount: amount,
            status: 'paid',
          })

          // Notify school and staff
          const notifications = []
          if (schoolData?.profile_id) {
            notifications.push({
              user_id: schoolData.profile_id,
              type: 'payment_completed',
              payload: {
                request_id: requestId,
                amount: amount,
              },
            })
          }

          if (request.staff_id) {
            notifications.push({
              user_id: request.staff_id,
              type: 'payment_completed',
              payload: {
                request_id: requestId,
                school_id: request.school_id,
              },
            })
          }

          if (notifications.length > 0) {
            await supabase.from('notifications').insert(notifications)
          }
        }
      }
    } else if (event.type === 'invoice.paid') {
      const invoice = event.data.object as Stripe.Invoice

      // Handle invoice.paid events if needed
      // This can be used for subscription-based models in the future
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    )
  }
}

// Disable body parsing for webhook route
export const runtime = 'nodejs'

