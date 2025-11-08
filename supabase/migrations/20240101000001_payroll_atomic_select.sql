-- Atomic select and mark timesheets for payroll export
-- Uses FOR UPDATE SKIP LOCKED to prevent race conditions
CREATE OR REPLACE FUNCTION public.select_and_mark_timesheets_for_payroll(
  p_date_from date,
  p_date_to date
) RETURNS TABLE(
  id uuid,
  staff_id uuid,
  date date,
  total_hours numeric,
  amount numeric
) 
LANGUAGE plpgsql 
AS $$
DECLARE
  r record;
BEGIN
  -- Use FOR UPDATE SKIP LOCKED to atomically select and lock rows
  -- This prevents concurrent exports from including the same timesheets
  FOR r IN
    SELECT t.id, t.staff_id, t.date, t.total_hours, t.amount
    FROM public.timesheets t
    WHERE t.status = 'approved_by_school'
      AND t.date >= p_date_from
      AND t.date <= p_date_to
      AND NOT EXISTS (
        SELECT 1 FROM public.timesheets t2
        WHERE t2.id = t.id AND t2.status = 'processed_for_payroll'
      )
    FOR UPDATE SKIP LOCKED
  LOOP
    -- Mark as processed
    UPDATE public.timesheets
    SET status = 'processed_for_payroll'
    WHERE id = r.id;

    -- Return the row
    RETURN QUERY SELECT r.id, r.staff_id, r.date, r.total_hours, r.amount;
  END LOOP;
END;
$$;

