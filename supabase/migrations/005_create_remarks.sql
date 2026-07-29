-- ============================================================================
-- 005: Create Remarks Table
-- ============================================================================

CREATE TABLE public.remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_record_id UUID NOT NULL REFERENCES public.supplier_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_remarks_supplier_record_id ON public.remarks(supplier_record_id);
CREATE INDEX idx_remarks_user_id ON public.remarks(user_id);
