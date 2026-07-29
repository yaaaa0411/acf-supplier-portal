-- ============================================================================
-- 004: Create Supplier Records Table
-- ============================================================================

CREATE TABLE public.supplier_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Supplier who submitted
  supplier_id UUID NOT NULL REFERENCES public.user_profiles(id),

  -- Work Order Number (Prefix + numeric suffix stored combined, e.g. GS12345)
  work_order_number VARCHAR(100) NOT NULL UNIQUE,

  -- Geography (cascading)
  district_id UUID NOT NULL REFERENCES public.districts(id),
  block_id UUID NOT NULL REFERENCES public.blocks(id),
  village_id UUID NOT NULL REFERENCES public.villages(id),

  -- Record details
  year VARCHAR(10) NOT NULL,
  mis_supplier_name VARCHAR(255) NOT NULL,
  date_of_application DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'approved', 'rejected')),

  -- Approval tracking
  approved_by UUID REFERENCES public.user_profiles(id),
  approved_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_supplier_records_supplier_id ON public.supplier_records(supplier_id);
CREATE INDEX idx_supplier_records_district_id ON public.supplier_records(district_id);
CREATE INDEX idx_supplier_records_block_id ON public.supplier_records(block_id);
CREATE INDEX idx_supplier_records_status ON public.supplier_records(status);
CREATE INDEX idx_supplier_records_year ON public.supplier_records(year);

-- Trigger for updated_at
CREATE TRIGGER set_supplier_records_updated_at
  BEFORE UPDATE ON public.supplier_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
