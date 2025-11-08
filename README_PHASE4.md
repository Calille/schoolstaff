# Phase 4 Implementation Guide

This document covers the setup and configuration for Phase 4 features: Real-time Notifications, Stripe Billing, Availability Management, and Google Calendar Sync.

## Environment Variables

Add these to your `.env.local` file and production environment:

```env
# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BOOKING_FEE=price_...

# Google Calendar (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Stripe Setup

### 1. Create Stripe Account

1. Sign up at https://stripe.com
2. Get your API keys from the Dashboard → Developers → API keys
3. Add `STRIPE_SECRET_KEY` to your environment variables

### 2. Create Booking Fee Price

1. Go to Stripe Dashboard → Products
2. Create a new product: "Booking Fee"
3. Set pricing (one-time payment)
4. Copy the Price ID and add to `STRIPE_PRICE_ID_BOOKING_FEE`

### 3. Configure Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Testing Locally

For local development, use Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/billing/webhook
```

This will give you a webhook secret starting with `whsec_` - use this for `STRIPE_WEBHOOK_SECRET` in local development.

## Google Calendar Setup (Optional)

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create a new project
3. Enable Google Calendar API

### 2. Configure OAuth Consent Screen

1. Go to APIs & Services → OAuth consent screen
2. Configure consent screen (External user type)
3. Add scopes: `https://www.googleapis.com/auth/calendar`

### 3. Create OAuth Credentials

1. Go to APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (local)
   - `https://yourdomain.com/api/auth/google/callback` (production)
5. Copy Client ID and Client Secret to environment variables

## Database Migrations

All migrations have been applied via Supabase MCP. The following tables were created:

- `notifications` - Real-time notifications
- `school_invoices` - Invoice tracking
- `staff_availability` - Recurring availability slots
- `staff_blocks` - Blocked dates
- `external_calendars` - Google Calendar connections

## Features Implemented

### 1. Real-time Notifications

- **Triggers**: Automatically created when:
  - Staff receives a new request
  - School receives acceptance/decline notification
  - Payment is completed
  - Admin assigns booking

- **UI**: Notification bell in navbar with unread count
- **Page**: `/dashboard/notifications` - View and manage notifications

### 2. Stripe Billing

- **Checkout Flow**: Schools pay flat fee per accepted booking
- **Endpoints**:
  - `/api/billing/create-checkout-session` - Create payment session
  - `/api/billing/webhook` - Handle Stripe webhooks
  - `/api/billing/customer-portal` - Manage payment methods

- **UI**: `/dashboard/school/billing` - View invoices and manage payment

### 3. Availability Management

- **Recurring Slots**: Set weekly availability patterns
- **Blocked Dates**: Block specific date ranges
- **Conflict Detection**: Warns when requesting unavailable staff

- **UI**: `/dashboard/staff/availability` - Manage availability

### 4. Google Calendar Sync

- **OAuth Flow**: Connect Google Calendar account
- **Auto-sync**: Accepted bookings sync to calendar (when implemented)
- **UI**: `/dashboard/staff/calendar` - View bookings and connect calendar

## Testing Checklist

### Notifications
- [ ] Create a request → Verify staff receives notification
- [ ] Accept request → Verify school receives notification
- [ ] Check notification bell shows unread count
- [ ] Mark notifications as read

### Stripe Billing
- [ ] Accept a request → Create checkout session
- [ ] Complete payment with test card: `4242 4242 4242 4242`
- [ ] Verify webhook marks request as paid
- [ ] Verify invoice is created
- [ ] Test customer portal access

### Availability
- [ ] Add recurring availability slots
- [ ] Add blocked dates
- [ ] Request staff on blocked date → Verify conflict warning
- [ ] Request staff outside availability → Verify warning

### Google Calendar
- [ ] Connect Google Calendar account
- [ ] Verify connection status
- [ ] (Future) Verify bookings sync to calendar

## Security Notes

1. **Webhook Security**: Stripe webhooks are verified using `STRIPE_WEBHOOK_SECRET`
2. **Service Role Key**: Only used server-side, never exposed to client
3. **RLS Policies**: All tables have Row Level Security enabled
4. **Role Validation**: All API routes verify user roles

## Production Deployment

1. Set all environment variables in Vercel/dashboard
2. Configure Stripe webhook URL in Stripe Dashboard
3. Update `GOOGLE_REDIRECT_URI` to production URL
4. Test webhook delivery in Stripe Dashboard
5. Monitor logs for any errors

## Troubleshooting

### Webhooks not working
- Verify webhook URL is accessible publicly
- Check webhook secret matches Stripe Dashboard
- Use Stripe CLI for local testing
- Check server logs for errors

### Notifications not appearing
- Verify Supabase Realtime is enabled
- Check RLS policies allow user to read notifications
- Verify triggers are created in database

### Google Calendar connection fails
- Verify OAuth credentials are correct
- Check redirect URI matches exactly
- Ensure Calendar API is enabled in Google Cloud

## Next Steps

- Implement automatic calendar event creation on booking acceptance
- Add email notifications (via Supabase or Resend)
- Add more detailed conflict detection
- Implement recurring payment subscriptions (if needed)

