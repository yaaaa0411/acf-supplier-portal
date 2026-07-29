-- ============================================================================
-- 002: Create User Profiles Table
-- ============================================================================

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone VARCHAR(20),
  role_id UUID NOT NULL REFERENCES public.roles(id),
  district_id UUID,  -- FK added after districts table is created (migration 003)
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_user_profiles_role_id ON public.user_profiles(role_id);
CREATE INDEX idx_user_profiles_district_id ON public.user_profiles(district_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Automatic profile creation on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  default_role_id UUID;
BEGIN
  -- Assign admin to yaaaa0411@gmail.com, supplier to everyone else by default
  IF NEW.email = 'yaaaa0411@gmail.com' THEN
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'admin';
  ELSE
    SELECT id INTO default_role_id FROM public.roles WHERE name = 'supplier';
  END IF;

  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role_id, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    default_role_id,
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

