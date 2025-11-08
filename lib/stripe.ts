import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    })
  : (null as unknown as Stripe) // Type assertion for build time

export async function getOrCreateStripeCustomer(
  schoolId: string,
  email: string,
  name?: string
): Promise<string> {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()

  // Get school record
  const { data: school, error: schoolError } = await supabase
    .from('schools')
    .select('stripe_customer_id')
    .eq('id', schoolId)
    .single()

  if (schoolError) {
    throw new Error(`School not found: ${schoolError.message}`)
  }

  // If customer already exists, return it
  if (school.stripe_customer_id) {
    try {
      await stripe.customers.retrieve(school.stripe_customer_id)
      return school.stripe_customer_id
    } catch (error) {
      // Customer doesn't exist in Stripe, create new one
    }
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      school_id: schoolId,
    },
  })

  // Save customer ID to school record
  await supabase
    .from('schools')
    .update({ stripe_customer_id: customer.id })
    .eq('id', schoolId)

  return customer.id
}

export async function createCheckoutSession(
  customerId: string,
  requestId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  const priceId = process.env.STRIPE_PRICE_ID_BOOKING_FEE

  if (!priceId) {
    throw new Error('STRIPE_PRICE_ID_BOOKING_FEE is not set')
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      request_id: requestId,
    },
    payment_intent_data: {
      metadata: {
        request_id: requestId,
      },
    },
  })

  return session
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}

