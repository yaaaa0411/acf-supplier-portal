-- ============================================================================
-- 006: Create Notifications Table
-- ============================================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'info'
    CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  reference_type VARCHAR(50),   -- e.g., 'supplier_record', 'remark'
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read)
  WHERE is_read = false;
