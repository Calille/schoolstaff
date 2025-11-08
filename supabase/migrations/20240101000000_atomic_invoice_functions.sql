-- Atomic invoice creation: create invoice & insert lines
CREATE OR REPLACE FUNCTION public.create_invoice_from_timesheets(
  p_school_id uuid,
  p_timesheet_ids uuid[],
  p_issued_by uuid -- profile id of the user requesting invoice
) RETURNS TABLE(invoice_id uuid) 
LANGUAGE plpgsql 
AS $$
DECLARE
  v_invoice_id uuid := gen_random_uuid();
  v_amount numeric := 0;
  r record;
BEGIN
  -- Create invoice
  INSERT INTO public.school_invoices (id, school_id, status, created_at)
    VALUES (v_invoice_id, p_school_id, 'draft', now());

  -- Loop timesheets, insert lines if not already invoiced
  FOR r IN
    SELECT t.* FROM public.timesheets t
    WHERE t.id = ANY(p_timesheet_ids)
      AND t.status = 'approved_by_school'
      AND NOT EXISTS (
        SELECT 1 FROM public.invoice_lines il 
        WHERE il.timesheet_id = t.id
      )
  LOOP
    INSERT INTO public.invoice_lines (
      invoice_id, 
      timesheet_id, 
      description, 
      quantity, 
      unit_price
    )
    VALUES (
      v_invoice_id, 
      r.id, 
      CONCAT('Timesheet ', r.id, ' - ', r.date::text), 
      COALESCE(r.total_hours, 0), 
      COALESCE(r.hourly_rate, 0)
    );

    v_amount := v_amount + COALESCE(r.amount, 0);
  END LOOP;

  -- Update invoice total
  UPDATE public.school_invoices 
  SET amount = v_amount 
  WHERE id = v_invoice_id;

  RETURN QUERY SELECT v_invoice_id;
END;
$$;

-- Lock and create invoice atomically (prevents race conditions)
CREATE OR REPLACE FUNCTION public.lock_and_create_invoice(
  p_school_id uuid, 
  p_timesheet_ids uuid[], 
  p_issued_by uuid
) RETURNS TABLE(invoice_id uuid) 
LANGUAGE plpgsql 
AS $$
DECLARE
  lock_key bigint;
BEGIN
  -- Derive a lock key from school id (convert uuid to bigint hash)
  lock_key := ('x' || substring(md5(p_school_id::text) from 1 for 16))::bit(64)::bigint;

  PERFORM pg_advisory_lock(lock_key);
  
  BEGIN
    RETURN QUERY SELECT * FROM public.create_invoice_from_timesheets(
      p_school_id, 
      p_timesheet_ids, 
      p_issued_by
    );
  EXCEPTION
    WHEN OTHERS THEN
      PERFORM pg_advisory_unlock(lock_key);
      RAISE;
  END;
  
  PERFORM pg_advisory_unlock(lock_key);
END;
$$;

-- Add last_error column to school_invoices for recovery tracking
ALTER TABLE public.school_invoices 
ADD COLUMN IF NOT EXISTS last_error text;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoice_lines_timesheet_id 
ON public.invoice_lines(timesheet_id);

CREATE INDEX IF NOT EXISTS idx_timesheets_status_date 
ON public.timesheets(status, date) 
WHERE status = 'approved_by_school';

