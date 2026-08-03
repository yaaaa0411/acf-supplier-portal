import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  fetchAllRecords,
  fetchAllDistricts,
  type RecordFilters,
} from '../../services/admin.service';
import {
  updateSupplierRecord,
  deleteSupplierRecord,
} from '../../services/data.service';
import {
  CostFields,
  costValuesFromRecord,
  getCalculatedCostValues,
  type CostFieldValues,
} from '../../components/supplier/CostFields';
import { RecordDetailsPanel } from '../../components/supplier/RecordDetailsPanel';
import type { SupplierRecord, District } from '../../types';
import { MIS_TYPE_OPTIONS } from '../../types';
import { parseWorkOrderNumber, getFinancialYearLabel, getFinancialYearCode, getFinancialYearOptions } from '../../utils/workOrder';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

type RecordWithDistrict = SupplierRecord & {
  districts: { name: string } | null;
  blocks?: { name: string } | null;
  villages?: { name: string } | null;
};

const WORK_ORDER_FORMAT = /^\d{4}-(GS|AMR|CTU|JND|AMD)-\d+$/;



/**
 * Admin Records Page.
 * View, search, filter, edit, and delete supplier records.
 */
export function AdminRecordsPage() {
  const { profile } = useAuth();
  // Data
  const [records, setRecords] = useState<RecordWithDistrict[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // View modal
  const [viewRecord, setViewRecord] = useState<RecordWithDistrict | null>(null);
  const viewModalRef = useRef<HTMLDivElement>(null);
  const bsViewModalRef = useRef<InstanceType<typeof import('bootstrap').Modal> | null>(null);

  // Edit modal
  const [editRecord, setEditRecord] = useState<RecordWithDistrict | null>(null);
  const [editData, setEditData] = useState({
    work_order_number: '',
    mis_supplier_name: '',
    date_of_application: '',
    area_ha: '',
    type_of_mis: '',
    type_of_mis_other: '',
    crop: '',
    farmer_mobile_no: '',
    status: '' as SupplierRecord['status'],
  });
  const [editCostValues, setEditCostValues] = useState<CostFieldValues>({
    totalMisCostGgrc: '',
    acfContribution: '',
    companyShare: '',
    governmentContribution: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const editModalRef = useRef<HTMLDivElement>(null);
  const bsEditModalRef = useRef<InstanceType<typeof import('bootstrap').Modal> | null>(null);

  // Delete modal
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Alert
  const [alert, setAlert] = useState<{ type: string; msg: string } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ── Load data ──────────────────────────────────────────────────────────────

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const filters: RecordFilters = {};
      if (search) filters.search = search;
      if (statusFilter) filters.status = statusFilter;
      if (districtFilter) filters.districtId = districtFilter;
      if (yearFilter) filters.year = yearFilter;

      const result = await fetchAllRecords(currentPage, PAGE_SIZE, filters);
      setRecords(result.data);
      setTotalCount(result.count);
    } catch (err) {
      console.error('Load records failed:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter, districtFilter, yearFilter]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    fetchAllDistricts().then(setDistricts).catch(console.error);
  }, []);

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
        msg: `Record status updated to ${status}.`,
      });
      loadRecords();
    } catch (err) {
      console.error('Status update failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to update record status.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // ── Search with debounce ───────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setCurrentPage(1);
    }, 400);
  };

  // ── Filter handlers ────────────────────────────────────────────────────────

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDistrictChange = (value: string) => {
    setDistrictFilter(value);
    setCurrentPage(1);
  };

  const handleYearChange = (value: string) => {
    setYearFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setDistrictFilter('');
    setYearFilter('');
    setCurrentPage(1);
  };

  // ── Edit ───────────────────────────────────────────────────────────────────

  const openView = async (record: RecordWithDistrict) => {
    setViewRecord(record);
    if (viewModalRef.current && !bsViewModalRef.current) {
      const bootstrap = await import('bootstrap');
      bsViewModalRef.current = new bootstrap.Modal(viewModalRef.current);
    }
    bsViewModalRef.current?.show();
  };

  const openEdit = async (record: RecordWithDistrict) => {
    const misType = record.type_of_mis ?? '';
    const knownMis = MIS_TYPE_OPTIONS.find((o) => o.value === misType && o.value !== 'Other');

    setEditRecord(record);
    setEditData({
      work_order_number: record.work_order_number,
      mis_supplier_name: record.mis_supplier_name,
      date_of_application: record.date_of_application,
      area_ha: record.area_ha?.toString() ?? '',
      type_of_mis: knownMis ? misType : misType ? 'Other' : '',
      type_of_mis_other: knownMis ? '' : misType,
      crop: record.crop ?? '',
      farmer_mobile_no: record.farmer_mobile_no ?? '',
      status: record.status,
    });
    setEditCostValues(costValuesFromRecord(record));

    if (editModalRef.current && !bsEditModalRef.current) {
      const bootstrap = await import('bootstrap');
      bsEditModalRef.current = new bootstrap.Modal(editModalRef.current);
    }
    bsEditModalRef.current?.show();
  };

  const handleEditSave = async () => {
    if (!editRecord) return;
    const woNumber = editData.work_order_number.trim();
    if (!woNumber) {
      setAlert({ type: 'danger', msg: 'Work Order Number is required.' });
      return;
    }
    if (!WORK_ORDER_FORMAT.test(woNumber)) {
      setAlert({ type: 'danger', msg: 'Work Order Number must be in format 2526-GS-2704.' });
      return;
    }
    if (!editData.area_ha || parseFloat(editData.area_ha) <= 0) {
      setAlert({ type: 'danger', msg: 'Area (Ha) is required.' });
      return;
    }
    const resolvedMisType = editData.type_of_mis === 'Other'
      ? editData.type_of_mis_other.trim()
      : editData.type_of_mis;
    if (!resolvedMisType) {
      setAlert({ type: 'danger', msg: 'Type of MIS is required.' });
      return;
    }
    if (!/^\d{10}$/.test(editData.farmer_mobile_no.trim())) {
      setAlert({ type: 'danger', msg: 'Farmer Mobile No. must be exactly 10 digits.' });
      return;
    }

    const costs = getCalculatedCostValues(editCostValues);
    const parsedWo = parseWorkOrderNumber(woNumber);

    setEditSaving(true);
    try {
      const updates: Partial<SupplierRecord> = {
        work_order_number: woNumber,
        year: parsedWo?.financialYear ?? editRecord.year,
        mis_supplier_name: editData.mis_supplier_name.trim(),
        date_of_application: editData.date_of_application,
        area_ha: parseFloat(editData.area_ha),
        type_of_mis: resolvedMisType,
        crop: editData.crop.trim(),
        farmer_mobile_no: editData.farmer_mobile_no.trim(),
        total_mis_cost_ggrc: costs.total_mis_cost_ggrc,
        farmers_contribution: costs.farmers_contribution,
        acf_contribution: costs.acf_contribution,
        company_share: costs.company_share,
        government_contribution: costs.government_contribution,
        total_cost: costs.total_cost,
        receipt_number: parsedWo?.sequence.padStart(4, '0') ?? editRecord.receipt_number,
        status: editData.status,
      };

      if (editData.status === 'approved') {
        updates.approved_by = profile?.id || null;
        updates.approved_at = new Date().toISOString();
      } else {
        updates.approved_by = null;
        updates.approved_at = null;
      }

      await updateSupplierRecord(editRecord.id, updates);
      bsEditModalRef.current?.hide();
      setEditRecord(null);
      setAlert({ type: 'success', msg: 'Record updated successfully.' });
      loadRecords();
    } catch (err: unknown) {
      console.error('Edit failed:', err);
      const message = err instanceof Error ? err.message : '';
      if (message.includes('work_order_number') || message.includes('unique') || message.includes('duplicate')) {
        setAlert({ type: 'danger', msg: 'This Work Order Number already exists.' });
      } else {
        setAlert({ type: 'danger', msg: 'Failed to update record.' });
      }
    } finally {
      setEditSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const openDelete = (recordId: string) => {
    setDeleteRecordId(recordId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRecordId) return;
    setDeleteLoading(true);
    try {
      await deleteSupplierRecord(deleteRecordId);
      setDeleteModalOpen(false);
      setDeleteRecordId(null);
      setAlert({ type: 'success', msg: 'Record deleted successfully.' });
      loadRecords();
    } catch (err) {
      console.error('Delete failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to delete record.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  };

  const yearOptions = getFinancialYearOptions();

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <i className="bi bi-journal-text me-2"></i>Supplier Records
          </h1>
          <p className="text-muted mb-0">
            {totalCount} total record{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.msg}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Search & Filters Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">
            {/* Search */}
            <div className="col-12 col-md-4 col-lg-3">
              <label className="form-label small fw-medium mb-1">Search</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name or Work Order…"
                  defaultValue={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  id="records-search"
                />
              </div>
            </div>

            {/* Status filter */}
            <div className="col-6 col-md-3 col-lg-2">
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

            {/* District filter */}
            <div className="col-6 col-md-3 col-lg-2">
              <label className="form-label small fw-medium mb-1">District</label>
              <select
                className="form-select form-select-sm"
                value={districtFilter}
                onChange={(e) => handleDistrictChange(e.target.value)}
                id="filter-district"
              >
                <option value="">All Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Year filter */}
            <div className="col-6 col-md-2 col-lg-2">
              <label className="form-label small fw-medium mb-1">Financial Year</label>
              <select
                className="form-select form-select-sm"
                value={yearFilter}
                onChange={(e) => handleYearChange(e.target.value)}
                id="filter-year"
              >
                <option value="">All Financial Years</option>
                {yearOptions.map((y) => (
                  <option key={y.value} value={y.value}>{y.label}</option>
                ))}
              </select>
            </div>

            {/* Clear */}
            <div className="col-6 col-md-2 col-lg-1">
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

      {/* Records Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading records…" fullPage={false} />
          ) : records.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-0">No records found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" id="records-table">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Work Order</th>
                    <th>MIS Supplier Name</th>
                    <th>District</th>
                    <th>Area (Ha)</th>
                    <th>Total Cost</th>
                    <th>FY</th>
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
                      <td>
                        <small>{record.districts?.name ?? '—'}</small>
                      </td>
                      <td>{record.area_ha?.toFixed(2) ?? '—'}</td>
                      <td><small>₹{record.total_cost?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ?? '—'}</small></td>
                      <td><small>{getFinancialYearLabel(record.year)}</small></td>
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
                          {record.status === 'submitted' && (
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
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="View Details"
                            onClick={() => openView(record)}
                            type="button"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                            onClick={() => openEdit(record)}
                            type="button"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => openDelete(record.id)}
                            type="button"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
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

      {/* ── View Modal ──────────────────────────────────────────────────────── */}
      <div className="modal fade" ref={viewModalRef} id="viewRecordModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-eye me-2"></i>Supplier Record Details
              </h5>
              <button type="button" className="btn-close" onClick={() => bsViewModalRef.current?.hide()}></button>
            </div>
            <div className="modal-body p-4">
              {viewRecord && (
                <RecordDetailsPanel
                  record={viewRecord}
                  geography={{
                    district: viewRecord.districts?.name,
                    block: viewRecord.blocks?.name,
                    village: viewRecord.villages?.name,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ──────────────────────────────────────────────────────── */}
      <div className="modal fade" ref={editModalRef} id="editRecordModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-pencil-square me-2"></i>Edit Supplier Record
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => bsEditModalRef.current?.hide()}
              ></button>
            </div>
            <div className="modal-body p-4">
              {editRecord && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium small">Work Order Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="2526-GS-2704"
                      value={editData.work_order_number}
                      onChange={(e) => setEditData({ ...editData, work_order_number: e.target.value })}
                    />
                    <div className="form-text">Format: FY-PREFIX-SEQ (e.g. 2526-GS-2704). Financial year is derived from this.</div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium small">Farmer / MIS Supplier Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.mis_supplier_name}
                      onChange={(e) => setEditData({ ...editData, mis_supplier_name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium small">Area (Ha)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      value={editData.area_ha}
                      onChange={(e) => setEditData({ ...editData, area_ha: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium small">Type of MIS</label>
                    <select
                      className="form-select"
                      value={editData.type_of_mis}
                      onChange={(e) => setEditData({ ...editData, type_of_mis: e.target.value })}
                    >
                      <option value="">— Select —</option>
                      {MIS_TYPE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    {editData.type_of_mis === 'Other' && (
                      <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Specify type"
                        value={editData.type_of_mis_other}
                        onChange={(e) => setEditData({ ...editData, type_of_mis_other: e.target.value })}
                      />
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium small">Crop</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData.crop}
                      onChange={(e) => setEditData({ ...editData, crop: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Farmer Mobile No.</label>
                    <input
                      type="tel"
                      className="form-control"
                      maxLength={10}
                      value={editData.farmer_mobile_no}
                      onChange={(e) => setEditData({ ...editData, farmer_mobile_no: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Date of Application</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editData.date_of_application}
                      onChange={(e) => setEditData({ ...editData, date_of_application: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <hr className="my-1" />
                    <h6 className="fw-bold small">Cost Contribution Details</h6>
                    <CostFields
                      values={editCostValues}
                      onChange={setEditCostValues}
                      idPrefix="edit-"
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium small">Status</label>
                    <select
                      className="form-select"
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value as SupplierRecord['status'] })}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => bsEditModalRef.current?.hide()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEditSave}
                disabled={editSaving}
                id="save-edit-btn"
              >
                {editSaving ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</>
                ) : (
                  <><i className="bi bi-check-lg me-1"></i>Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      <ConfirmModal
        id="deleteRecordModal"
        title="Delete Record"
        message="Are you sure you want to delete this supplier record? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        isOpen={deleteModalOpen}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteModalOpen(false); setDeleteRecordId(null); }}
      />
    </div>
  );
}
