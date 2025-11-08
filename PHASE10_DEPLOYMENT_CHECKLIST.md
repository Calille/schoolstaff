# Phase 10: Final Integration & Deployment Checklist

## 🎯 Overview

This checklist ensures complete integration, testing, and deployment readiness for the School Staff platform.

---

## 1️⃣ Full Backend → Frontend Integration

### ✅ Timesheet Submission
- [x] Frontend: `/dashboard/staff/timesheets/new` → `/api/timesheets/submit`
- [x] Backend validates session and staff role
- [x] Server-side hours/amount calculation
- [x] Notifications sent to school users
- [ ] **TODO**: Add loading state during submission
- [ ] **TODO**: Add error recovery (retry button)

### ✅ Invoice Generation
- [x] Frontend: `/admin/invoicing` → `/api/invoices/generate`
- [x] Backend uses atomic PL/pgSQL functions
- [x] Idempotency checks prevent duplicates
- [x] Stripe integration (optional)
- [ ] **TODO**: Add invoice preview before finalization
- [ ] **TODO**: Add bulk invoice generation UI

### ✅ Payroll Export
- [x] Frontend: `/admin/payroll` → `/api/payroll/export`
- [x] Backend uses `select_and_mark_payroll` function
- [x] CSV generation with proper formatting
- [x] Atomic processing prevents duplicates
- [ ] **TODO**: Add export history/audit log
- [ ] **TODO**: Add email notification on export completion

### ✅ Staff Availability Listings
- [x] Frontend: `/dashboard/school/staff` uses Supabase queries
- [x] RLS policies enforce school-specific access
- [x] Compliance filtering (only compliant staff shown)
- [ ] **TODO**: Add teaser content for non-logged-in users
- [ ] **TODO**: Add "283 teachers nearby" dynamic count

### ✅ Session-Based Access Control
- [x] Schools see only their own data (RLS enforced)
- [x] Staff see only their own timesheets
- [x] Admin sees all data
- [x] Middleware protects routes by role
- [ ] **TODO**: Add session expiry handling
- [ ] **TODO**: Add "Access Denied" pages

---

## 2️⃣ Final UI/UX Polish

### Navigation Bar
- [x] Responsive design implemented
- [x] Active page highlighting (check current implementation)
- [ ] **TODO**: Mobile hamburger menu (if not already implemented)
- [ ] **TODO**: Add breadcrumbs for deep navigation

### Loading States
- [x] Toast notifications (sonner) for success/error
- [ ] **TODO**: Add spinner/loading indicators for:
  - Timesheet submission
  - Invoice generation
  - Payroll export
  - Staff listing loads
- [ ] **TODO**: Skeleton loaders for table data

### Error Handling
- [x] Structured error responses from API
- [x] Toast notifications for errors
- [ ] **TODO**: Add retry mechanisms for failed requests
- [ ] **TODO**: Add error boundary components
- [ ] **TODO**: User-friendly error messages

### Color Scheme & Branding
- [x] Light greys & whites theme
- [x] Consistent shadcn/ui components
- [ ] **TODO**: Verify all pages use consistent colors
- [ ] **TODO**: Add dark mode support (optional)

### Mobile Responsiveness
- [x] Tailwind responsive classes
- [ ] **TODO**: Test on:
  - iPhone (Safari)
  - Android (Chrome)
  - iPad (Safari)
  - Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## 3️⃣ Analytics & Monitoring

### Google Analytics Integration
- [ ] **TODO**: Install `@next/third-parties` or `react-ga4`
- [ ] **TODO**: Track page visits:
  - Home page
  - For Schools page
  - For Staff page
  - Dashboard pages
- [ ] **TODO**: Track events:
  - Timesheet submissions
  - Invoice generation
  - Payroll exports
  - Staff requests
- [ ] **TODO**: Ensure no sensitive data in analytics
- [ ] **TODO**: Add privacy policy link

### Backend Logging
- [x] Structured logging with `traceId` in API routes
- [x] Console logging for errors
- [ ] **TODO**: Set up log aggregation (optional):
  - Vercel Logs
  - Supabase Logs
  - External service (Datadog, Sentry)
- [ ] **TODO**: Add correlation IDs to all requests
- [ ] **TODO**: Log slow queries (>100ms)

### Error Tracking
- [ ] **TODO**: Set up error monitoring:
  - Sentry (recommended)
  - Vercel Error Tracking
  - Supabase Error Logs
- [ ] **TODO**: Alert on critical errors:
  - Payment failures
  - Database connection errors
  - Authentication failures

---

## 4️⃣ End-to-End Testing

### Timesheet Workflow Test
- [ ] **TODO**: Create test script:
  1. Staff submits timesheet
  2. School approves timesheet
  3. Admin generates invoice
  4. Admin exports payroll
- [ ] **TODO**: Verify:
  - Notifications sent correctly
  - Status transitions work
  - Amounts calculated correctly
  - CSV export includes correct data

### Invoice Creation Test
- [ ] **TODO**: Test idempotency:
  - Submit same timesheet IDs twice
  - Verify no duplicate invoice_lines
- [ ] **TODO**: Test concurrency:
  - Two parallel requests for same school
  - Verify only one invoice created
  - Verify advisory locks work

### Payroll Export Test
- [ ] **TODO**: Test `FOR UPDATE SKIP LOCKED`:
  - Two parallel exports for same date range
  - Verify no duplicate timesheets
  - Verify all timesheets marked as processed
- [ ] **TODO**: Test edge cases:
  - Empty date range
  - No timesheets in range
  - Already processed timesheets

### Staff Listing & Teaser Content
- [ ] **TODO**: Test visibility:
  - Non-logged-in: See teaser count only
  - Logged-in school: See full staff details
  - Logged-in staff: See own profile only
- [ ] **TODO**: Verify RLS policies:
  - Schools cannot see other schools' staff
  - Staff cannot see other staff details

### Unit & Integration Tests
- [ ] **TODO**: Test `computeHoursAndAmount`:
  - Overnight shifts
  - Zero breaks
  - Large breaks
  - Fractional hours
- [ ] **TODO**: Test `lock_and_create_invoice`:
  - Concurrent requests
  - Error handling
  - Lock release
- [ ] **TODO**: Test `select_and_mark_payroll`:
  - Concurrent exports
  - Date range filtering
  - Staff data joins

---

## 5️⃣ Deployment

### Pre-Deployment Checklist
- [ ] **TODO**: Verify all environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY` (if using Stripe)
  - `GOOGLE_ANALYTICS_ID` (if using GA)
- [ ] **TODO**: Run production build locally:
  ```bash
  npm run build
  npm run start
  ```
- [ ] **TODO**: Check for TypeScript errors
- [ ] **TODO**: Check for linting errors
- [ ] **TODO**: Verify all migrations applied in Supabase

### Vercel Deployment (Staging)
- [ ] **TODO**: Deploy to Vercel preview/staging
- [ ] **TODO**: Test all features in staging:
  - Authentication flows
  - Timesheet submission
  - Invoice generation
  - Payroll export
- [ ] **TODO**: Verify environment variables in Vercel
- [ ] **TODO**: Test Stripe webhooks (if applicable)
- [ ] **TODO**: Verify Supabase connections

### Production Deployment
- [ ] **TODO**: Deploy to production (Vercel or cPanel)
- [ ] **TODO**: Verify SSL certificates active
- [ ] **TODO**: Test production URLs:
  - Main site loads
  - Authentication works
  - API endpoints respond
- [ ] **TODO**: Verify Supabase production project connected
- [ ] **TODO**: Test notifications in production
- [ ] **TODO**: Test CSV exports download correctly

---

## 6️⃣ Post-Deployment Validation

### Row-Level Security (RLS) Policies
- [ ] **TODO**: Test school isolation:
  - School A cannot see School B's timesheets
  - School A cannot see School B's invoices
  - School A cannot see School B's staff requests
- [ ] **TODO**: Test staff isolation:
  - Staff A cannot see Staff B's timesheets
  - Staff A cannot modify Staff B's data
- [ ] **TODO**: Test admin access:
  - Admin can see all data
  - Admin can modify all data (with proper validation)

### Session Handling & Auth Flows
- [ ] **TODO**: Test login/logout flows
- [ ] **TODO**: Test session expiry
- [ ] **TODO**: Test role-based redirects:
  - Staff → `/dashboard/staff`
  - School → `/dashboard/school`
  - Admin → `/admin`
- [ ] **TODO**: Test protected routes:
  - Unauthenticated users redirected to login
  - Wrong role users redirected appropriately

### Dashboard Data Validation
- [ ] **TODO**: Verify dashboards show correct data:
  - Staff dashboard: Own timesheets only
  - School dashboard: Own school's timesheets/staff
  - Admin dashboard: All data aggregated correctly
- [ ] **TODO**: Test real-world scenarios:
  - Multiple schools
  - Multiple staff per school
  - Multiple timesheets per staff
  - Multiple invoices per school

### Notifications & Exports
- [ ] **TODO**: Test notification delivery:
  - Timesheet submitted → School notified
  - Timesheet approved → Staff notified
  - Invoice finalized → School notified
- [ ] **TODO**: Test CSV exports:
  - Payroll CSV downloads correctly
  - CSV format is correct
  - CSV data matches database
- [ ] **TODO**: Test email notifications (if implemented)

### Analytics & Logging Sanity Check
- [ ] **TODO**: Verify analytics tracking:
  - Page views recorded
  - Events tracked correctly
  - No sensitive data in analytics
- [ ] **TODO**: Verify logging:
  - Errors logged with traceId
  - Slow queries logged
  - Critical events logged
- [ ] **TODO**: Set up alerts:
  - Error rate > threshold
  - Response time > threshold
  - Database connection failures

---

## 📋 Quick Reference Commands

### Testing Commands
```bash
# Run TypeScript check
npm run build

# Run linter
npm run lint

# Test API endpoints locally
curl -X POST http://localhost:3000/api/timesheets/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"date": "2024-01-15", "start_time": "09:00", "end_time": "17:00", "school_id": "..."}'
```

### Deployment Commands
```bash
# Build for production
npm run build

# Start production server locally
npm run start

# Deploy to Vercel
vercel --prod

# Check Supabase migrations
supabase migration list
```

### Validation Queries
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check function permissions
SELECT routine_name, grantee 
FROM information_schema.routine_privileges 
WHERE routine_schema = 'public';

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
```

---

## 🚨 Critical Issues to Resolve Before Production

1. **Security**: Verify all RLS policies are active and tested
2. **Performance**: Test with realistic data volumes
3. **Error Handling**: Ensure all errors are caught and logged
4. **Data Integrity**: Verify atomic operations work correctly
5. **Monitoring**: Set up alerts for critical failures

---

## 📝 Notes

- All TODO items should be checked off before production deployment
- Test in staging environment first
- Keep deployment checklist updated as items are completed
- Document any issues found during testing

---

**Last Updated**: [Current Date]
**Status**: In Progress
**Next Review**: After staging deployment

