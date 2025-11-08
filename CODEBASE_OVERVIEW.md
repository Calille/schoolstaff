# School Staff Platform - Comprehensive Codebase Overview

## Table of Contents
1. [Project Structure & Technology Stack](#project-structure--technology-stack)
2. [Frontend Pages & Components](#frontend-pages--components)
3. [Backend & API](#backend--api)
4. [Key Features & Functionality](#key-features--functionality)
5. [Database Schema](#database-schema)
6. [Configuration & Environment](#configuration--environment)

---

## Project Structure & Technology Stack

### Root Directory Structure

```
schoolstaff/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes (backend endpoints)
│   ├── dashboard/         # User dashboard pages
│   ├── for-schools/      # Marketing page for schools
│   ├── for-staff/        # Marketing page for staff
│   ├── how-it-works/     # Process explanation page
│   ├── login/            # Authentication pages
│   ├── signup/
│   ├── onboarding/       # User onboarding flows
│   ├── layout.tsx        # Root layout with analytics
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Global navigation
│   ├── footer.tsx        # Global footer
│   └── ...               # Feature-specific components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client utilities
│   ├── analytics.ts      # Google Analytics integration
│   ├── auth.ts           # Authentication helpers
│   ├── stripe.ts         # Stripe payment integration
│   └── ...               # Other utilities
├── supabase/             # Database migrations & functions
│   ├── migrations/       # SQL migration files
│   └── functions/        # Edge functions
├── tests/                # Test files
│   └── e2e/              # End-to-end tests
└── scripts/              # Utility scripts
```

### Technology Stack

**Frontend Framework:**
- **Next.js 16.0.1** (App Router)
- **React 19.2.0**
- **TypeScript 5.x**
- **Tailwind CSS 4.x** for styling
- **shadcn/ui** (Radix UI components) for UI components

**Backend:**
- **Next.js API Routes** (`app/api/`)
- **Supabase** (PostgreSQL database + Auth + Storage)
- **Stripe** for payment processing
- **Google Analytics** for tracking

**Key Dependencies:**
```json
{
  "@supabase/ssr": "^0.7.0",
  "@supabase/supabase-js": "^2.80.0",
  "stripe": "^19.3.0",
  "@stripe/stripe-js": "^8.3.0",
  "date-fns": "^4.1.0",
  "sonner": "^2.0.7",  // Toast notifications
  "lucide-react": "^0.553.0"  // Icons
}
```

**Routing Approach:**
- Uses Next.js App Router (file-based routing)
- Server Components by default
- Client Components marked with `'use client'`
- Route handlers in `app/api/` directory

---

## Frontend Pages & Components

### Main Pages/Routes

#### Public Marketing Pages

1. **`/` (Landing Page)**
   - **File**: `app/page.tsx`
   - **Purpose**: Main landing page with hero section and CTAs
   - **Features**: Analytics tracking, responsive design

2. **`/for-schools`**
   - **File**: `app/for-schools/page.tsx`
   - **Purpose**: Marketing page explaining how schools can book staff
   - **Features**:
     - Dynamic staff count teaser (`StaffCountTeaser` component)
     - Flat fee pricing explanation
     - Full staff listings (only for logged-in schools)
     - Conditional content based on authentication

3. **`/for-staff`**
   - **File**: `app/for-staff/page.tsx`
   - **Purpose**: Marketing page for teachers/staff to join
   - **Features**:
     - School count teaser (`SchoolCountTeaser` component)
     - Onboarding information
     - Full school listings (only for logged-in staff)

4. **`/how-it-works`**
   - **File**: `app/how-it-works/page.tsx`
   - **Purpose**: Process explanation page
   - **Features**: Step-by-step guide

#### Authentication Pages

5. **`/login`**
   - **File**: `app/login/page.tsx`
   - **Purpose**: User login page
   - **Features**: Supabase Auth integration

6. **`/signup`**
   - **File**: `app/signup/page.tsx`
   - **Purpose**: User registration page
   - **Features**: Account creation with role selection

7. **`/onboarding`**
   - **File**: `app/onboarding/page.tsx`
   - **Purpose**: Post-signup onboarding flow
   - **Sub-pages**:
     - `/onboarding/school` - School profile setup
     - `/onboarding/staff` - Staff profile setup

#### School Dashboard Pages

8. **`/dashboard/school`**
   - **File**: `app/dashboard/school/page.tsx`
   - **Purpose**: School dashboard home
   - **Features**: Overview stats, quick actions

9. **`/dashboard/school/staff`**
   - **File**: `app/dashboard/school/staff/page.tsx`
   - **Purpose**: Browse and request staff members
   - **Features**: Staff filtering, cart functionality

10. **`/dashboard/school/request`**
    - **File**: `app/dashboard/school/request/page.tsx`
    - **Purpose**: Create new staff request
    - **Features**: Request form with date/time selection

11. **`/dashboard/school/requests`**
    - **File**: `app/dashboard/school/requests/page.tsx`
    - **Purpose**: View all staff requests
    - **Features**: Request status tracking, batch management

12. **`/dashboard/school/timesheets`**
    - **File**: `app/dashboard/school/timesheets/page.tsx`
    - **Purpose**: Review and approve timesheets
    - **Features**: Approve/reject actions, status filtering

13. **`/dashboard/school/billing`**
    - **File**: `app/dashboard/school/billing/page.tsx`
    - **Purpose**: View invoices and manage payments
    - **Features**: Stripe integration, invoice history

14. **`/dashboard/school/request-cart`**
    - **File**: `app/dashboard/school/request-cart/page.tsx`
    - **Purpose**: Review cart before submitting batch requests
    - **Features**: Cart management, batch submission

#### Staff Dashboard Pages

15. **`/dashboard/staff`**
    - **File**: `app/dashboard/staff/page.tsx`
    - **Purpose**: Staff dashboard home
    - **Features**: Overview stats, pending requests

16. **`/dashboard/staff/availability`**
    - **File**: `app/dashboard/staff/availability/page.tsx`
    - **Purpose**: Manage recurring availability slots
    - **Features**: Weekly pattern selection, blocked dates

17. **`/dashboard/staff/calendar`**
    - **File**: `app/dashboard/staff/calendar/page.tsx`
    - **Purpose**: Google Calendar integration
    - **Features**: OAuth connection, calendar sync

18. **`/dashboard/staff/compliance`**
    - **File**: `app/dashboard/staff/compliance/page.tsx`
    - **Purpose**: Upload and manage compliance documents
    - **Features**: Document upload, expiry tracking

19. **`/dashboard/staff/timesheets`**
    - **File**: `app/dashboard/staff/timesheets/page.tsx`
    - **Purpose**: View submitted timesheets
    - **Features**: Timesheet list with status badges

20. **`/dashboard/staff/timesheets/new`**
    - **File**: `app/dashboard/staff/timesheets/new/page.tsx`
    - **Purpose**: Submit new timesheet
    - **Features**: Time entry form, client-side preview, analytics tracking

21. **`/dashboard/staff/requests`**
    - **File**: `app/dashboard/staff/requests/page.tsx`
    - **Purpose**: View and respond to staff requests
    - **Features**: Accept/decline actions, request details

#### Admin Dashboard Pages

22. **`/admin`**
    - **File**: `app/admin/page.tsx`
    - **Purpose**: Admin dashboard home
    - **Features**: System overview, quick stats

23. **`/admin/staff`**
    - **File**: `app/admin/staff/page.tsx`
    - **Purpose**: Manage staff members
    - **Features**: Staff list, profile management

24. **`/admin/compliance`**
    - **File**: `app/admin/compliance/page.tsx`
    - **Purpose**: Review compliance documents
    - **Features**: Verify/reject documents, expiry tracking

25. **`/admin/invoicing`**
    - **File**: `app/admin/invoicing/page.tsx`
    - **Purpose**: Manage invoices
    - **Features**: Invoice list, finalization, Stripe integration, analytics

26. **`/admin/payroll`**
    - **File**: `app/admin/payroll/page.tsx`
    - **Purpose**: Export payroll CSV
    - **Features**: Date range selection, CSV export, analytics

27. **`/admin/bookings`**
    - **File**: `app/admin/bookings/page.tsx`
    - **Purpose**: Manage all bookings
    - **Features**: Booking list, assignment tools

28. **`/admin/requests/open`**
    - **File**: `app/admin/requests/open/page.tsx`
    - **Purpose**: View and assign open requests
    - **Features**: Request assignment modal, staff selection

### Key Reusable Components

#### Layout Components

1. **`components/navbar.tsx`**
   - **Purpose**: Global navigation bar
   - **Features**:
     - Active page highlighting (`usePathname`)
     - Mobile hamburger menu
     - Role-based navigation (school/staff/admin)
     - Authentication state management
     - Notification bell integration
     - Cart count display

2. **`components/footer.tsx`**
   - **Purpose**: Global footer
   - **Features**: Links, copyright info

3. **`components/page-container.tsx`**
   - **Purpose**: Wrapper for marketing pages
   - **Features**: Includes Navbar and Footer

4. **`components/dashboard-sidebar.tsx`**
   - **Purpose**: Dashboard sidebar navigation
   - **Features**: Role-based menu items, active highlighting

#### Feature Components

5. **`components/staff-count-teaser.tsx`**
   - **Purpose**: Display dynamic staff count
   - **Features**: Fetches from `staff_profiles`, shows teaser for non-logged-in users

6. **`components/school-count-teaser.tsx`**
   - **Purpose**: Display dynamic school count
   - **Features**: Similar to staff count teaser

7. **`components/school-staff-list.tsx`**
   - **Purpose**: List staff members (for schools)
   - **Features**: Only visible to logged-in school users

8. **`components/school-list.tsx`**
   - **Purpose**: List schools (for staff)
   - **Features**: Only visible to logged-in staff users

9. **`components/notification-bell.tsx`**
   - **Purpose**: Notification indicator
   - **Features**: Real-time unread count, Supabase Realtime subscription

10. **`components/cart-count.tsx`**
    - **Purpose**: Display cart item count
    - **Features**: Real-time updates

11. **`components/assign-staff-modal.tsx`**
    - **Purpose**: Modal for assigning staff to requests
    - **Features**: Staff selection, compliance filtering

12. **`components/loading-spinner.tsx`**
    - **Purpose**: Loading indicators
    - **Components**: `LoadingSpinner`, `LoadingOverlay`, `TableSkeleton`

#### UI Components (shadcn/ui)

Located in `components/ui/`:
- `button.tsx` - Button component
- `card.tsx` - Card container
- `table.tsx` - Table components
- `dialog.tsx` - Modal dialogs
- `input.tsx` - Form inputs
- `select.tsx` - Dropdown selects
- `badge.tsx` - Status badges
- `toast.tsx` / `sonner.tsx` - Toast notifications
- And more...

### State Management Approach

- **No Redux/Context**: Uses React hooks (`useState`, `useEffect`)
- **Server State**: Supabase Realtime subscriptions for live data
- **Form State**: React Hook Form (where applicable) or controlled components
- **Global State**: Minimal - mostly server-side data fetching

### Form Handling & Validation

- **Client-side**: React controlled components with validation
- **Server-side**: API route validation (see Backend section)
- **Error Display**: Toast notifications using `sonner`
- **Loading States**: Loading spinners and disabled buttons during submission

---

## Backend & API

### API Endpoints

#### Authentication Routes

**`/api/auth/google/start`** (GET)
- **File**: `app/api/auth/google/start/route.ts`
- **Purpose**: Initiate Google OAuth flow
- **Returns**: Redirect to Google OAuth consent screen

**`/api/auth/google/callback`** (GET)
- **File**: `app/api/auth/google/callback/route.ts`
- **Purpose**: Handle Google OAuth callback
- **Returns**: Redirect to dashboard

#### Staff Management Routes

**`/api/staff/request`** (POST)
- **File**: `app/api/staff/request/route.ts`
- **Purpose**: Create staff request
- **Auth**: School users only
- **Body**: `{ school_id, date, start_time, end_time, ... }`

**`/api/staff/add-to-cart`** (POST)
- **File**: `app/api/staff/add-to-cart/route.ts`
- **Purpose**: Add staff member to cart
- **Auth**: School users

**`/api/staff/remove-from-cart`** (POST)
- **File**: `app/api/staff/remove-from-cart/route.ts`
- **Purpose**: Remove staff from cart
- **Auth**: School users

**`/api/staff/request-check`** (POST)
- **File**: `app/api/staff/request-check/route.ts`
- **Purpose**: Check if staff is available for request
- **Auth**: School users

**`/api/staff/requests/update`** (POST)
- **File**: `app/api/staff/requests/update/route.ts`
- **Purpose**: Update request status (accept/decline)
- **Auth**: Staff users

**`/api/staff/upload-document`** (POST)
- **File**: `app/api/staff/upload-document/route.ts`
- **Purpose**: Upload compliance document
- **Auth**: Staff users
- **Storage**: Supabase Storage

#### Timesheet Routes

**`/api/timesheets/submit`** (POST)
- **File**: `app/api/timesheets/submit/route.ts`
- **Purpose**: Submit timesheet
- **Auth**: Staff users only
- **Body**: `{ date, start_time, end_time, break_minutes, request_id?, school_id, notes? }`
- **Features**:
  - Server-side time calculation (`computeHoursAndAmount`)
  - Validation (time format, date format)
  - Notification to school users
  - Structured logging with `traceId`

**`/api/timesheets/review`** (POST)
- **File**: `app/api/timesheets/review/route.ts`
- **Purpose**: Approve/reject timesheet
- **Auth**: School users only
- **Body**: `{ timesheet_id, action: 'approve' | 'reject', comment? }`
- **Features**: Notification to staff, status update

#### Invoice Routes

**`/api/invoices/generate`** (POST)
- **File**: `app/api/invoices/generate/route.ts`
- **Purpose**: Generate invoice from timesheets
- **Auth**: Admin or School users
- **Body**: `{ invoice_id?, timesheet_ids, finalize? }`
- **Features**:
  - Atomic invoice creation via `lock_and_create_invoice` RPC
  - Idempotency (skips already-invoiced timesheets)
  - Stripe invoice creation (if finalized)
  - Structured logging

#### Payroll Routes

**`/api/payroll/export`** (POST)
- **File**: `app/api/payroll/export/route.ts`
- **Purpose**: Export payroll CSV
- **Auth**: Admin only
- **Body**: `{ date_from, date_to }`
- **Features**:
  - Atomic selection via `select_and_mark_payroll` RPC
  - CSV generation
  - Marks timesheets as `processed_for_payroll`
  - Fallback to manual query if RPC not available

#### Billing Routes

**`/api/billing/create-checkout-session`** (POST)
- **File**: `app/api/billing/create-checkout-session/route.ts`
- **Purpose**: Create Stripe checkout session
- **Auth**: School users
- **Returns**: Checkout session URL

**`/api/billing/webhook`** (POST)
- **File**: `app/api/billing/webhook/route.ts`
- **Purpose**: Handle Stripe webhooks
- **Auth**: Stripe signature verification
- **Events**: `checkout.session.completed`, `invoice.paid`

**`/api/billing/customer-portal`** (POST)
- **File**: `app/api/billing/customer-portal/route.ts`
- **Purpose**: Create Stripe customer portal session
- **Auth**: School users

#### Notification Routes

**`/api/notifications/create`** (POST)
- **File**: `app/api/notifications/create/route.ts`
- **Purpose**: Create notification (server-side helper)
- **Auth**: Service role (server-only)

**`/api/notifications/mark-read`** (POST)
- **File**: `app/api/notifications/mark-read/route.ts`
- **Purpose**: Mark notification as read
- **Auth**: Authenticated users

**`/api/notifications/unread-count`** (GET)
- **File**: `app/api/notifications/unread-count/route.ts`
- **Purpose**: Get unread notification count
- **Auth**: Authenticated users

#### Admin Routes

**`/api/admin/assign-staff`** (POST)
- **File**: `app/api/admin/assign-staff/route.ts`
- **Purpose**: Assign staff to request
- **Auth**: Admin only

**`/api/admin/compliance/verify`** (POST)
- **File**: `app/api/admin/compliance/verify/route.ts`
- **Purpose**: Verify compliance document
- **Auth**: Admin only

**`/api/admin/compliance/reject`** (POST)
- **File**: `app/api/admin/compliance/reject/route.ts`
- **Purpose**: Reject compliance document
- **Auth**: Admin only

#### Batch Routes

**`/api/batches/submit`** (POST)
- **File**: `app/api/batches/submit/route.ts`
- **Purpose**: Submit batch of staff requests
- **Auth**: School users

#### Cart Routes

**`/api/cart/count`** (GET)
- **File**: `app/api/cart/count/route.ts`
- **Purpose**: Get cart item count
- **Auth**: School users

### Database Models/Tables

See [Database Schema](#database-schema) section below.

### Authentication/Authorization Flow

1. **Signup**: User creates account via `/signup`
2. **Onboarding**: User selects role (school/staff) and completes profile
3. **Session Management**: Supabase Auth handles sessions via cookies
4. **Middleware**: `middleware.ts` protects routes:
   - `/admin/*` - Admin role required
   - `/dashboard/*` - Authenticated users
   - Role-based redirects
5. **Server-side Auth**: `lib/auth.ts` provides helpers:
   - `getUserProfile()` - Get current user profile
   - `requireRole(role)` - Require specific role
   - `getSchoolProfile()` - Get school profile
   - `getStaffProfile()` - Get staff profile

### Middleware & Utility Functions

**`middleware.ts`**
- **Purpose**: Route protection and auth state management
- **Features**:
  - Supabase session refresh
  - Admin route protection
  - Role-based redirects

**`lib/supabase/server.ts`**
- **Function**: `createClient()`
- **Purpose**: Server-side Supabase client with cookie handling

**`lib/supabase/client.ts`**
- **Function**: `createClient()`
- **Purpose**: Browser-side Supabase client

**`lib/supabaseAdmin.ts`**
- **Export**: `supabaseAdmin`
- **Purpose**: Service role client (bypasses RLS)
- **Usage**: Server-only operations (notifications, admin actions)

**`lib/notifyServer.ts`**
- **Functions**: `notifyUserIds()`, `notifyUserId()`
- **Purpose**: Create notifications (server-only)

**`lib/computeHours.ts`**
- **Function**: `computeHoursAndAmount()`
- **Purpose**: Calculate hours and amount from timesheet data
- **Features**: Handles overnight shifts, break minutes

**`lib/monitoring.ts`**
- **Purpose**: Structured logging utilities
- **Features**: Correlation IDs, request/response logging

### External API Integrations

1. **Stripe**
   - **File**: `lib/stripe.ts`
   - **Purpose**: Payment processing
   - **Features**:
     - Checkout session creation
     - Customer portal
     - Webhook handling
     - Invoice creation

2. **Google Calendar**
   - **File**: `lib/google-calendar.ts`
   - **Purpose**: Calendar sync
   - **Features**: OAuth flow, event creation

3. **Google Analytics**
   - **File**: `lib/analytics.ts`
   - **Purpose**: User behavior tracking
   - **Features**: Page views, custom events
   - **Privacy**: No sensitive data sent

---

## Key Features & Functionality

### Core Business Logic

#### Staff Request Flow

1. **School creates request** (`/dashboard/school/request`)
   - Selects date, time, requirements
   - Can add multiple staff to cart
   - Submits batch request

2. **Admin assigns staff** (`/admin/requests/open`)
   - Views open requests
   - Selects compliant staff
   - Assigns to request

3. **Staff accepts/declines** (`/dashboard/staff/requests`)
   - Views assigned requests
   - Accepts or declines
   - Notification sent to school

4. **Payment processing** (`/api/billing/create-checkout-session`)
   - School pays flat fee
   - Stripe webhook confirms payment
   - Request status updated to "paid"

#### Timesheet Flow

1. **Staff submits timesheet** (`/dashboard/staff/timesheets/new`)
   - Enters date, start/end time, breaks
   - Server calculates hours and amount
   - Status: `submitted`

2. **School reviews** (`/dashboard/school/timesheets`)
   - Views pending timesheets
   - Approves or rejects
   - Status: `approved_by_school` or `rejected`

3. **Invoice generation** (`/admin/invoicing`)
   - Admin selects approved timesheets
   - Generates invoice atomically
   - Status: `draft` → `open` (when finalized)

4. **Payroll export** (`/admin/payroll`)
   - Admin selects date range
   - Exports CSV atomically
   - Timesheets marked as `processed_for_payroll`

### Teacher Management Features

- **Staff Profiles**: View staff members with qualifications
- **Compliance Management**: Document upload and verification
- **Availability Management**: Recurring slots and blocked dates
- **Calendar Integration**: Google Calendar sync
- **Timesheet Submission**: Track hours worked

### School Management Features

- **Staff Browsing**: Search and filter available staff
- **Request Creation**: Create staff requests with requirements
- **Cart System**: Add multiple staff to cart before submitting
- **Timesheet Review**: Approve/reject submitted timesheets
- **Invoice Management**: View invoices and payment history
- **Billing Portal**: Stripe customer portal integration

### Booking/Placement System

- **Request System**: Schools create requests, admins assign staff
- **Status Tracking**: `pending` → `assigned` → `accepted` → `paid`
- **Batch Requests**: Submit multiple staff requests at once
- **Conflict Detection**: Checks availability before assignment

### CRM Functionality

- **User Profiles**: School and staff profiles
- **Request History**: Track all requests and bookings
- **Notification System**: Real-time notifications for key events
- **Invoice Tracking**: Track invoices and payments

### Email Systems & Notifications

- **Real-time Notifications**: Supabase Realtime subscriptions
- **Notification Types**:
  - `timesheet_submitted`
  - `timesheet_approved`
  - `timesheet_rejected`
  - `request_assigned`
  - `request_accepted`
  - `invoice_finalized`
- **Notification Bell**: Unread count in navbar
- **Notifications Page**: `/dashboard/notifications`

---

## Database Schema

### Core Tables

#### `profiles`
- **Purpose**: User profiles with roles
- **Fields**:
  - `id` (uuid, PK) - References `auth.users.id`
  - `full_name` (text)
  - `email` (text)
  - `role` (text) - `'school' | 'staff' | 'admin'`
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

#### `schools`
- **Purpose**: School information
- **Fields**:
  - `id` (uuid, PK)
  - `profile_id` (uuid, FK → `profiles.id`)
  - `school_name` (text)
  - `address` (text)
  - `stripe_customer_id` (text) - Stripe customer ID
  - `created_at` (timestamptz)

#### `staff_profiles`
- **Purpose**: Staff member profiles
- **Fields**:
  - `id` (uuid, PK, FK → `profiles.id`)
  - `hourly_rate` (numeric)
  - `is_active` (boolean)
  - `bank_name` (text, nullable)
  - `bank_account` (text, nullable)
  - `created_at` (timestamptz)

#### `staff_requests`
- **Purpose**: Staff booking requests
- **Fields**:
  - `id` (uuid, PK)
  - `school_id` (uuid, FK → `schools.id`)
  - `staff_id` (uuid, FK → `staff_profiles.id`, nullable)
  - `date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `status` (text) - `'pending' | 'assigned' | 'accepted' | 'declined' | 'paid'`
  - `created_at` (timestamptz)

#### `timesheets`
- **Purpose**: Staff timesheet entries
- **Fields**:
  - `id` (uuid, PK)
  - `staff_id` (uuid, FK → `staff_profiles.id`)
  - `school_id` (uuid, FK → `schools.id`)
  - `request_id` (uuid, FK → `staff_requests.id`, nullable)
  - `date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `break_minutes` (integer)
  - `total_hours` (numeric) - Generated column
  - `hourly_rate` (numeric)
  - `amount` (numeric) - Generated column
  - `status` (text) - `'submitted' | 'approved_by_school' | 'rejected' | 'processed_for_payroll'`
  - `notes` (text, nullable)
  - `created_at` (timestamptz)

#### `school_invoices`
- **Purpose**: Invoices for schools
- **Fields**:
  - `id` (uuid, PK)
  - `school_id` (uuid, FK → `schools.id`)
  - `stripe_invoice_id` (text, nullable)
  - `amount` (numeric)
  - `status` (text) - `'draft' | 'open' | 'paid'`
  - `issued_at` (timestamptz, nullable)
  - `created_at` (timestamptz)
  - `last_error` (text, nullable) - For webhook failures

#### `invoice_lines`
- **Purpose**: Invoice line items (links timesheets to invoices)
- **Fields**:
  - `id` (uuid, PK)
  - `invoice_id` (uuid, FK → `school_invoices.id`)
  - `timesheet_id` (uuid, FK → `timesheets.id`)
  - `description` (text)
  - `quantity` (numeric) - Hours
  - `unit_price` (numeric) - Hourly rate
  - `line_total` (numeric) - Generated column

#### `notifications`
- **Purpose**: User notifications
- **Fields**:
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → `profiles.id`)
  - `type` (text)
  - `payload` (jsonb)
  - `read` (boolean)
  - `created_at` (timestamptz)

#### `staff_availability`
- **Purpose**: Recurring availability slots
- **Fields**:
  - `id` (uuid, PK)
  - `staff_id` (uuid, FK → `staff_profiles.id`)
  - `day_of_week` (integer) - 0-6 (Sunday-Saturday)
  - `start_time` (time)
  - `end_time` (time)
  - `created_at` (timestamptz)

#### `staff_blocks`
- **Purpose**: Blocked dates for staff
- **Fields**:
  - `id` (uuid, PK)
  - `staff_id` (uuid, FK → `staff_profiles.id`)
  - `start_date` (date)
  - `end_date` (date)
  - `reason` (text, nullable)

#### `staff_documents`
- **Purpose**: Compliance documents
- **Fields**:
  - `id` (uuid, PK)
  - `staff_id` (uuid, FK → `staff_profiles.id`)
  - `document_type` (text) - `'dbs' | 'right_to_work' | 'safeguarding_training' | 'id_passport'`
  - `document_url` (text) - Supabase Storage URL
  - `expiry_date` (date, nullable)
  - `verified` (boolean)
  - `uploaded_at` (timestamptz)

#### `external_calendars`
- **Purpose**: Google Calendar connections
- **Fields**:
  - `id` (uuid, PK)
  - `staff_id` (uuid, FK → `staff_profiles.id`)
  - `provider` (text) - `'google'`
  - `access_token` (text) - Encrypted
  - `refresh_token` (text) - Encrypted
  - `calendar_id` (text)
  - `connected_at` (timestamptz)

### Key Relationships

```
profiles (1) ──┬── (1) schools
               │
               └── (1) staff_profiles

schools (1) ──── (many) staff_requests
staff_profiles (1) ──── (many) staff_requests

staff_profiles (1) ──── (many) timesheets
schools (1) ──── (many) timesheets
staff_requests (1) ──── (many) timesheets

schools (1) ──── (many) school_invoices
school_invoices (1) ──── (many) invoice_lines
timesheets (1) ──── (1) invoice_lines

staff_profiles (1) ──── (many) staff_availability
staff_profiles (1) ──── (many) staff_blocks
staff_profiles (1) ──── (many) staff_documents
staff_profiles (1) ──── (many) external_calendars

profiles (1) ──── (many) notifications
```

### Important Indexes

```sql
-- Timesheets
CREATE INDEX idx_timesheets_school_id ON timesheets(school_id);
CREATE INDEX idx_timesheets_staff_id ON timesheets(staff_id);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_timesheets_status_date ON timesheets(status, date) WHERE status = 'approved_by_school';

-- Invoice lines
CREATE INDEX idx_invoice_lines_timesheet_id ON invoice_lines(timesheet_id);

-- Staff requests
CREATE INDEX idx_staff_requests_school_id ON staff_requests(school_id);
CREATE INDEX idx_staff_requests_staff_id ON staff_requests(staff_id);
CREATE INDEX idx_staff_requests_status ON staff_requests(status);
```

### Database Functions (PL/pgSQL)

#### `create_invoice_from_timesheets(p_school_id, p_timesheet_ids, p_issued_by)`
- **Purpose**: Atomically create invoice and invoice lines
- **File**: `supabase/migrations/20240101000002_production_plpgsql_functions.sql`
- **Features**: Idempotent, skips already-invoiced timesheets

#### `lock_and_create_invoice(p_school_id, p_timesheet_ids, p_issued_by)`
- **Purpose**: Create invoice with advisory lock (concurrency safety)
- **File**: `supabase/migrations/20240101000002_production_plpgsql_functions.sql`
- **Features**: Uses `pg_advisory_lock` to prevent race conditions

#### `select_and_mark_payroll(p_date_from, p_date_to)`
- **Purpose**: Atomically select and mark timesheets for payroll
- **File**: `supabase/migrations/20240101000002_production_plpgsql_functions.sql`
- **Features**: Uses `FOR UPDATE SKIP LOCKED` for concurrent safety

### Row-Level Security (RLS)

RLS is enabled on all tables. Policies ensure:
- **Staff users**: Can only see their own data
- **School users**: Can only see data for their school
- **Admin users**: Can see all data
- **Public**: No access to sensitive data

---

## Configuration & Environment

### Required Environment Variables

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Optional - for payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_BOOKING_FEE=price_...

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google OAuth (Optional - for calendar sync)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Key Configuration Files

**`next.config.ts`**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

**`tsconfig.json`**
- TypeScript configuration
- Path aliases: `@/*` → `./*`
- Excludes: `supabase/functions/**/*`

**`components.json`**
- shadcn/ui configuration
- Component paths and styling

**`.gitignore`**
- Excludes `.env*` files
- Excludes `node_modules`, `.next`, build artifacts

### Deployment Setup

#### Vercel (Staging)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### cPanel (Production)
1. Build: `npm run build`
2. Upload `.next` folder
3. Use PM2 to manage Node.js process

### Database Migrations

All migrations are in `supabase/migrations/`:
1. `20240101000000_atomic_invoice_functions.sql`
2. `20240101000001_payroll_atomic_select.sql`
3. `20240101000002_production_plpgsql_functions.sql`

Apply via Supabase SQL Editor or Supabase CLI.

---

## Summary

The **School Staff Platform** is a comprehensive Next.js application for connecting schools with qualified staff members. It features:

- **Modern Tech Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Full-Stack Architecture**: Server Components, API Routes, Supabase backend
- **Role-Based Access**: School, Staff, and Admin dashboards
- **Payment Processing**: Stripe integration for flat-fee bookings
- **Timesheet Management**: Complete workflow from submission to payroll
- **Compliance Management**: Document upload and verification
- **Real-time Features**: Notifications, live updates
- **Production-Ready**: Atomic operations, concurrency safety, structured logging

The codebase follows best practices with:
- Type safety (TypeScript)
- Security (RLS, auth middleware)
- Performance (indexed queries, atomic operations)
- Monitoring (analytics, structured logging)
- Scalability (concurrent-safe operations)

For deployment, see `DEPLOYMENT_GUIDE.md` and `PHASE10_DEPLOYMENT_CHECKLIST.md`.

