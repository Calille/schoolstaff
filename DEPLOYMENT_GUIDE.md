# Deployment Guide - School Staff Platform

## Pre-Deployment Checklist

### 1. Environment Variables

Verify all environment variables are set in your deployment platform:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 2. Database Migrations

Apply all migrations in Supabase:

```sql
-- Run in Supabase SQL Editor:
-- 1. supabase/migrations/20240101000000_atomic_invoice_functions.sql
-- 2. supabase/migrations/20240101000001_payroll_atomic_select.sql
-- 3. supabase/migrations/20240101000002_production_plpgsql_functions.sql
```

Verify functions exist:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'create_invoice_from_timesheets',
    'lock_and_create_invoice',
    'select_and_mark_payroll'
  );
```

### 3. RLS Policies

Verify RLS is enabled on all tables:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('timesheets', 'school_invoices', 'invoice_lines', 'staff_profiles', 'schools');
```

### 4. Build Verification

```bash
# Build locally
npm run build

# Check for errors
npm run lint

# Test production build
npm run start
```

---

## Vercel Deployment

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Step 2: Environment Variables

Add all environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add each variable for Production, Preview, and Development

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Test staging URL

### Step 4: Verify Deployment

- [ ] Site loads correctly
- [ ] Authentication works
- [ ] API endpoints respond
- [ ] Supabase connection works
- [ ] SSL certificate active

---

## cPanel Deployment

### Step 1: Build Locally

```bash
npm run build
npm run export  # If using static export
```

### Step 2: Upload Files

1. Upload `.next` folder and all files to cPanel
2. Ensure `package.json` is uploaded
3. Upload `next.config.js` if present

### Step 3: Set Environment Variables

In cPanel:
1. Go to "Node.js" or "Environment Variables"
2. Add all required variables
3. Restart application

### Step 4: Configure Node.js

1. Create Node.js application in cPanel
2. Set Node.js version (18+)
3. Set application root
4. Set application URL
5. Start application

### Step 5: SSL Certificate

1. Install SSL certificate (Let's Encrypt recommended)
2. Force HTTPS redirect
3. Verify SSL is active

---

## Post-Deployment Validation

### 1. Smoke Tests

```bash
# Test homepage
curl https://your-domain.com

# Test API endpoint (should return 401 without auth)
curl https://your-domain.com/api/timesheets/submit
```

### 2. Authentication Flow

- [ ] Login works
- [ ] Logout works
- [ ] Session persists
- [ ] Role-based redirects work

### 3. Critical Features

- [ ] Timesheet submission
- [ ] Timesheet approval
- [ ] Invoice generation
- [ ] Payroll export
- [ ] Staff listing

### 4. Security Checks

- [ ] RLS policies active
- [ ] Unauthenticated users blocked
- [ ] Wrong role users redirected
- [ ] No sensitive data in logs

### 5. Performance

- [ ] Page load times < 2s
- [ ] API response times < 500ms
- [ ] No console errors
- [ ] Images optimized

---

## Monitoring Setup

### Vercel Analytics

1. Enable Vercel Analytics in dashboard
2. Monitor:
   - Page views
   - API response times
   - Error rates

### Supabase Monitoring

1. Go to Supabase Dashboard → Logs
2. Monitor:
   - Database queries
   - API requests
   - Error logs

### Error Tracking (Optional)

1. Set up Sentry:
   ```bash
   npm install @sentry/nextjs
   ```

2. Configure in `sentry.client.config.ts` and `sentry.server.config.ts`

---

## Rollback Plan

If deployment fails:

1. **Vercel**: Use "Redeploy" → Select previous deployment
2. **cPanel**: Restore from backup or redeploy previous build
3. **Database**: Migrations are reversible - check Supabase migration history

---

## Troubleshooting

### Build Fails

- Check Node.js version (requires 18+)
- Verify all dependencies installed
- Check for TypeScript errors

### API Endpoints Return 500

- Check Supabase connection
- Verify environment variables
- Check Supabase logs

### Authentication Not Working

- Verify Supabase URL and keys
- Check CORS settings in Supabase
- Verify redirect URLs configured

### RLS Policies Blocking Access

- Review RLS policies in Supabase
- Test with service role key (admin operations)
- Check user roles in profiles table

---

## Support Contacts

- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Project Documentation**: See `README.md`

---

**Last Updated**: [Current Date]
**Deployment Status**: Ready for Production

