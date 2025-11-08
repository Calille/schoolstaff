# Phase 9: Timesheets, Invoicing & Payroll - Backend Implementation

## Overview

This phase implements secure, production-ready server logic for timesheet submission, review, invoice generation, and payroll export.

## Architecture

### Server-Only Helpers

- **`lib/supabaseAdmin.ts`**: Service role client for privileged operations
- **`lib/notifyServer.ts`**: Server-side notification helper
- **`lib/computeHours.ts`**: Server-side hours/amount calculation

### API Endpoints

All endpoints use server-side validation and RLS:

1. **`POST /api/timesheets/submit`** - Staff submits timesheet
2. **`POST /api/timesheets/review`** - School approves/rejects timesheet
3. **`POST /api/invoices/generate`** - Generate/finalize invoices
4. **`POST /api/payroll/export`** - Export payroll CSV

## Security

- All endpoints validate session using Supabase auth
- Service role key (`SUPABASE_SERVICE_ROLE_KEY`) used only server-side
- RLS policies enforce data access control
- Input validation on all endpoints
- Idempotency checks prevent duplicate operations

## Database Transactions

For multi-step operations (e.g., invoice creation), the code uses sequential operations with validation checks. For true atomic transactions, consider creating PostgreSQL functions:

```sql
-- Example: Atomic invoice creation function
CREATE OR REPLACE FUNCTION create_invoice_from_timesheets(
  p_school_id uuid,
  p_timesheet_ids uuid[]
) RETURNS uuid AS $$
DECLARE
  v_invoice_id uuid;
BEGIN
  -- Create invoice
  INSERT INTO school_invoices (school_id, status, amount)
  VALUES (p_school_id, 'draft', 0)
  RETURNING id INTO v_invoice_id;
  
  -- Insert invoice lines
  INSERT INTO invoice_lines (invoice_id, timesheet_id, quantity, unit_price, description)
  SELECT 
    v_invoice_id,
    t.id,
    t.total_hours,
    t.hourly_rate,
    'Timesheet for ' || t.date
  FROM timesheets t
  WHERE t.id = ANY(p_timesheet_ids)
    AND t.status = 'approved_by_school'
    AND NOT EXISTS (
      SELECT 1 FROM invoice_lines il WHERE il.timesheet_id = t.id
    );
  
  -- Update invoice amount
  UPDATE school_invoices
  SET amount = (
    SELECT COALESCE(SUM(line_total), 0)
    FROM invoice_lines
    WHERE invoice_id = v_invoice_id
  )
  WHERE id = v_invoice_id;
  
  RETURN v_invoice_id;
END;
$$ LANGUAGE plpgsql;
```

## Testing

### Running Integration Tests

```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="your-project-url"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run test script
npx tsx tests/scripts/timesheet-flow.test.ts
```

### Manual Testing with cURL

#### 1. Submit Timesheet (as staff)

```bash
# First, get auth token (login via Supabase Auth)
TOKEN="your-auth-token"

curl -X POST http://localhost:3000/api/timesheets/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "date": "2024-01-15",
    "start_time": "09:00",
    "end_time": "17:00",
    "break_minutes": 60,
    "hourly_rate": 25.0,
    "school_id": "school-uuid-here"
  }'
```

#### 2. Approve Timesheet (as school)

```bash
curl -X POST http://localhost:3000/api/timesheets/review \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SCHOOL_TOKEN" \
  -d '{
    "timesheet_id": "timesheet-uuid-here",
    "action": "approve",
    "comment": "Approved"
  }'
```

#### 3. Generate Invoice (as admin)

```bash
curl -X POST http://localhost:3000/api/invoices/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "timesheet_ids": ["timesheet-uuid-1", "timesheet-uuid-2"],
    "finalize": true
  }'
```

#### 4. Export Payroll (as admin)

```bash
curl -X POST http://localhost:3000/api/payroll/export \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "date_from": "2024-01-01",
    "date_to": "2024-01-31"
  }' \
  --output payroll.csv
```

## Environment Variables

Required for production:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=your-stripe-secret-key (optional)
```

## Error Codes

All endpoints return structured error responses:

- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `VALIDATION_ERROR` (400): Invalid input data
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists/processed
- `DATABASE_ERROR` (500): Database operation failed
- `INTERNAL_ERROR` (500): Unexpected server error

## Idempotency

- Invoice creation checks for existing `invoice_lines` before inserting
- Stripe invoice creation uses idempotency keys
- Payroll export marks timesheets as processed to prevent duplicates

## TODO / Future Enhancements

- [ ] Add tax/VAT calculation to invoices
- [ ] Implement bank details storage for staff
- [ ] Add invoice PDF generation
- [ ] Implement email notifications (currently in-app only)
- [ ] Add invoice payment tracking
- [ ] Create PostgreSQL transaction functions for atomic operations
- [ ] Add rate negotiation/contract management
- [ ] Implement invoice payment reminders

## Notes

- Timesheet calculations are done server-side for security
- All privileged operations use `supabaseAdmin` (service role)
- Notifications are created server-side using `notifyServer` helper
- CSV exports include all required payroll fields
- Stripe integration is optional and gracefully degrades if not configured

