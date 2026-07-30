-- ============================================================================
-- 009: Add supplier cost/area fields, receipt number, and work order sequences
-- ============================================================================

-- New columns on supplier_records
ALTER TABLE public.supplier_records
  ADD COLUMN IF NOT EXISTS area_ha NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS type_of_mis VARCHAR(255),
  ADD COLUMN IF NOT EXISTS crop VARCHAR(255),
  ADD COLUMN IF NOT EXISTS farmer_mobile_no VARCHAR(10),
  ADD COLUMN IF NOT EXISTS total_mis_cost_ggrc NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS farmers_contribution NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS acf_contribution NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS company_share NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS government_contribution NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS total_cost NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS receipt_number VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_supplier_records_receipt_number
  ON public.supplier_records(receipt_number);

-- Sequence tracking for auto-generated work order numbers (FY + prefix)
CREATE TABLE IF NOT EXISTS public.work_order_sequences (
  financial_year VARCHAR(4) NOT NULL,
  prefix VARCHAR(10) NOT NULL,
  last_sequence INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (financial_year, prefix)
);

ALTER TABLE public.work_order_sequences ENABLE ROW LEVEL SECURITY;

-- Helper: derive Indian financial year code (e.g. 2526 for FY 2025-2026)
CREATE OR REPLACE FUNCTION public.get_financial_year_code(p_date DATE DEFAULT CURRENT_DATE)
RETURNS TEXT AS $$
DECLARE
  v_month INTEGER;
  v_year INTEGER;
  v_start_year INTEGER;
BEGIN
  v_month := EXTRACT(MONTH FROM p_date);
  v_year := EXTRACT(YEAR FROM p_date);

  IF v_month >= 4 THEN
    v_start_year := v_year;
  ELSE
    v_start_year := v_year - 1;
  END IF;

  RETURN LPAD((v_start_year % 100)::TEXT, 2, '0')
       || LPAD(((v_start_year + 1) % 100)::TEXT, 2, '0');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Generate work order number: {FY}-{PREFIX}-{SEQ4}
CREATE OR REPLACE FUNCTION public.generate_work_order_number(p_prefix TEXT)
RETURNS TEXT AS $$
DECLARE
  v_fy TEXT;
  v_seq INTEGER;
BEGIN
  IF p_prefix NOT IN ('GS', 'AML', 'CTU', 'JND') THEN
    RAISE EXCEPTION 'Invalid work order prefix: %', p_prefix;
  END IF;

  v_fy := public.get_financial_year_code(CURRENT_DATE);

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

GRANT EXECUTE ON FUNCTION public.generate_work_order_number(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_financial_year_code(DATE) TO authenticated;
