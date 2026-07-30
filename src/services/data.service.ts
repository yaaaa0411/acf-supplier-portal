import { supabase } from '../config/supabase';
import type { District, Block, Village, SupplierRecord, Remark } from '../types';
import { getFallbackDistricts, getFallbackBlocks, getFallbackVillages } from '../data/masterLocations';

// ─── Geography Services ─────────────────────────────────────────────────────

export async function fetchDistricts(): Promise<District[]> {
  try {
    const { data, error } = await supabase
      .from('districts')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.warn('Fetch districts from DB failed, using master fallback:', error.message);
      return getFallbackDistricts();
    }
    
    if (!data || data.length === 0) {
      return getFallbackDistricts();
    }
    
    return data as District[];
  } catch (err) {
    console.warn('Fetch districts error, using master fallback:', err);
    return getFallbackDistricts();
  }
}

export async function fetchBlocksByDistrict(districtId: string): Promise<Block[]> {
  try {
    // Try to get district details if districtId is UUID vs fallback ID
    let finalDistrictName = districtId;
    if (districtId.startsWith('dist-')) {
      // Fallback path
      return getFallbackBlocks(districtId);
    }

    const { data: distData } = await supabase
      .from('districts')
      .select('name')
      .eq('id', districtId)
      .single();
    if (distData) {
      finalDistrictName = distData.name;
    }

    const { data, error } = await supabase
      .from('blocks')
      .select('*')
      .eq('district_id', districtId)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.warn('Fetch blocks from DB failed, using master fallback:', error.message);
      return getFallbackBlocks(finalDistrictName);
    }

    if (!data || data.length === 0) {
      return getFallbackBlocks(finalDistrictName);
    }

    return data as Block[];
  } catch (err) {
    console.warn('Fetch blocks error, using master fallback:', err);
    return getFallbackBlocks(districtId);
  }
}

export async function fetchVillagesByBlock(blockId: string): Promise<Village[]> {
  try {
    let finalBlockName = blockId;
    if (blockId.startsWith('blk-')) {
      // Fallback path
      return getFallbackVillages(blockId);
    }

    const { data: blkData } = await supabase
      .from('blocks')
      .select('name')
      .eq('id', blockId)
      .single();
    if (blkData) {
      finalBlockName = blkData.name;
    }

    const { data, error } = await supabase
      .from('villages')
      .select('*')
      .eq('block_id', blockId)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.warn('Fetch villages from DB failed, using master fallback:', error.message);
      return getFallbackVillages(finalBlockName);
    }

    if (!data || data.length === 0) {
      return getFallbackVillages(finalBlockName);
    }

    return data as Village[];
  } catch (err) {
    console.warn('Fetch villages error, using master fallback:', err);
    return getFallbackVillages(blockId);
  }
}

// ─── Supplier Record Services ────────────────────────────────────────────────

/**
 * Fetch all records submitted by a specific supplier.
 */
export async function fetchSupplierRecords(supplierId: string): Promise<SupplierRecord[]> {
  const { data, error } = await supabase
    .from('supplier_records')
    .select('*')
    .eq('supplier_id', supplierId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch supplier records error:', error.message);
    throw error;
  }
  return (data ?? []) as SupplierRecord[];
}

/**
 * Fetch a single supplier record by ID.
 */
export async function fetchSupplierRecordById(id: string): Promise<SupplierRecord | null> {
  const { data, error } = await supabase
    .from('supplier_records')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Fetch supplier record by ID error:', error.message);
    throw error;
  }
  return data as SupplierRecord;
}

/**
 * Submit a new supplier record (one-time only, enforced by DB unique constraint).
 */
export async function createSupplierRecord(
  record: Omit<SupplierRecord, 'id' | 'status' | 'approved_by' | 'approved_at' | 'created_at' | 'updated_at'>
): Promise<SupplierRecord> {
  const { data, error } = await supabase
    .from('supplier_records')
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error('Create supplier record error:', error.message);
    throw error;
  }
  return data as SupplierRecord;
}

/**
 * Generate the next work order number for a given prefix.
 * Format: {FY}-{PREFIX}-{SEQ4} e.g. 2526-GS-2704
 */
export async function generateWorkOrderNumber(prefix: string): Promise<string> {
  const { data, error } = await supabase.rpc('generate_work_order_number', {
    p_prefix: prefix,
  });

  if (error) {
    console.error('Generate work order number error:', error.message);
    throw error;
  }

  return data as string;
}

/**
 * Update an existing supplier record (admin only, enforced by RLS).
 */
export async function updateSupplierRecord(
  recordId: string,
  updates: Partial<SupplierRecord>
): Promise<SupplierRecord> {
  const { data, error } = await supabase
    .from('supplier_records')
    .update(updates)
    .eq('id', recordId)
    .select()
    .single();

  if (error) {
    console.error('Update supplier record error:', error.message);
    throw error;
  }
  return data as SupplierRecord;
}

/**
 * Delete a supplier record (admin only, enforced by RLS).
 */
export async function deleteSupplierRecord(recordId: string): Promise<void> {
  const { error } = await supabase
    .from('supplier_records')
    .delete()
    .eq('id', recordId);

  if (error) {
    console.error('Delete supplier record error:', error.message);
    throw error;
  }
}

// ─── Remarks Services ────────────────────────────────────────────────────────

export async function fetchRemarksByRecord(supplierRecordId: string): Promise<Remark[]> {
  const { data, error } = await supabase
    .from('remarks')
    .select('*')
    .eq('supplier_record_id', supplierRecordId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch remarks error:', error.message);
    throw error;
  }
  return (data ?? []) as Remark[];
}

export async function createRemark(
  supplierRecordId: string,
  userId: string,
  content: string
): Promise<Remark> {
  const { data, error } = await supabase
    .from('remarks')
    .insert({
      supplier_record_id: supplierRecordId,
      user_id: userId,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Create remark error:', error.message);
    throw error;
  }
  return data as Remark;
}

// ─── Subadmin Services ───────────────────────────────────────────────────────

export interface SubadminDashboardStats {
  totalRecords: number;
  pendingRecords: number;
  totalRemarks: number;
  districtName: string;
}

/**
 * Fetch dashboard stats for a specific subadmin's district.
 */
export async function fetchSubadminDashboardStats(districtId: string): Promise<SubadminDashboardStats> {
  // Fetch district name
  const { data: districtData, error: districtError } = await supabase
    .from('districts')
    .select('name')
    .eq('id', districtId)
    .single();

  if (districtError) {
    console.error('Fetch district name error:', districtError.message);
    throw districtError;
  }

  // Count total records in this district
  const { count: totalCount, error: totalError } = await supabase
    .from('supplier_records')
    .select('id', { count: 'exact', head: true })
    .eq('district_id', districtId);

  if (totalError) {
    console.error('Fetch total records error:', totalError.message);
    throw totalError;
  }

  // Count pending records in this district
  const { count: pendingCount, error: pendingError } = await supabase
    .from('supplier_records')
    .select('id', { count: 'exact', head: true })
    .eq('district_id', districtId)
    .eq('status', 'submitted');

  if (pendingError) {
    console.error('Fetch pending records error:', pendingError.message);
    throw pendingError;
  }

  // Count remarks on all records of this district
  // To avoid complex joins, we get the list of record IDs first
  const { data: recordIdsData, error: idsError } = await supabase
    .from('supplier_records')
    .select('id')
    .eq('district_id', districtId);

  if (idsError) {
    console.error('Fetch record IDs error:', idsError.message);
    throw idsError;
  }

  let remarksCount = 0;
  if (recordIdsData && recordIdsData.length > 0) {
    const ids = recordIdsData.map(r => r.id);
    const { count, error: remarksError } = await supabase
      .from('remarks')
      .select('id', { count: 'exact', head: true })
      .in('supplier_record_id', ids);

    if (remarksError) {
      console.error('Fetch remarks count error:', remarksError.message);
      throw remarksError;
    }
    remarksCount = count ?? 0;
  }

  return {
    totalRecords: totalCount ?? 0,
    pendingRecords: pendingCount ?? 0,
    totalRemarks: remarksCount,
    districtName: districtData?.name ?? 'Assigned Region',
  };
}

export interface SubadminRecordFilters {
  search?: string;
  status?: string;
  blockId?: string;
  villageId?: string;
  year?: string;
}

/**
 * Fetch records for a subadmin's assigned district with search/filtering and pagination.
 */
export async function fetchSubadminRecords(
  districtId: string,
  page: number,
  pageSize: number,
  filters: SubadminRecordFilters
): Promise<{ data: (SupplierRecord & { blocks: { name: string } | null; villages: { name: string } | null })[]; count: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('supplier_records')
    .select('*, blocks ( name ), villages ( name )', { count: 'exact' })
    .eq('district_id', districtId);

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.blockId) {
    query = query.eq('block_id', filters.blockId);
  }
  if (filters.villageId) {
    query = query.eq('village_id', filters.villageId);
  }
  if (filters.year) {
    query = query.eq('year', filters.year);
  }
  if (filters.search) {
    query = query.or(`mis_supplier_name.ilike.%${filters.search}%,work_order_number.ilike.%${filters.search}%`);
  }

  query = query.order('created_at', { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Fetch subadmin records error:', error.message);
    throw error;
  }

  return {
    data: (data ?? []) as (SupplierRecord & { blocks: { name: string } | null; villages: { name: string } | null })[],
    count: count ?? 0,
  };
}

