# School Staff

A Next.js web application for connecting schools with qualified staff members.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + **shadcn/ui** (Radix components)
- **Supabase** (Auth + DB + Storage)
- **Google Analytics** (optional)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (already configured)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ckjdudyyupcxljtsexil.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNramR1ZHl5dXBjeGxqdHNleGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NzE3NjEsImV4cCI6MjA3ODE0Nzc2MX0.Vl6mEP1MWynNNPR4cszXBRZt7GHaDB0TYYUbS84pTt8
NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=your_ga_id (optional)
```

**Note:** The Supabase project "School Staff" is already configured. You just need to create the `.env.local` file with the values above.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  ├── (marketing pages)
  │   ├── page.tsx              # Landing page
  │   ├── for-schools/          # For schools page
  │   ├── for-staff/            # For staff page
  │   └── how-it-works/         # How it works page
  ├── (auth pages)
  │   ├── login/                # Login page
  │   └── signup/               # Signup page
  ├── dashboard/                # School user dashboard
  │   ├── layout.tsx            # Dashboard layout with sidebar
  │   ├── page.tsx              # Dashboard home
  │   ├── book/                 # Request staff form
  │   └── bookings/             # List bookings
  └── admin/                    # Admin dashboard
      ├── layout.tsx            # Admin layout with sidebar
      ├── page.tsx              # Admin home
      ├── staff/                # Staff management
      └── bookings/             # Booking management

components/
  ├── ui/                       # shadcn/ui components
  ├── navbar.tsx                # Global navigation
  ├── footer.tsx                 # Global footer
  ├── dashboard-sidebar.tsx     # Dashboard sidebar navigation
  └── staff-count-teaser.tsx    # Staff count display component

lib/
  ├── supabase/
  │   ├── client.ts             # Browser Supabase client
  │   ├── server.ts             # Server Supabase client
  │   └── middleware.ts         # Auth middleware
  └── auth.ts                   # Auth utilities
```

## Features

### Public Marketing Site
- Landing page with hero and CTA
- For Schools page with staff count teaser
- For Staff page with onboarding info
- How It Works page with process explanation
- Global navigation and footer

### Authentication
- Login/Signup pages
- Session management
- Protected routes with role-based access

### School Dashboard
- Dashboard overview with stats
- Request staff form (scaffold)
- Bookings list (scaffold)

### Admin Dashboard
- Admin overview with stats
- Staff management (scaffold)
- Booking management (scaffold)

## Database Schema

The application uses the following Supabase tables:
- `schools` - School information
- `app_users` - User profiles with roles
- `staff` - Staff member profiles
- `bookings` - Staff booking requests

Row Level Security (RLS) is enabled to ensure:
- School users can only see data for their school
- Admin users can see all data
- Proper access control throughout

## Deployment

### Staging (Vercel)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Production (cPanel with PM2)
1. Build the application: `npm run build`
2. Upload to cPanel
3. Use PM2 to manage the Node.js process

## Phase 4 Features (Implemented)

### Real-time Notifications
- Automatic notifications for requests, acceptances, and payments
- Real-time notification bell in navbar
- Full notifications center at `/dashboard/notifications`

### Stripe Billing
- Flat-fee payment per booking
- Checkout sessions and webhook handling
- Customer portal integration
- Invoice tracking
- Billing page at `/dashboard/school/billing`

### Availability Management
- Recurring weekly availability slots
- Blocked dates management
- Conflict detection before booking
- Availability page at `/dashboard/staff/availability`

### Google Calendar Sync
- OAuth flow for Google Calendar connection
- Calendar management page at `/dashboard/staff/calendar`
- Token refresh logic implemented

See `README_PHASE4.md` for detailed setup instructions.

## Next Steps

- Configure Stripe and Google OAuth credentials (see README_PHASE4.md)
- Test webhook delivery in production
- Add email notifications (optional)
- Implement automatic calendar event creation
