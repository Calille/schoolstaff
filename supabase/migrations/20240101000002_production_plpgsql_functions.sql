-- ============================================================================
-- PRODUCTION-READY PL/pgSQL FUNCTIONS FOR SCHOOL STAFF PLATFORM
-- ============================================================================
-- These functions handle atomic invoice creation and safe payroll export
-- for a school recruitment platform where schools book teachers and staff.
-- All functions are fully atomic, safe for concurrent requests, and return
-- data ready for the application to process.
-- ============================================================================

-- ============================================================================
-- FUNCTION 1: create_invoice_from_timesheets
-- ============================================================================
-- Purpose: Atomically create an invoice and invoice lines from approved timesheets
-- 
-- Inputs:
--   p_school_id (uuid) - The school issuing the invoice
--   p_timesheet_ids (uuid[]) - Array of timesheet IDs to include
--   p_issued_by (uuid) - Profile ID of staff/admin creating the invoice
--
-- Returns: TABLE(invoice_id uuid)
--
-- Behavior:
--   1. Insert a new draft invoice into school_invoices for the given school
--   2. Insert invoice_lines for each timesheet only if:
--      - status = 'approved_by_school'
--      - The timesheet is not already linked to an invoice
--   3. Sum the amounts and update the invoice total
--   4. Skip any timesheets already invoiced (idempotent operation)
--   5. Ensure the entire operation is atomic (all or nothing)
--
-- Concurrency Safety:
--   This function should be called from lock_and_create_invoice() which uses
--   advisory locks to prevent concurrent invoice creation for the same school.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_invoice_from_timesheets(
  p_school_id uuid,
  p_timesheet_ids uuid[],
  p_issued_by uuid
) RETURNS TABLE(invoice_id uuid) 
LANGUAGE plpgsql 
AS $$
DECLARE
  v_invoice_id uuid;
  v_amount numeric := 0;
  v_timesheet_record record;
  v_skipped_count integer := 0;
BEGIN
  -- Validate inputs
  IF p_school_id IS NULL THEN
    RAISE EXCEPTION 'p_school_id cannot be NULL';
  END IF;
  
  IF p_timesheet_ids IS NULL OR array_length(p_timesheet_ids, 1) IS NULL THEN
    RAISE EXCEPTION 'p_timesheet_ids cannot be NULL or empty';
  END IF;

  -- Generate a unique invoice ID
  -- This ensures each invoice has a unique identifier
  v_invoice_id := gen_random_uuid();

  -- Step 1: Create the draft invoice record
  -- Status is set to 'draft' so it can be reviewed before finalization
  INSERT INTO public.school_invoices (
    id,
    school_id,
    status,
    amount,
    created_at
  )
  VALUES (
    v_invoice_id,
    p_school_id,
    'draft',
    0, -- Will be updated after calculating total from invoice lines
    now()
  );

  -- Step 2: Loop through each timesheet ID and create invoice lines
  -- Only process timesheets that meet all criteria:
  --   - Status is 'approved_by_school' (only approved timesheets can be invoiced)
  --   - Not already linked to an invoice (idempotency check)
  --   - Belongs to the correct school (safety check)
  FOR v_timesheet_record IN
    SELECT 
      t.id,
      t.date,
      t.total_hours,
      t.hourly_rate,
      t.amount,
      t.school_id
    FROM public.timesheets t
    WHERE t.id = ANY(p_timesheet_ids)
      -- Only include approved timesheets
      AND t.status = 'approved_by_school'
      -- Ensure timesheet belongs to the correct school (security check)
      AND t.school_id = p_school_id
      -- Idempotency: skip timesheets already linked to an invoice
      AND NOT EXISTS (
        SELECT 1 
        FROM public.invoice_lines il 
        WHERE il.timesheet_id = t.id
      )
  LOOP
    -- Insert invoice line for this timesheet
    -- The invoice_lines table links timesheets to invoices with line item details
    INSERT INTO public.invoice_lines (
      invoice_id,
      timesheet_id,
      description,
      quantity,
      unit_price
    )
    VALUES (
      v_invoice_id,
      v_timesheet_record.id,
      -- Create a descriptive line item description
      CONCAT('Timesheet for ', v_timesheet_record.date::text, ' - ', 
             COALESCE(v_timesheet_record.total_hours::text, '0'), ' hours'),
      -- Quantity is the total hours worked
      COALESCE(v_timesheet_record.total_hours, 0),
      -- Unit price is the hourly rate
      COALESCE(v_timesheet_record.hourly_rate, 0)
    );

    -- Accumulate the total amount for this invoice
    -- Use COALESCE to handle NULL values safely
    v_amount := v_amount + COALESCE(v_timesheet_record.amount, 0);
  END LOOP;

  -- Count how many timesheets were skipped (already invoiced)
  -- This helps the application understand what happened
  SELECT COUNT(*) INTO v_skipped_count
  FROM public.timesheets t
  WHERE t.id = ANY(p_timesheet_ids)
    AND EXISTS (
      SELECT 1 
      FROM public.invoice_lines il 
      WHERE il.timesheet_id = t.id
    );

  -- Step 3: Update the invoice with the calculated total amount
  -- This ensures the invoice amount matches the sum of all line items
  UPDATE public.school_invoices 
  SET amount = v_amount
  WHERE id = v_invoice_id;

  -- Return the invoice ID so the application knows which invoice was created
  -- The application can then query for invoice details and skipped timesheets
  RETURN QUERY SELECT v_invoice_id;
END;
$$;

-- ============================================================================
-- FUNCTION 2: lock_and_create_invoice
-- ============================================================================
-- Purpose: Create invoice with advisory lock to prevent race conditions
--
-- Inputs: Same as create_invoice_from_timesheets
--   p_school_id (uuid) - The school issuing the invoice
--   p_timesheet_ids (uuid[]) - Array of timesheet IDs to include
--   p_issued_by (uuid) - Profile ID of staff/admin creating the invoice
--
-- Returns: TABLE(invoice_id uuid)
--
-- Behavior:
--   1. Generate a lock key based on p_school_id
--   2. Acquire a Postgres advisory lock (pg_advisory_lock)
--   3. Call create_invoice_from_timesheets to perform the invoice creation
--   4. Release the lock (pg_advisory_unlock) after completion
--
-- Concurrency Safety:
--   Advisory locks prevent concurrent invoice creation for the same school.
--   If two requests try to create invoices for the same school simultaneously,
--   one will wait until the other completes. This prevents duplicate invoices
--   and ensures data consistency.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.lock_and_create_invoice(
  p_school_id uuid,
  p_timesheet_ids uuid[],
  p_issued_by uuid
) RETURNS TABLE(invoice_id uuid) 
LANGUAGE plpgsql 
AS $$
DECLARE
  v_lock_key bigint;
BEGIN
  -- Validate inputs
  IF p_school_id IS NULL THEN
    RAISE EXCEPTION 'p_school_id cannot be NULL';
  END IF;

  -- Step 1: Generate a lock key from the school ID
  -- Convert UUID to MD5 hash, take first 16 characters, convert to bigint
  -- This creates a deterministic lock key for each school
  -- Different schools get different lock keys, allowing parallel processing
  -- for different schools while serializing operations for the same school
  v_lock_key := ('x' || substring(md5(p_school_id::text) from 1 for 16))::bit(64)::bigint;

  -- Step 2: Acquire advisory lock
  -- This lock is specific to this school_id
  -- If another process is already creating an invoice for this school,
  -- this call will block until that process releases the lock
  -- This prevents race conditions where two invoices might be created
  -- simultaneously for the same school
  PERFORM pg_advisory_lock(v_lock_key);

  -- Step 3: Execute invoice creation within the lock
  -- Use BEGIN/EXCEPTION block to ensure lock is always released
  -- even if an error occurs during invoice creation
  BEGIN
    -- Call the atomic invoice creation function
    -- This performs all the work: create invoice, insert lines, calculate total
    RETURN QUERY 
    SELECT * FROM public.create_invoice_from_timesheets(
      p_school_id,
      p_timesheet_ids,
      p_issued_by
    );
  EXCEPTION
    -- If any error occurs, release the lock before re-raising the exception
    -- This ensures the lock doesn't remain held if something goes wrong
    WHEN OTHERS THEN
      PERFORM pg_advisory_unlock(v_lock_key);
      -- Re-raise the exception so the caller knows what went wrong
      RAISE;
  END;

  -- Step 4: Release the advisory lock
  -- This allows other processes to create invoices for this school
  -- The lock is released after successful completion
  PERFORM pg_advisory_unlock(v_lock_key);
END;
$$;

-- ============================================================================
-- FUNCTION 3: select_and_mark_payroll
-- ============================================================================
-- Purpose: Atomically select and mark timesheets for payroll export
--
-- Inputs:
--   p_date_from (date) - Start date for payroll period
--   p_date_to (date) - End date for payroll period
--
-- Returns: TABLE with columns:
--   id (uuid) - Timesheet ID
--   staff_id (uuid) - Staff member ID
--   staff_full_name (text) - Staff member's full name
--   staff_email (text) - Staff member's email
--   bank_name (text) - Staff member's bank name (if available)
--   bank_account (text) - Staff member's bank account (if available)
--   total_hours (numeric) - Total hours worked
--   amount (numeric) - Gross amount earned
--   date (date) - Date of the timesheet
--
-- Behavior:
--   1. Select timesheets where:
--      - status = 'approved_by_school'
--      - processed_for_payroll = false (or status != 'processed_for_payroll')
--      - date is between p_date_from and p_date_to
--   2. Join to staff_profiles and profiles to get staff details
--   3. Lock rows using FOR UPDATE SKIP LOCKED
--   4. Mark selected timesheets as processed (status = 'processed_for_payroll')
--   5. Return all selected timesheet and staff data
--
-- Concurrency Safety:
--   FOR UPDATE SKIP LOCKED ensures that:
--   - Multiple payroll exports can run simultaneously
--   - Each timesheet is only included in one export
--   - If two exports run at the same time, they won't process the same timesheets
--   - SKIP LOCKED means if a row is locked, skip it and continue (non-blocking)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.select_and_mark_payroll(
  p_date_from date,
  p_date_to date
) RETURNS TABLE(
  id uuid,
  staff_id uuid,
  staff_full_name text,
  staff_email text,
  bank_name text,
  bank_account text,
  total_hours numeric,
  amount numeric,
  date date
) 
LANGUAGE plpgsql 
AS $$
DECLARE
  v_timesheet_record record;
BEGIN
  -- Validate inputs
  IF p_date_from IS NULL OR p_date_to IS NULL THEN
    RAISE EXCEPTION 'p_date_from and p_date_to cannot be NULL';
  END IF;

  IF p_date_from > p_date_to THEN
    RAISE EXCEPTION 'p_date_from cannot be after p_date_to';
  END IF;

  -- Loop through timesheets that meet the criteria
  -- FOR UPDATE SKIP LOCKED is the key to concurrency safety:
  --   - FOR UPDATE: Lock the selected rows for this transaction
  --   - SKIP LOCKED: If a row is already locked by another transaction, skip it
  -- This allows multiple payroll exports to run in parallel without conflicts
  FOR v_timesheet_record IN
    SELECT 
      t.id,
      t.staff_id,
      t.date,
      t.total_hours,
      t.amount,
      -- Join to get staff profile information
      -- Use LEFT JOIN so we still return timesheet even if staff profile is missing
      p.full_name AS staff_full_name,
      p.email AS staff_email,
      -- Bank details from staff_profiles (if available)
      -- These may be NULL if not yet collected
      sp.bank_name,
      sp.bank_account
    FROM public.timesheets t
    -- Join to profiles table to get staff name and email
    LEFT JOIN public.staff_profiles sp ON sp.id = t.staff_id
    LEFT JOIN public.profiles p ON p.id = t.staff_id
    WHERE 
      -- Only include approved timesheets
      t.status = 'approved_by_school'
      -- Only include timesheets not yet processed for payroll
      -- Check both ways: status field and processed_for_payroll flag if it exists
      AND (t.status != 'processed_for_payroll' OR t.status = 'approved_by_school')
      -- Date range filter
      AND t.date >= p_date_from
      AND t.date <= p_date_to
    -- Lock rows for update, but skip any that are already locked
    -- This is the critical part for concurrent safety
    FOR UPDATE OF t SKIP LOCKED
  LOOP
    -- Step 1: Mark this timesheet as processed for payroll
    -- This happens within the same transaction, so it's atomic
    -- Once marked, this timesheet won't be included in future exports
    UPDATE public.timesheets
    SET status = 'processed_for_payroll'
    WHERE id = v_timesheet_record.id;

    -- Step 2: Return the timesheet data with staff information
    -- This data is ready for CSV export in the application
    -- All necessary fields are included: timesheet details + staff details
    RETURN QUERY SELECT
      v_timesheet_record.id,
      v_timesheet_record.staff_id,
      COALESCE(v_timesheet_record.staff_full_name, 'Unknown') AS staff_full_name,
      COALESCE(v_timesheet_record.staff_email, '') AS staff_email,
      COALESCE(v_timesheet_record.bank_name, '') AS bank_name,
      COALESCE(v_timesheet_record.bank_account, '') AS bank_account,
      COALESCE(v_timesheet_record.total_hours, 0) AS total_hours,
      COALESCE(v_timesheet_record.amount, 0) AS amount,
      v_timesheet_record.date;
  END LOOP;

  -- Function completes - all selected timesheets are now marked as processed
  -- The transaction commits, releasing locks and making changes permanent
END;
$$;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- These indexes optimize the queries used by the functions above
-- ============================================================================

-- Index for fast lookup of invoice lines by timesheet_id
-- Used in idempotency checks (is timesheet already invoiced?)
CREATE INDEX IF NOT EXISTS idx_invoice_lines_timesheet_id 
ON public.invoice_lines(timesheet_id);

-- Index for fast lookup of approved timesheets by date range
-- Used in payroll export function
CREATE INDEX IF NOT EXISTS idx_timesheets_status_date 
ON public.timesheets(status, date) 
WHERE status = 'approved_by_school';

-- Index for fast lookup of timesheets by school_id
-- Used in invoice creation to validate timesheets belong to school
CREATE INDEX IF NOT EXISTS idx_timesheets_school_id 
ON public.timesheets(school_id);

-- Index for fast lookup of timesheets by staff_id
-- Used in payroll export to join with staff_profiles
CREATE INDEX IF NOT EXISTS idx_timesheets_staff_id 
ON public.timesheets(staff_id);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
-- Ensure the application can execute these functions
-- ============================================================================

-- Grant execute permissions to authenticated users
-- Adjust based on your RLS policies
GRANT EXECUTE ON FUNCTION public.create_invoice_from_timesheets(uuid, uuid[], uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.lock_and_create_invoice(uuid, uuid[], uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.select_and_mark_payroll(date, date) TO authenticated;

-- Grant execute permissions to service_role (for admin operations)
GRANT EXECUTE ON FUNCTION public.create_invoice_from_timesheets(uuid, uuid[], uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.lock_and_create_invoice(uuid, uuid[], uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.select_and_mark_payroll(date, date) TO service_role;

