import { supabase } from '../config/supabase';
import type {
  SupplierRecord,
  UserProfile,
  Role,
  Permission,
  District,
} from '../types';

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalRecords: number;
  totalDistricts: number;
  pendingRecords: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [usersRes, recordsRes, districtsRes, pendingRes] = await Promise.all([
    supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('supplier_records').select('id', { count: 'exact', head: true }),
    supabase.from('districts').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('supplier_records').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
  ]);

  return {
    totalUsers: usersRes.count ?? 0,
    totalRecords: recordsRes.count ?? 0,
    totalDistricts: districtsRes.count ?? 0,
    pendingRecords: pendingRes.count ?? 0,
  };
}

// ─── Supplier Records (Admin) ────────────────────────────────────────────────

export interface RecordFilters {
  search?: string;
  status?: string;
  districtId?: string;
  year?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
}

/**
 * Fetch supplier records with search, filter, and pagination.
 * Joins with districts for display.
 */
export async function fetchAllRecords(
  page: number,
  pageSize: number,
  filters: RecordFilters
): Promise<PaginatedResult<SupplierRecord & {
  districts: { name: string } | null;
  blocks: { name: string } | null;
  villages: { name: string } | null;
}>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('supplier_records')
    .select('*, districts ( name ), blocks ( name ), villages ( name )', { count: 'exact' });

  // Filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.districtId) {
    query = query.eq('district_id', filters.districtId);
  }
  if (filters.year) {
    query = query.eq('year', filters.year);
  }
  if (filters.search) {
    query = query.or(
      `mis_supplier_name.ilike.%${filters.search}%,work_order_number.ilike.%${filters.search}%`
    );
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Fetch all records error:', error.message);
    throw error;
  }

  return {
    data: (data ?? []) as (SupplierRecord & {
      districts: { name: string } | null;
      blocks: { name: string } | null;
      villages: { name: string } | null;
    })[],
    count: count ?? 0,
  };
}

// ─── User Management (Admin) ─────────────────────────────────────────────────

/**
 * Fetch all user profiles with role info.
 */
export async function fetchAllUsers(
  page: number,
  pageSize: number,
  search?: string
): Promise<PaginatedResult<UserProfile>> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('user_profiles')
    .select('*, roles ( name )', { count: 'exact' });

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Fetch all users error:', error.message);
    throw error;
  }

  // Map role name
  const mapped = (data ?? []).map((u: Record<string, unknown>) => {
    const roleData = u.roles as { name: string } | null;
    return {
      ...u,
      role_name: roleData?.name ?? 'supplier',
    };
  }) as UserProfile[];

  return { data: mapped, count: count ?? 0 };
}

/**
 * Create a new user profile (for subadmin or supplier created by admin).
 * Note: The user must first exist in auth.users (via Google login).
 * Admin provides the auth user's ID + assigns role.
 */
export async function createUserProfile(profile: {
  id: string;
  email: string;
  full_name: string;
  role_id: string;
  district_id?: string | null;
  phone?: string | null;
}): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role_id: profile.role_id,
      district_id: profile.district_id ?? null,
      phone: profile.phone ?? null,
    })
    .select('*, roles ( name )')
    .single();

  if (error) {
    console.error('Create user profile error:', error.message);
    throw error;
  }

  const roleData = (data as Record<string, unknown>).roles as { name: string } | null;
  return { ...data, role_name: roleData?.name ?? 'supplier' } as UserProfile;
}

/**
 * Update a user profile.
 */
export async function updateUserProfile(
  userId: string,
  updates: {
    full_name?: string;
    role_id?: string;
    district_id?: string | null;
    phone?: string | null;
    is_active?: boolean;
  }
): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Update user profile error:', error.message);
    throw error;
  }
}

/**
 * Delete a user profile.
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Delete user profile error:', error.message);
    throw error;
  }
}

// ─── Roles & Permissions ─────────────────────────────────────────────────────

export async function fetchRoles(): Promise<Role[]> {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');

  if (error) {
    console.error('Fetch roles error:', error.message);
    throw error;
  }
  return (data ?? []) as Role[];
}

export async function fetchPermissions(): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('module, name');

  if (error) {
    console.error('Fetch permissions error:', error.message);
    throw error;
  }
  return (data ?? []) as Permission[];
}

export async function fetchRolePermissionIds(roleId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permission_id')
    .eq('role_id', roleId);

  if (error) {
    console.error('Fetch role permission ids error:', error.message);
    return [];
  }
  return (data ?? []).map((rp) => rp.permission_id);
}

/**
 * Replace all permissions for a role (delete + insert).
 */
export async function updateRolePermissions(
  roleId: string,
  permissionIds: string[]
): Promise<void> {
  // Delete existing
  const { error: delError } = await supabase
    .from('role_permissions')
    .delete()
    .eq('role_id', roleId);

  if (delError) {
    console.error('Delete role permissions error:', delError.message);
    throw delError;
  }

  // Insert new
  if (permissionIds.length > 0) {
    const rows = permissionIds.map((pid) => ({
      role_id: roleId,
      permission_id: pid,
    }));

    const { error: insError } = await supabase
      .from('role_permissions')
      .insert(rows);

    if (insError) {
      console.error('Insert role permissions error:', insError.message);
      throw insError;
    }
  }
}

// ─── Districts (for filters) ─────────────────────────────────────────────────

export async function fetchAllDistricts(): Promise<District[]> {
  const { data, error } = await supabase
    .from('districts')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Fetch all districts error:', error.message);
    throw error;
  }
  return (data ?? []) as District[];
}
