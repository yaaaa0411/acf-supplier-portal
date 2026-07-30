import type { User, Session } from '@supabase/supabase-js';

// ─── User Roles ─────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'subadmin' | 'supplier';

// ─── Database Table Interfaces ──────────────────────────────────────────────

export interface Role {
  id: string;
  name: UserRole;
  description: string | null;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role_id: string;
  role_name: UserRole;       // derived via join with roles table
  district_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  name: string;
  code: string | null;
  state: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  name: string;
  code: string | null;
  district_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Village {
  id: string;
  name: string;
  code: string | null;
  block_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type WorkOrderPrefix = 'GS' | 'AML' | 'CTU' | 'JND';

export type RecordStatus = 'submitted' | 'approved' | 'rejected';

export interface SupplierRecord {
  id: string;
  supplier_id: string;
  work_order_number: string;
  district_id: string;
  block_id: string;
  village_id: string;
  year: string;
  mis_supplier_name: string;
  date_of_application: string;
  area_ha: number | null;
  type_of_mis: string | null;
  crop: string | null;
  farmer_mobile_no: string | null;
  total_mis_cost_ggrc: number | null;
  farmers_contribution: number | null;
  acf_contribution: number | null;
  company_share: number | null;
  government_contribution: number | null;
  total_cost: number | null;
  receipt_number: string | null;
  status: RecordStatus;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Remark {
  id: string;
  supplier_record_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  reference_type: string | null;
  reference_id: string | null;
  created_at: string;
}

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  permissions: string[];       // permission names for the current user
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permissionName: string) => boolean;
}

// ─── UI Types ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  permission?: string;        // required permission to see this item
}

// ─── API Response Types ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// ─── Role Route Mapping ─────────────────────────────────────────────────────

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  subadmin: '/subadmin/dashboard',
  supplier: '/supplier/dashboard',
};

// ─── Work Order Prefix Options ──────────────────────────────────────────────

export const WORK_ORDER_PREFIXES: { value: WorkOrderPrefix; label: string }[] = [
  { value: 'GS', label: 'GS' },
  { value: 'AML', label: 'AML' },
  { value: 'CTU', label: 'CTU' },
  { value: 'JND', label: 'JND' },
];

export const MIS_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Drip Irrigation System', label: 'Drip Irrigation System' },
  { value: 'Sprinkler Irrigation System', label: 'Sprinkler Irrigation System' },
  { value: 'Mulching', label: 'Mulching' },
  { value: 'Polyhouse / Shade Net', label: 'Polyhouse / Shade Net' },
  { value: 'Farm Pond / Water Harvesting', label: 'Farm Pond / Water Harvesting' },
  { value: 'Other', label: 'Other' },
];
