# Production-Ready PL/pgSQL Functions

## Overview

This document describes the production-ready PostgreSQL PL/pgSQL functions for the School Staff platform. These functions handle atomic invoice creation and safe payroll export operations.

## Functions

### 1. `create_invoice_from_timesheets`

**Purpose**: Atomically create an invoice and invoice lines from approved timesheets.

**Parameters**:
- `p_school_id` (uuid) - The school issuing the invoice
- `p_timesheet_ids` (uuid[]) - Array of timesheet IDs to include
- `p_issued_by` (uuid) - Profile ID of staff/admin creating the invoice

**Returns**: `TABLE(invoice_id uuid)`

**Behavior**:
- Creates a draft invoice in `school_invoices`
- Inserts invoice lines only for approved timesheets not already invoiced
- Calculates and updates invoice total
- Skips already-invoiced timesheets (idempotent)
- Fully atomic operation

**Usage**:
```sql
SELECT * FROM create_invoice_from_timesheets(
  'school-uuid-here'::uuid,
  ARRAY['timesheet-1'::uuid, 'timesheet-2'::uuid],
  'user-uuid-here'::uuid
);
```

### 2. `lock_and_create_invoice`

**Purpose**: Create invoice with advisory lock to prevent race conditions.

**Parameters**: Same as `create_invoice_from_timesheets`

**Returns**: `TABLE(invoice_id uuid)`

**Behavior**:
- Generates lock key from school_id
- Acquires advisory lock
- Calls `create_invoice_from_timesheets`
- Releases lock after completion
- Prevents concurrent invoice creation for same school

**Usage**:
```sql
SELECT * FROM lock_and_create_invoice(
  'school-uuid-here'::uuid,
  ARRAY['timesheet-1'::uuid, 'timesheet-2'::uuid],
  'user-uuid-here'::uuid
);
```

**Concurrency Safety**:
- Uses PostgreSQL advisory locks
- Different schools can process in parallel
- Same school operations are serialized
- Lock automatically released on error

### 3. `select_and_mark_payroll`

**Purpose**: Atomically select and mark timesheets for payroll export.

**Parameters**:
- `p_date_from` (date) - Start date for payroll period
- `p_date_to` (date) - End date for payroll period

**Returns**: `TABLE` with columns:
- `id` (uuid) - Timesheet ID
- `staff_id` (uuid) - Staff member ID
- `staff_full_name` (text) - Staff full name
- `staff_email` (text) - Staff email
- `bank_name` (text) - Bank name (if available)
- `bank_account` (text) - Bank account (if available)
- `total_hours` (numeric) - Total hours worked
- `amount` (numeric) - Gross amount earned
- `date` (date) - Timesheet date

**Behavior**:
- Selects approved timesheets in date range
- Joins with staff_profiles and profiles for staff details
- Uses `FOR UPDATE SKIP LOCKED` for concurrency safety
- Marks timesheets as `processed_for_payroll`
- Returns data ready for CSV export

**Usage**:
```sql
SELECT * FROM select_and_mark_payroll(
  '2024-01-01'::date,
  '2024-01-31'::date
);
```

**Concurrency Safety**:
- `FOR UPDATE SKIP LOCKED` prevents duplicate processing
- Multiple exports can run simultaneously
- Each timesheet processed exactly once
- Non-blocking (skips locked rows)

## Installation

1. **Apply Migration**:
   ```bash
   # In Supabase SQL Editor, run:
   supabase/migrations/20240101000002_production_plpgsql_functions.sql
   ```

2. **Verify Functions**:
   ```sql
   -- Check functions exist
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
     AND routine_name IN (
       'create_invoice_from_timesheets',
       'lock_and_create_invoice',
       'select_and_mark_payroll'
     );
   ```

3. **Test Functions**:
   ```sql
   -- Test invoice creation (with test data)
   SELECT * FROM lock_and_create_invoice(
     'test-school-id'::uuid,
     ARRAY['test-timesheet-id'::uuid],
     'test-user-id'::uuid
   );

   -- Test payroll export
   SELECT * FROM select_and_mark_payroll(
     CURRENT_DATE - INTERVAL '30 days',
     CURRENT_DATE
   );
   ```

## Integration with Application

### Invoice Generation

```typescript
// app/api/invoices/generate/route.ts
const { data: invoiceResult, error } = await supabaseAdmin.rpc(
  'lock_and_create_invoice',
  {
    p_school_id: targetSchoolId,
    p_timesheet_ids: toInvoiceIds,
    p_issued_by: user.id,
  }
);

const invoiceId = invoiceResult?.[0]?.invoice_id;
```

### Payroll Export

```typescript
// app/api/payroll/export/route.ts
const { data: timesheets, error } = await supabaseAdmin.rpc(
  'select_and_mark_payroll',
  {
    p_date_from: date_from,
    p_date_to: date_to,
  }
);

// Process timesheets for CSV export
timesheets.forEach((t) => {
  // t.staff_full_name, t.staff_email, etc. are ready to use
});
```

## Performance Considerations

### Indexes

The migration includes indexes for optimal performance:
- `idx_invoice_lines_timesheet_id` - Fast idempotency checks
- `idx_timesheets_status_date` - Fast payroll date range queries
- `idx_timesheets_school_id` - Fast school invoice queries
- `idx_timesheets_staff_id` - Fast staff payroll queries

### Locking Strategy

- **Advisory Locks**: Used for invoice creation to serialize per-school operations
- **Row-Level Locks**: Used for payroll export with `SKIP LOCKED` for parallel processing
- **Transaction Isolation**: All operations are atomic within transactions

## Error Handling

All functions include:
- Input validation (NULL checks, date range validation)
- Clear error messages
- Automatic lock release on errors
- Transaction rollback on failure

## Security

- Functions check that timesheets belong to the correct school
- RLS policies still apply (functions use service role when needed)
- Input validation prevents SQL injection
- Idempotency checks prevent duplicate operations

## Monitoring

Monitor these metrics:
- Function execution time
- Lock wait times
- Number of skipped timesheets (already invoiced)
- Payroll export success rates

## Troubleshooting

### Function Not Found
```sql
-- Check if function exists
SELECT * FROM pg_proc WHERE proname = 'lock_and_create_invoice';
```

### Lock Timeout
- Check for long-running transactions
- Monitor `pg_locks` table
- Consider increasing `lock_timeout` if needed

### Performance Issues
- Verify indexes exist: `\d+ timesheets`
- Check query plans: `EXPLAIN ANALYZE`
- Monitor table statistics: `ANALYZE timesheets`

## Best Practices

1. **Always use `lock_and_create_invoice`** for invoice creation (not `create_invoice_from_timesheets` directly)
2. **Handle skipped timesheets** - Check response for already-invoiced timesheets
3. **Monitor lock contention** - Use advisory lock monitoring queries
4. **Test with concurrent requests** - Verify functions work under load
5. **Backup before migration** - Always backup database before applying functions

## Support

For issues or questions:
1. Check function logs in Supabase dashboard
2. Review error messages (functions include detailed errors)
3. Verify table schemas match function expectations
4. Test with sample data first

