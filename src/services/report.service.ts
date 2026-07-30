import { supabase } from '../config/supabase';
import type { SupplierRecord } from '../types';

export interface ReportFilters {
  districtId?: string;
  blockId?: string;
  villageId?: string;
  workOrderNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  supplierId?: string;
  recordIds?: string[];
}

export type ReportRecord = SupplierRecord & {
  districts: { name: string } | null;
  blocks: { name: string } | null;
  villages: { name: string } | null;
};

/**
 * Apply report filters to a Supabase query builder.
 */
function applyReportFilters<T extends { eq: Function; ilike: Function; gte: Function; lte: Function; in: Function; order: Function }>(
  query: T,
  filters: ReportFilters,
  districtScope?: string
): T {
  let q = query;
  if (districtScope) q = q.eq('district_id', districtScope) as T;
  if (filters.districtId) q = q.eq('district_id', filters.districtId) as T;
  if (filters.blockId) q = q.eq('block_id', filters.blockId) as T;
  if (filters.villageId) q = q.eq('village_id', filters.villageId) as T;
  if (filters.workOrderNumber) q = q.ilike('work_order_number', `%${filters.workOrderNumber}%`) as T;
  if (filters.dateFrom) q = q.gte('date_of_application', filters.dateFrom) as T;
  if (filters.dateTo) q = q.lte('date_of_application', filters.dateTo) as T;
  if (filters.supplierId) q = q.eq('supplier_id', filters.supplierId) as T;
  if (filters.recordIds && filters.recordIds.length > 0) q = q.in('id', filters.recordIds) as T;
  return q.order('created_at', { ascending: false }) as T;
}

/**
 * Fetch supplier records for report generation with optional filters.
 * Returns all matching records in filtered order (newest first by default).
 */
export async function fetchRecordsForReports(
  filters: ReportFilters,
  options?: { districtScope?: string }
): Promise<ReportRecord[]> {
  const joinedQuery = applyReportFilters(
    supabase
      .from('supplier_records')
      .select(`
        *,
        districts ( name ),
        blocks ( name ),
        villages ( name )
      `),
    filters,
    options?.districtScope
  );

  const { data, error } = await joinedQuery;

  if (!error) {
    return (data ?? []) as ReportRecord[];
  }

  console.warn('Report fetch with geography joins failed, retrying plain select:', error.message);

  const plainQuery = applyReportFilters(
    supabase.from('supplier_records').select('*'),
    filters,
    options?.districtScope
  );

  const { data: plainData, error: plainError } = await plainQuery;

  if (plainError) {
    console.error('Fetch records for reports error:', plainError.message);
    throw plainError;
  }

  return (plainData ?? []).map((record) => ({
    ...(record as SupplierRecord),
    districts: null,
    blocks: null,
    villages: null,
  }));
}

export interface SupplierOption {
  id: string;
  full_name: string;
  email: string;
}

/**
 * Fetch supplier users for report filter dropdown.
 */
export async function fetchSupplierOptions(districtId?: string): Promise<SupplierOption[]> {
  const { data: supplierRole, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'supplier')
    .single();

  if (roleError || !supplierRole) {
    console.error('Fetch supplier role error:', roleError?.message);
    return [];
  }

  let query = supabase
    .from('user_profiles')
    .select('id, full_name, email')
    .eq('role_id', supplierRole.id)
    .eq('is_active', true)
    .order('full_name');

  if (districtId) {
    const { data: recordSuppliers } = await supabase
      .from('supplier_records')
      .select('supplier_id')
      .eq('district_id', districtId);

    const supplierIds = [...new Set((recordSuppliers ?? []).map((r) => r.supplier_id))];
    if (supplierIds.length === 0) return [];
    query = query.in('id', supplierIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Fetch supplier options error:', error.message);
    return [];
  }

  return (data ?? []) as SupplierOption[];
}
