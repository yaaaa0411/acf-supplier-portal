import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';
import {
  fetchSubadminRecords,
  fetchBlocksByDistrict,
  fetchVillagesByBlock,
  fetchRemarksByRecord,
  createRemark,
  updateSupplierRecord,
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
 * Subadmin Records Page — Manage and review supplier records from the assigned district.
 */
export function SubadminRecordsPage() {
  const { profile, hasPermission } = useAuth();
  const districtId = profile?.district_id;
  const canEdit = hasPermission('edit_records');

  // Data
  const [records, setRecords] = useState<RecordWithMeta[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

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

  // Action state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: string; msg: string } | null>(null);

  // ── Load records ───────────────────────────────────────────────────────────

  const loadRecords = useCallback(async () => {
    if (!districtId) {
      setLoading(false);
      return;
    }
    setLoading(true);
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
      setAlert({ type: 'danger', msg: 'Failed to load supplier records.' });
    } finally {
      setLoading(false);
    }
  }, [districtId, currentPage, search, statusFilter, blockFilter, villageFilter, yearFilter]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // Load block dropdown on mount if district assigned
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

  // ── Status updates ─────────────────────────────────────────────────────────

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
    } catch (err) {
      console.error('Status update failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to update record status.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // ── Remarks Modal Handlers ─────────────────────────────────────────────────

  const openRemarks = async (record: RecordWithMeta) => {
    setActiveRecord(record);
    setRemarksLoading(true);
    setNewRemark('');

    // Open Modal
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
    } catch (err) {
      console.error('Failed to create remark:', err);
      setAlert({ type: 'danger', msg: 'Failed to add remark. Please try again.' });
    } finally {
      setRemarkSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  };

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

  return (
    <div className="container-fluid py-2 px-0">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">
          <i className="bi bi-journal-text me-2 text-primary"></i>Supplier Records
        </h1>
        <p className="text-muted mb-0">Review and approve supplier entries for your district.</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show border-0 shadow-sm mb-4`} role="alert">
          {alert.msg}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

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
                  id="subadmin-records-search"
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
                id="filter-block-records"
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
                id="filter-village-records"
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
                id="filter-status-records"
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
                id="filter-year-records"
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
          {loading ? (
            <Loader message="Loading records…" fullPage={false} />
          ) : records.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-0">No records found for this region.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" id="subadmin-records-page-table">
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
                        <span className="fw-medium">{record.work_order_number}</span>
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
                            title="Remarks"
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
                {activeRecord ? activeRecord.work_order_number : ''}
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
                  Add Remark
                </label>
                <div className="input-group">
                  <textarea
                    id="modal-remark-input"
                    className="form-control"
                    placeholder="Enter comment here..."
                    rows={2}
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                  ></textarea>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleAddRemark}
                    disabled={remarkSubmitting || !newRemark.trim()}
                  >
                    {remarkSubmitting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </div>

              {/* Remarks List */}
              <div className="remarks-timeline">
                <h6 className="fw-bold mb-3 text-secondary small text-uppercase">Timeline & Remarks</h6>
                {remarksLoading ? (
                  <div className="text-center py-4">
                    <span className="spinner-border spinner-border-sm text-primary me-2"></span>
                    Loading remarks…
                  </div>
                ) : remarks.length === 0 ? (
                  <p className="text-muted small my-3">No remarks yet.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {remarks.map((r) => (
                      <div key={r.id} className="list-group-item px-0 py-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-semibold text-dark small">
                            {r.user_id === profile?.id ? 'You' : 'System User'}
                          </span>
                          <span className="text-muted extra-small">
                            {new Date(r.created_at).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="mb-0 text-muted small whitespace-pre-wrap">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
