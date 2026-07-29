-- ============================================================================
-- 008: Seed Roles, Permissions, and Role-Permission Assignments
-- ============================================================================

-- ── Insert Roles ─────────────────────────────────────────────────────────────

INSERT INTO public.roles (name, description) VALUES
  ('admin',    'Full system access. Can manage all users, records, and settings.'),
  ('subadmin', 'Regional administrator. Access limited to assigned regions and granted permissions.'),
  ('supplier', 'Supplier user. Can submit data once, view own records, and add remarks.');


-- ── Insert Permissions ───────────────────────────────────────────────────────

INSERT INTO public.permissions (name, module, description) VALUES
  -- User management
  ('manage_users',           'users',     'Create, edit, and deactivate users'),
  ('manage_subadmins',       'users',     'Create and manage subadmin accounts'),
  ('assign_permissions',     'users',     'Assign/revoke permissions for subadmins'),

  -- Geography
  ('manage_geography',       'geography', 'Create, edit, and delete districts, blocks, and villages'),
  ('view_all_regions',       'geography', 'View all geographical regions'),
  ('view_assigned_regions',  'geography', 'View only assigned geographical regions'),

  -- Supplier records
  ('view_records',           'records',   'View supplier records'),
  ('submit_records',         'records',   'Submit new supplier records'),
  ('edit_records',           'records',   'Edit existing supplier records'),
  ('delete_records',         'records',   'Delete supplier records'),

  -- Documents
  ('view_documents',         'documents', 'View all uploaded documents'),

  -- Remarks
  ('add_remarks',            'records',   'Add remarks to supplier records'),

  -- Reports
  ('view_reports',           'reports',   'View reports and analytics'),

  -- Notifications
  ('manage_notifications',   'notifications', 'Send and manage notifications');


-- ── Assign Permissions to Roles ──────────────────────────────────────────────

-- Admin gets ALL permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'admin';

-- Subadmin gets a base set (admin can customize further per user)
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'view_assigned_regions',
  'view_records',
  'add_remarks',
  'view_documents',
  'view_reports'
)
WHERE r.name = 'subadmin';

-- Supplier gets minimal permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
JOIN public.permissions p ON p.name IN (
  'submit_records',
  'view_records',
  'add_remarks'
)
WHERE r.name = 'supplier';
