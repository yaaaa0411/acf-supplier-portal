-- ============================================================================
-- 003: Create Geography Tables (Districts → Blocks → Villages)
-- ============================================================================

-- Districts (top level)
CREATE TABLE public.districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  state VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Blocks (belong to a district)
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, district_id)
);

-- Villages (belong to a block)
CREATE TABLE public.villages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  block_id UUID NOT NULL REFERENCES public.blocks(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, block_id)
);

-- Indexes
CREATE INDEX idx_blocks_district_id ON public.blocks(district_id);
CREATE INDEX idx_villages_block_id ON public.villages(block_id);

-- Add FK from user_profiles.district_id → districts.id (deferred from migration 002)
ALTER TABLE public.user_profiles
  ADD CONSTRAINT fk_user_profiles_district
  FOREIGN KEY (district_id) REFERENCES public.districts(id);

-- Triggers for updated_at
CREATE TRIGGER set_districts_updated_at
  BEFORE UPDATE ON public.districts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_blocks_updated_at
  BEFORE UPDATE ON public.blocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_villages_updated_at
  BEFORE UPDATE ON public.villages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
