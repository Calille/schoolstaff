import { NextRequest, NextResponse } from 'next/server'
import { createCustomerPortalSession } from '@/lib/stripe'
import { getUserProfile, getSchoolProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserProfile()

    if (!user || user.role !== 'school') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const schoolProfile = await getSchoolProfile()
    if (!schoolProfile?.school?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found. Please complete a payment first.' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCustomerPortalSession(
      schoolProfile.school.stripe_customer_id,
      `${baseUrl}/dashboard/school/billing`
    )

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Error creating customer portal session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

