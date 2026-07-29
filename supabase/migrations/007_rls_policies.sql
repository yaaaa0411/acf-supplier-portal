-- ============================================================================
-- 007: Row Level Security Policies
-- ============================================================================

-- ── Helper: get the role name for the currently authenticated user ───────────

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT r.name
  FROM public.user_profiles up
  JOIN public.roles r ON r.id = up.role_id
  WHERE up.id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Helper: get the district_id for the currently authenticated user ─────────

CREATE OR REPLACE FUNCTION public.get_user_district_id()
RETURNS UUID AS $$
  SELECT district_id
  FROM public.user_profiles
  WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Helper: check if user has a specific permission ──────────────────────────

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


-- ═══════════════════════════════════════════════════════════════════════════════
-- ENABLE RLS ON ALL TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

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


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: roles
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "roles_select_authenticated"
  ON public.roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "roles_insert_admin"
  ON public.roles FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "roles_update_admin"
  ON public.roles FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin');


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: permissions
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "permissions_select_authenticated"
  ON public.permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "permissions_insert_admin"
  ON public.permissions FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "permissions_update_admin"
  ON public.permissions FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin');


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: role_permissions
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "role_permissions_select_authenticated"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "role_permissions_insert_admin"
  ON public.role_permissions FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "role_permissions_delete_admin"
  ON public.role_permissions FOR DELETE
  TO authenticated
  USING (public.get_user_role() = 'admin');


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: user_profiles
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own profile; admins read all; subadmins read their district
CREATE POLICY "user_profiles_select"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()
    OR public.get_user_role() = 'admin'
    OR (
      public.get_user_role() = 'subadmin'
      AND district_id = public.get_user_district_id()
    )
  );

-- Only admins can create user profiles
CREATE POLICY "user_profiles_insert_admin"
  ON public.user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'admin');

-- Admins can update any profile
CREATE POLICY "user_profiles_update_admin"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin');

-- Users can update their own basic info (name, avatar, phone)
CREATE POLICY "user_profiles_update_self"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: districts
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "districts_select_authenticated"
  ON public.districts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "districts_insert_admin"
  ON public.districts FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "districts_update_admin"
  ON public.districts FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin');


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: blocks
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "blocks_select_authenticated"
  ON public.blocks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "blocks_insert_admin"
  ON public.blocks FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "blocks_update_admin"
  ON public.blocks FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin');


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: villages
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE POLICY "villages_select_authenticated"
  ON public.villages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "villages_insert_admin"
  ON public.villages FOR INSERT
  TO authenticated
  WITH CHECK (public.get_user_role() = 'admin');

CREATE POLICY "villages_update_admin"
  ON public.villages FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin');


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: supplier_records
-- ═══════════════════════════════════════════════════════════════════════════════

-- Suppliers see their own; subadmins see their district; admins see all
CREATE POLICY "supplier_records_select"
  ON public.supplier_records FOR SELECT
  TO authenticated
  USING (
    supplier_id = auth.uid()
    OR public.get_user_role() = 'admin'
    OR (
      public.get_user_role() = 'subadmin'
      AND district_id = public.get_user_district_id()
    )
  );

-- Suppliers can insert their own records (one-time, enforced by UNIQUE constraint)
CREATE POLICY "supplier_records_insert_supplier"
  ON public.supplier_records FOR INSERT
  TO authenticated
  WITH CHECK (
    supplier_id = auth.uid()
    AND public.get_user_role() = 'supplier'
  );

-- Only admins can update supplier records
CREATE POLICY "supplier_records_update_admin"
  ON public.supplier_records FOR UPDATE
  TO authenticated
  USING (public.get_user_role() = 'admin');

-- Only admins can delete supplier records
CREATE POLICY "supplier_records_delete_admin"
  ON public.supplier_records FOR DELETE
  TO authenticated
  USING (public.get_user_role() = 'admin');


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: remarks
-- ═══════════════════════════════════════════════════════════════════════════════

-- Visible if user has access to the parent supplier record
CREATE POLICY "remarks_select"
  ON public.remarks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.supplier_records sr
      WHERE sr.id = supplier_record_id
        AND (
          sr.supplier_id = auth.uid()
          OR public.get_user_role() = 'admin'
          OR (
            public.get_user_role() = 'subadmin'
            AND sr.district_id = public.get_user_district_id()
          )
        )
    )
  );

-- Any authenticated user who can view the record can add remarks
CREATE POLICY "remarks_insert"
  ON public.remarks FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.supplier_records sr
      WHERE sr.id = supplier_record_id
        AND (
          sr.supplier_id = auth.uid()
          OR public.get_user_role() = 'admin'
          OR (
            public.get_user_role() = 'subadmin'
            AND sr.district_id = public.get_user_district_id()
          )
        )
    )
  );


-- ═══════════════════════════════════════════════════════════════════════════════
-- POLICIES: notifications
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can only see their own notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can mark their own notifications as read
CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
