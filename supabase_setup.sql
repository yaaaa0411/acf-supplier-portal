-- ============================================================================
-- AMBUJA CEMENT FOUNDATION - COMPLETE SETUP SCRIPT
-- Copy and run this entire script in the Supabase SQL Editor.
-- ============================================================================

-- ── 1. ROLES AND PERMISSIONS ────────────────────────────────────────────────

CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  module VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON public.role_permissions(permission_id);


-- ── 2. USER PROFILES ─────────────────────────────────────────────────────────

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone VARCHAR(20),
  role_id UUID NOT NULL REFERENCES public.roles(id),
  district_id UUID,  -- FK added after districts is created
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_profiles_role_id ON public.user_profiles(role_id);
CREATE INDEX idx_user_profiles_district_id ON public.user_profiles(district_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

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


-- ── 3. GEOGRAPHY (DISTRICTS -> BLOCKS -> VILLAGES) ──────────────────────────

CREATE TABLE public.districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  state VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE INDEX idx_blocks_district_id ON public.blocks(district_id);
CREATE INDEX idx_villages_block_id ON public.villages(block_id);

-- Attach deferred foreign key for user_profiles.district_id
ALTER TABLE public.user_profiles
  ADD CONSTRAINT fk_user_profiles_district
  FOREIGN KEY (district_id) REFERENCES public.districts(id);

CREATE TRIGGER set_districts_updated_at
  BEFORE UPDATE ON public.districts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_blocks_updated_at
  BEFORE UPDATE ON public.blocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_villages_updated_at
  BEFORE UPDATE ON public.villages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ── 4. SUPPLIER RECORDS ──────────────────────────────────────────────────────

CREATE TABLE public.supplier_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  work_order_number VARCHAR(100) NOT NULL UNIQUE,
  district_id UUID NOT NULL REFERENCES public.districts(id),
  block_id UUID NOT NULL REFERENCES public.blocks(id),
  village_id UUID NOT NULL REFERENCES public.villages(id),
  year VARCHAR(10) NOT NULL,
  mis_supplier_name VARCHAR(255) NOT NULL,
  date_of_application DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'approved', 'rejected')),
  approved_by UUID REFERENCES public.user_profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_supplier_records_supplier_id ON public.supplier_records(supplier_id);
CREATE INDEX idx_supplier_records_district_id ON public.supplier_records(district_id);
CREATE INDEX idx_supplier_records_block_id ON public.supplier_records(block_id);
CREATE INDEX idx_supplier_records_status ON public.supplier_records(status);
CREATE INDEX idx_supplier_records_year ON public.supplier_records(year);

CREATE TRIGGER set_supplier_records_updated_at
  BEFORE UPDATE ON public.supplier_records
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ── 5. REMARKS ───────────────────────────────────────────────────────────────

CREATE TABLE public.remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_record_id UUID NOT NULL REFERENCES public.supplier_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_remarks_supplier_record_id ON public.remarks(supplier_record_id);
CREATE INDEX idx_remarks_user_id ON public.remarks(user_id);


-- ── 6. NOTIFICATIONS ─────────────────────────────────────────────────────────

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) NOT NULL DEFAULT 'info'
    CHECK (type IN ('info', 'warning', 'success', 'error')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  reference_type VARCHAR(50),
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read)
  WHERE is_read = false;


-- ── 7. ROW LEVEL SECURITY (RLS) POLICIES ─────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT r.name
  FROM public.user_profiles up
  JOIN public.roles r ON r.id = up.role_id
  WHERE up.id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_district_id()
RETURNS UUID AS $$
  SELECT district_id
  FROM public.user_profiles
  WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.user_has_permission(perm_name TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_profiles up
    JOIN public.role_permissions rp ON rp.role_id = up.role_id
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE up.id = auth.uid()
      AND p.name = perm_name
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roles_select_authenticated" ON public.roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_insert_admin" ON public.roles FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "roles_update_admin" ON public.roles FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "permissions_select_authenticated" ON public.permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "permissions_insert_admin" ON public.permissions FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "permissions_update_admin" ON public.permissions FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "role_permissions_select_authenticated" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "role_permissions_insert_admin" ON public.role_permissions FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "role_permissions_delete_admin" ON public.role_permissions FOR DELETE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "user_profiles_select" ON public.user_profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.get_user_role() = 'admin' OR (public.get_user_role() = 'subadmin' AND district_id = public.get_user_district_id()));
CREATE POLICY "user_profiles_insert_admin" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "user_profiles_update_admin" ON public.user_profiles FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin');
CREATE POLICY "user_profiles_update_self" ON public.user_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "user_profiles_delete_admin" ON public.user_profiles FOR DELETE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "districts_select_authenticated" ON public.districts FOR SELECT TO authenticated USING (true);
CREATE POLICY "districts_insert_admin" ON public.districts FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "districts_update_admin" ON public.districts FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "blocks_select_authenticated" ON public.blocks FOR SELECT TO authenticated USING (true);
CREATE POLICY "blocks_insert_admin" ON public.blocks FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "blocks_update_admin" ON public.blocks FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "villages_select_authenticated" ON public.villages FOR SELECT TO authenticated USING (true);
CREATE POLICY "villages_insert_admin" ON public.villages FOR INSERT TO authenticated WITH CHECK (public.get_user_role() = 'admin');
CREATE POLICY "villages_update_admin" ON public.villages FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "supplier_records_select" ON public.supplier_records FOR SELECT TO authenticated
  USING (supplier_id = auth.uid() OR public.get_user_role() = 'admin' OR (public.get_user_role() = 'subadmin' AND district_id = public.get_user_district_id()));
CREATE POLICY "supplier_records_insert_supplier" ON public.supplier_records FOR INSERT TO authenticated WITH CHECK (supplier_id = auth.uid() AND public.get_user_role() = 'supplier');
CREATE POLICY "supplier_records_update_admin" ON public.supplier_records FOR UPDATE TO authenticated USING (public.get_user_role() = 'admin');
CREATE POLICY "supplier_records_delete_admin" ON public.supplier_records FOR DELETE TO authenticated USING (public.get_user_role() = 'admin');

CREATE POLICY "remarks_select" ON public.remarks FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.supplier_records sr WHERE sr.id = supplier_record_id AND (sr.supplier_id = auth.uid() OR public.get_user_role() = 'admin' OR (public.get_user_role() = 'subadmin' AND sr.district_id = public.get_user_district_id()))));
CREATE POLICY "remarks_insert" ON public.remarks FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.supplier_records sr WHERE sr.id = supplier_record_id AND (sr.supplier_id = auth.uid() OR public.get_user_role() = 'admin' OR (public.get_user_role() = 'subadmin' AND sr.district_id = public.get_user_district_id()))));

CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());


-- ── 8. SEED DATA ─────────────────────────────────────────────────────────────

INSERT INTO public.roles (name, description) VALUES
  ('admin',    'Full system access. Can manage all users, records, and settings.'),
  ('subadmin', 'Regional administrator. Access limited to assigned regions and granted permissions.'),
  ('supplier', 'Supplier user. Can submit data once, view own records, and add remarks.');

INSERT INTO public.permissions (name, module, description) VALUES
  ('manage_users',           'users',     'Create, edit, and deactivate users'),
  ('manage_subadmins',       'users',     'Create and manage subadmin accounts'),
  ('assign_permissions',     'users',     'Assign/revoke permissions for subadmins'),
  ('manage_geography',       'geography', 'Create, edit, and delete districts, blocks, and villages'),
  ('view_all_regions',       'geography', 'View all geographical regions'),
  ('view_assigned_regions',  'geography', 'View only assigned geographical regions'),
  ('view_records',           'records',   'View supplier records'),
  ('submit_records',         'records',   'Submit new supplier records'),
  ('edit_records',           'records',   'Edit existing supplier records'),
  ('delete_records',         'records',   'Delete supplier records'),
  ('view_documents',         'documents', 'View all uploaded documents'),
  ('add_remarks',            'records',   'Add remarks to supplier records'),
  ('view_reports',           'reports',   'View reports and analytics'),
  ('manage_notifications',   'notifications', 'Send and manage notifications');

-- Assign Permissions to Roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p WHERE r.name = 'admin';

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.name IN (
  'view_assigned_regions', 'view_records', 'add_remarks', 'view_documents', 'view_reports'
) WHERE r.name = 'subadmin';

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r JOIN public.permissions p ON p.name IN (
  'submit_records', 'view_records', 'add_remarks'
) WHERE r.name = 'supplier';


-- ── 9. AUTO-PROFILE CREATION ON GOOGLE SIGNUP TRIGGER ─────────────────────────

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


-- ── 10. GEOGRAPHY SEEDING (SAMPLE DATA) ──────────────────────────────────────

INSERT INTO public.districts (name, code, state) VALUES
  ('Chandrapur', 'CH', 'Maharashtra'),
  ('Amravati', 'AM', 'Maharashtra'),
  ('Roorkee', 'RK', 'Uttarakhand');

-- Blocks for Chandrapur
INSERT INTO public.blocks (name, district_id)
SELECT 'Rajura', id FROM public.districts WHERE name = 'Chandrapur';
INSERT INTO public.blocks (name, district_id)
SELECT 'Korpana', id FROM public.districts WHERE name = 'Chandrapur';

-- Villages for Rajura
INSERT INTO public.villages (name, block_id)
SELECT 'Sonurli', id FROM public.blocks WHERE name = 'Rajura';
INSERT INTO public.villages (name, block_id)
SELECT 'Chunala', id FROM public.blocks WHERE name = 'Rajura';

-- Villages for Korpana
INSERT INTO public.villages (name, block_id)
SELECT 'Korpana Village', id FROM public.blocks WHERE name = 'Korpana';
INSERT INTO public.villages (name, block_id)
SELECT 'Wani', id FROM public.blocks WHERE name = 'Korpana';
