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
  user_profiles: { full_name: string; email: string } | null;
};

/**
 * Fetch supplier records for report generation with optional filters.
 * Returns all matching records in filtered order (newest first by default).
 */
export async function fetchRecordsForReports(
  filters: ReportFilters,
  options?: { districtScope?: string }
): Promise<ReportRecord[]> {
  let query = supabase
    .from('supplier_records')
    .select(`
      *,
      districts ( name ),
      blocks ( name ),
      villages ( name ),
      user_profiles ( full_name, email )
    `);

  if (options?.districtScope) {
    query = query.eq('district_id', options.districtScope);
  }

  if (filters.districtId) {
    query = query.eq('district_id', filters.districtId);
  }
  if (filters.blockId) {
    query = query.eq('block_id', filters.blockId);
  }
  if (filters.villageId) {
    query = query.eq('village_id', filters.villageId);
  }
  if (filters.workOrderNumber) {
    query = query.ilike('work_order_number', `%${filters.workOrderNumber}%`);
  }
  if (filters.dateFrom) {
    query = query.gte('date_of_application', filters.dateFrom);
  }
  if (filters.dateTo) {
    query = query.lte('date_of_application', filters.dateTo);
  }
  if (filters.supplierId) {
    query = query.eq('supplier_id', filters.supplierId);
  }
  if (filters.recordIds && filters.recordIds.length > 0) {
    query = query.in('id', filters.recordIds);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Fetch records for reports error:', error.message);
    throw error;
  }

  return (data ?? []) as ReportRecord[];
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
  let query = supabase
    .from('user_profiles')
    .select('id, full_name, email, roles!inner ( name )')
    .eq('roles.name', 'supplier')
    .eq('is_active', true)
    .order('full_name');

  if (districtId) {
    // Suppliers don't have district_id; filter via their records instead
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
    throw error;
  }

  return (data ?? []) as SupplierOption[];
}
