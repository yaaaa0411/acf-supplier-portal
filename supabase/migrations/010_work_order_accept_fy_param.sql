-- ============================================================================
-- 010: Update generate_work_order_number to accept an optional financial year
-- ============================================================================

-- Drop old single-parameter version
DROP FUNCTION IF EXISTS public.generate_work_order_number(TEXT);

-- New version: accepts prefix + optional financial year code
-- If p_fy is NULL or empty, falls back to current-date-derived FY.
CREATE OR REPLACE FUNCTION public.generate_work_order_number(
  p_prefix TEXT,
  p_fy TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  v_fy TEXT;
  v_seq INTEGER;
BEGIN
  IF p_prefix NOT IN ('GS', 'AMR', 'CTU', 'JND','AMD') THEN
    RAISE EXCEPTION 'Invalid work order prefix: %', p_prefix;
  END IF;

  -- Use supplied FY or fall back to current date
  IF p_fy IS NOT NULL AND length(trim(p_fy)) = 4 THEN
    v_fy := trim(p_fy);
  ELSE
    v_fy := public.get_financial_year_code(CURRENT_DATE);
  END IF;

  INSERT INTO public.work_order_sequences (financial_year, prefix, last_sequence)
  VALUES (v_fy, p_prefix, 0)
  ON CONFLICT (financial_year, prefix) DO NOTHING;

  UPDATE public.work_order_sequences
  SET last_sequence = last_sequence + 1
  WHERE financial_year = v_fy AND prefix = p_prefix
  RETURNING last_sequence INTO v_seq;

  RETURN v_fy || '-' || p_prefix || '-' || LPAD(v_seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.generate_work_order_number(TEXT, TEXT) TO authenticated;
