import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';
import {
  fetchSubadminDashboardStats,
  fetchSubadminRecords,
  fetchBlocksByDistrict,
  fetchVillagesByBlock,
  fetchRemarksByRecord,
  createRemark,
  updateSupplierRecord,
  type SubadminDashboardStats as StatsType,
  type SubadminRecordFilters,
} from '../../services/data.service';
import type { SupplierRecord, Block, Village, Remark } from '../../types';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

type RecordWithMeta = SupplierRecord & {
  blocks: { name: string } | null;
  villages: { name: string } | null;
};

/**
 * Subadmin Dashboard — regional overview limited to assigned district.
 */
export function SubadminDashboardPage() {
  const { profile, hasPermission } = useAuth();
  const districtId = profile?.district_id;
  const canEdit = hasPermission('edit_records');

  // Action state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState<StatsType | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Records Table
  const [records, setRecords] = useState<RecordWithMeta[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [recordsLoading, setRecordsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Dropdown options
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const yearOptions: string[] = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear + 1; y >= 2020; y--) {
    yearOptions.push(String(y));
  }

  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Remarks Modal
  const [activeRecord, setActiveRecord] = useState<RecordWithMeta | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [newRemark, setNewRemark] = useState('');
  const [remarksLoading, setRemarksLoading] = useState(false);
  const [remarkSubmitting, setRemarkSubmitting] = useState(false);
  const remarksModalRef = useRef<HTMLDivElement>(null);
  const bsRemarksModalRef = useRef<InstanceType<typeof import('bootstrap').Modal> | null>(null);

  // Alert
  const [alert, setAlert] = useState<{ type: string; msg: string } | null>(null);

  // ── Fetch Dashboard Stats ──────────────────────────────────────────────────

  const loadStats = useCallback(async () => {
    if (!districtId) {
      setStatsLoading(false);
      return;
    }
    try {
      const data = await fetchSubadminDashboardStats(districtId);
      setStats(data);
    } catch (err) {
      console.error('Failed to load subadmin dashboard stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, [districtId]);

  // ── Fetch Records ──────────────────────────────────────────────────────────

  const loadRecords = useCallback(async () => {
    if (!districtId) {
      setRecordsLoading(false);
      return;
    }
    setRecordsLoading(true);
    try {
      const filters: SubadminRecordFilters = {};
      if (search) filters.search = search;
      if (statusFilter) filters.status = statusFilter;
      if (blockFilter) filters.blockId = blockFilter;
      if (villageFilter) filters.villageId = villageFilter;
      if (yearFilter) filters.year = yearFilter;

      const result = await fetchSubadminRecords(districtId, currentPage, PAGE_SIZE, filters);
      setRecords(result.data);
      setTotalCount(result.count);
    } catch (err) {
      console.error('Failed to load subadmin records:', err);
    } finally {
      setRecordsLoading(false);
    }
  }, [districtId, currentPage, search, statusFilter, blockFilter, villageFilter, yearFilter]);

  const handleStatusUpdate = async (recordId: string, status: SupplierRecord['status']) => {
    if (!profile) return;
    setActionLoadingId(recordId);
    setAlert(null);
    try {
      const updates: Partial<SupplierRecord> = { status };
      if (status === 'approved') {
        updates.approved_by = profile.id;
        updates.approved_at = new Date().toISOString();
      } else {
        updates.approved_by = null;
        updates.approved_at = null;
      }
      await updateSupplierRecord(recordId, updates);
      setAlert({
        type: 'success',
        msg: `Record has been successfully ${status === 'approved' ? 'approved' : 'rejected'}.`,
      });
      loadRecords();
      loadStats();
    } catch (err) {
      console.error('Status update failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to update record status.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // ── Initial load & Geography dropdowns ─────────────────────────────────────

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    if (districtId) {
      fetchBlocksByDistrict(districtId)
        .then(setBlocks)
        .catch(console.error);
    }
  }, [districtId]);

  // ── Search & Filter Handlers ───────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setCurrentPage(1);
    }, 400);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleBlockChange = async (value: string) => {
    setBlockFilter(value);
    setVillageFilter('');
    setVillages([]);
    setCurrentPage(1);

    if (value) {
      try {
        const villageData = await fetchVillagesByBlock(value);
        setVillages(villageData);
      } catch (err) {
        console.error('Failed to load villages for block:', err);
      }
    }
  };

  const handleVillageChange = (value: string) => {
    setVillageFilter(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value: string) => {
    setYearFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setBlockFilter('');
    setVillageFilter('');
    setYearFilter('');
    setVillages([]);
    setCurrentPage(1);
  };

  // ── Remarks Modal Handlers ─────────────────────────────────────────────────

  const openRemarks = async (record: RecordWithMeta) => {
    setActiveRecord(record);
    setRemarksLoading(true);
    setNewRemark('');

    // Open Modal Programmatically
    if (remarksModalRef.current && !bsRemarksModalRef.current) {
      const bootstrap = await import('bootstrap');
      bsRemarksModalRef.current = new bootstrap.Modal(remarksModalRef.current);
    }
    bsRemarksModalRef.current?.show();

    try {
      const data = await fetchRemarksByRecord(record.id);
      setRemarks(data);
    } catch (err) {
      console.error('Failed to fetch remarks:', err);
    } finally {
      setRemarksLoading(false);
    }
  };

  const handleAddRemark = async () => {
    if (!activeRecord || !profile || !newRemark.trim()) return;
    setRemarkSubmitting(true);
    try {
      await createRemark(activeRecord.id, profile.id, newRemark.trim());
      const data = await fetchRemarksByRecord(activeRecord.id);
      setRemarks(data);
      setNewRemark('');
      // Reload stats to update remarks count
      loadStats();
    } catch (err) {
      console.error('Failed to create remark:', err);
      setAlert({ type: 'danger', msg: 'Failed to add remark. Please try again.' });
    } finally {
      setRemarkSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!districtId) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
          <div>
            <h5 className="alert-heading fw-bold mb-1">Region Not Assigned</h5>
            <p className="mb-0">
              Your account has not been assigned to a geographical region (district) yet.
              Please contact the Administrator to configure your regional access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  };

  return (
    <div className="container-fluid py-2 px-0">
      {/* Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            Regional Dashboard
          </h1>
          <p className="text-muted mb-0">
            Overview and records for district: <strong className="text-primary">{stats?.districtName || 'Loading…'}</strong>
          </p>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show border-0 shadow-sm mb-4`} role="alert">
          {alert.msg}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-journal-text" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Supplier Records</h6>
                <h3 className="fw-bold mb-0">
                  {statsLoading ? (
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  ) : (
                    stats?.totalRecords ?? 0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-clock-history" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Pending Review</h6>
                <h3 className="fw-bold mb-0">
                  {statsLoading ? (
                    <span className="spinner-border spinner-border-sm text-warning"></span>
                  ) : (
                    stats?.pendingRecords ?? 0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100 acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-info bg-opacity-10 text-info rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-chat-left-text" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Remarks Added</h6>
                <h3 className="fw-bold mb-0">
                  {statsLoading ? (
                    <span className="spinner-border spinner-border-sm text-info"></span>
                  ) : (
                    stats?.totalRemarks ?? 0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">
            {/* Search */}
            <div className="col-12 col-md-3">
              <label className="form-label small fw-medium mb-1">Search</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Name or Work Order…"
                  defaultValue={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  id="subadmin-search"
                />
              </div>
            </div>

            {/* Block filter */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-medium mb-1">Block</label>
              <select
                className="form-select form-select-sm"
                value={blockFilter}
                onChange={(e) => handleBlockChange(e.target.value)}
                id="filter-block"
              >
                <option value="">All Blocks</option>
                {blocks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Village filter */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-medium mb-1">Village</label>
              <select
                className="form-select form-select-sm"
                value={villageFilter}
                onChange={(e) => handleVillageChange(e.target.value)}
                disabled={!blockFilter}
                id="filter-village"
              >
                <option value="">All Villages</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Status filter */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-medium mb-1">Status</label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                id="filter-status"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Year filter */}
            <div className="col-6 col-md-2">
              <label className="form-label small fw-medium mb-1">Year</label>
              <select
                className="form-select form-select-sm"
                value={yearFilter}
                onChange={(e) => handleYearChange(e.target.value)}
                id="filter-year"
              >
                <option value="">All Years</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Clear */}
            <div className="col-12 col-md-1">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                type="button"
                onClick={clearFilters}
              >
                <i className="bi bi-x-lg me-1"></i>Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {recordsLoading ? (
            <Loader message="Loading records…" fullPage={false} />
          ) : records.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-0">No records found for this region.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" id="subadmin-records-table">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Work Order</th>
                    <th>MIS Supplier Name</th>
                    <th>Block</th>
                    <th>Village</th>
                    <th>Year</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr key={record.id}>
                      <td className="ps-3 text-muted small">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td>
                        <span className="fw-medium">
                          {record.work_order_number}
                        </span>
                      </td>
                      <td>{record.mis_supplier_name}</td>
                      <td>{record.blocks?.name ?? '—'}</td>
                      <td>{record.villages?.name ?? '—'}</td>
                      <td>{record.year}</td>
                      <td>
                        <small>
                          {new Date(record.date_of_application).toLocaleDateString('en-IN')}
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <div className="d-inline-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openRemarks(record)}
                            type="button"
                          >
                            <i className="bi bi-chat-left-text me-1"></i>
                            Remarks
                          </button>

                          {canEdit && record.status === 'submitted' && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleStatusUpdate(record.id, 'approved')}
                                disabled={actionLoadingId === record.id}
                                type="button"
                                title="Approve Record"
                              >
                                {actionLoadingId === record.id ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <i className="bi bi-check-lg"></i>
                                )}
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleStatusUpdate(record.id, 'rejected')}
                                disabled={actionLoadingId === record.id}
                                type="button"
                                title="Reject Record"
                              >
                                {actionLoadingId === record.id ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <i className="bi bi-x-lg"></i>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer with Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3">
            <small className="text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
            </small>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* ── Remarks Modal ────────────────────────────────────────────────────── */}
      <div className="modal fade" ref={remarksModalRef} id="remarksModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-chat-left-text me-2 text-primary"></i>
                Remarks for Work Order:{' '}
                {activeRecord
                  ? activeRecord.work_order_number
                  : ''}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => bsRemarksModalRef.current?.hide()}
              ></button>
            </div>
            <div className="modal-body p-4">
              {/* Add New Remark */}
              <div className="mb-4">
                <label htmlFor="modal-remark-input" className="form-label fw-semibold small text-dark">
                  Add Remarks
                </label>
                <div className="input-group">
                  <textarea
                    id="modal-remark-input"
                    className="form-control"
                    placeholder="Enter your remark here…"
                    rows={2}
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    disabled={remarkSubmitting}
                  ></textarea>
                  <button
                    className="btn btn-primary px-4"
                    type="button"
                    onClick={handleAddRemark}
                    disabled={remarkSubmitting || !newRemark.trim()}
                    id="modal-add-remark-btn"
                  >
                    {remarkSubmitting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <>
                        <i className="bi bi-send me-1"></i>Send
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Remarks List */}
              <div className="border-top pt-3">
                <h6 className="fw-semibold text-muted small mb-3">Remarks History</h6>
                {remarksLoading ? (
                  <div className="text-center py-3">
                    <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                    Loading remarks…
                  </div>
                ) : remarks.length === 0 ? (
                  <p className="text-muted small text-center mb-0 my-3">No remarks found for this record.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {remarks.map((r) => (
                      <div key={r.id} className="list-group-item px-0 py-3 border-start-0 border-end-0">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark small">
                            {r.user_id === profile?.id ? 'You' : 'Author'}
                          </span>
                          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                            {new Date(r.created_at).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="mb-0 text-secondary small" style={{ whiteSpace: 'pre-wrap' }}>
                          {r.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => bsRemarksModalRef.current?.hide()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
