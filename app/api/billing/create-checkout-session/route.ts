import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateStripeCustomer, createCheckoutSession } from '@/lib/stripe'
import { getUserProfile, getSchoolProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserProfile()

    if (!user || user.role !== 'school') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const schoolProfile = await getSchoolProfile()
    if (!schoolProfile?.school?.id) {
      return NextResponse.json(
        { error: 'School profile not found' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { request_id } = body

    if (!request_id) {
      return NextResponse.json(
        { error: 'request_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify request belongs to this school and is accepted/assigned
    const { data: staffRequest, error: requestError } = await supabase
      .from('staff_requests')
      .select('*')
      .eq('id', request_id)
      .eq('school_id', schoolProfile.school.id)
      .single()

    if (requestError || !staffRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    if (staffRequest.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Request must be accepted before payment' },
        { status: 400 }
      )
    }

    if (staffRequest.paid) {
      return NextResponse.json(
        { error: 'Request already paid' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(
      schoolProfile.school.id,
      user.email || '',
      schoolProfile.school.school_name || undefined
    )

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCheckoutSession(
      customerId,
      request_id,
      `${baseUrl}/dashboard/school/billing?session_id={CHECKOUT_SESSION_ID}`,
      `${baseUrl}/dashboard/school/requests`
    )

    // Save session ID to request
    await supabase
      .from('staff_requests')
      .update({ stripe_session_id: session.id })
      .eq('id', request_id)

    return NextResponse.json({ session_url: session.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

