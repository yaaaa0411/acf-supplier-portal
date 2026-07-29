import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import {
  fetchDistricts,
  fetchBlocksByDistrict,
  fetchVillagesByBlock,
  fetchSupplierRecordById,
  createSupplierRecord,
  fetchRemarksByRecord,
  createRemark,
} from '../../services/data.service';
import type { District, Block, Village, SupplierRecord, Remark, WorkOrderPrefix } from '../../types';
import { WORK_ORDER_PREFIXES } from '../../types';

/**
 * Generate year options from 2020 to current year + 1.
 */
function getYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear + 1; y >= 2020; y--) {
    years.push(String(y));
  }
  return years;
}

/**
 * Supplier Entry Form.
 *
 * - Allows multiple submissions by same supplier.
 * - Saves a new record if no ID in URL parameters.
 * - Loads a specific record as read-only if ID is specified.
 */
export function SupplierEntryPage() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recordId = searchParams.get('id');

  // Existing record (null = not yet submitted)
  const [existingRecord, setExistingRecord] = useState<SupplierRecord | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Form fields
  const [workOrderPrefix, setWorkOrderPrefix] = useState<WorkOrderPrefix>('GS');
  const [workOrderNumber, setWorkOrderNumber] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [villageId, setVillageId] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [misSupplierName, setMisSupplierName] = useState('');
  const [dateOfApplication, setDateOfApplication] = useState('');
  const [formRemarks, setFormRemarks] = useState('');

  // Dropdown data
  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // Remarks
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [newRemark, setNewRemark] = useState('');
  const [remarkSubmitting, setRemarkSubmitting] = useState(false);

  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const yearOptions = getYearOptions();

  // ── Load initial data ─────────────────────────────────────────────────────

  const loadInitialData = useCallback(async () => {
    if (!profile) return;
    try {
      setPageLoading(true);

      // Load districts
      const districtData = await fetchDistricts();
      setDistricts(districtData);

      // If record ID is provided, load that specific record
      if (recordId) {
        const record = await fetchSupplierRecordById(recordId);
        if (record) {
          // Double check access: record supplier must be the logged-in user
          if (record.supplier_id !== profile.id) {
            navigate('/unauthorized');
            return;
          }

          setExistingRecord(record);
          setHasSubmitted(true);

          // Pre-fill form with existing data (parse combined work_order_number)
          const prefixes: WorkOrderPrefix[] = ['GS', 'AML', 'CTU', 'JND'];
          let detectedPrefix: WorkOrderPrefix = 'GS';
          let detectedNumber = record.work_order_number;

          for (const p of prefixes) {
            if (record.work_order_number.startsWith(p)) {
              detectedPrefix = p;
              detectedNumber = record.work_order_number.substring(p.length);
              break;
            }
          }

          setWorkOrderPrefix(detectedPrefix);
          setWorkOrderNumber(detectedNumber);
          setDistrictId(record.district_id);
          setYear(record.year);
          setMisSupplierName(record.mis_supplier_name);
          setDateOfApplication(record.date_of_application);

          // Load blocks for the existing district
          const blockData = await fetchBlocksByDistrict(record.district_id);
          setBlocks(blockData);
          setBlockId(record.block_id);

          // Load villages for the existing block
          const villageData = await fetchVillagesByBlock(record.block_id);
          setVillages(villageData);
          setVillageId(record.village_id);

          // Load remarks
          const remarkData = await fetchRemarksByRecord(record.id);
          setRemarks(remarkData);
        } else {
          // Record not found
          navigate('/supplier/dashboard');
        }
      } else {
        // New record form, reset state
        setExistingRecord(null);
        setHasSubmitted(false);
        setWorkOrderPrefix('GS');
        setWorkOrderNumber('');
        setDistrictId('');
        setBlockId('');
        setVillageId('');
        setYear(String(new Date().getFullYear()));
        setMisSupplierName(profile.full_name || '');
        setDateOfApplication(new Date().toISOString().substring(0, 10));
        setFormRemarks('');
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setPageLoading(false);
    }
  }, [profile, recordId, navigate]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // ── Cascading dropdowns ───────────────────────────────────────────────────

  const handleDistrictChange = async (newDistrictId: string) => {
    setDistrictId(newDistrictId);
    setBlockId('');
    setVillageId('');
    setBlocks([]);
    setVillages([]);

    if (newDistrictId) {
      try {
        const blockData = await fetchBlocksByDistrict(newDistrictId);
        setBlocks(blockData);
      } catch (err) {
        console.error('Failed to load blocks:', err);
      }
    }
  };

  const handleBlockChange = async (newBlockId: string) => {
    setBlockId(newBlockId);
    setVillageId('');
    setVillages([]);

    if (newBlockId) {
      try {
        const villageData = await fetchVillagesByBlock(newBlockId);
        setVillages(villageData);
      } catch (err) {
        console.error('Failed to load villages:', err);
      }
    }
  };

  // ── Form submission ───────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || hasSubmitted) return;

    // Validate
    if (!workOrderNumber.trim()) { setError('Work Order Number is required.'); return; }
    if (!/^\d+$/.test(workOrderNumber.trim())) {
      setError('Unique Number must contain only digits.');
      return;
    }
    if (!districtId) { setError('Please select a District.'); return; }
    if (!blockId) { setError('Please select a Block.'); return; }
    if (!villageId) { setError('Please select a Village.'); return; }
    if (!year) { setError('Please select a Year.'); return; }
    if (!misSupplierName.trim()) { setError('MIS Supplier Name is required.'); return; }
    if (!dateOfApplication) { setError('Date of Application is required.'); return; }

    setError(null);
    setSubmitting(true);

    try {
      const record = await createSupplierRecord({
        supplier_id: profile.id,
        work_order_number: workOrderPrefix + workOrderNumber.trim(),
        district_id: districtId,
        block_id: blockId,
        village_id: villageId,
        year,
        mis_supplier_name: misSupplierName.trim(),
        date_of_application: dateOfApplication,
      });

      // If remarks were included with submission, create them
      if (formRemarks.trim()) {
        await createRemark(record.id, profile.id, formRemarks.trim());
        const remarkData = await fetchRemarksByRecord(record.id);
        setRemarks(remarkData);
      }

      setExistingRecord(record);
      setHasSubmitted(true);
      setSuccess('Your entry has been submitted successfully!');
      
      // Auto-redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/supplier/dashboard');
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      if (message.includes('supplier_records_work_order_number_key') || message.includes('work_order_number') || message.toLowerCase().includes('duplicate key value violates unique constraint')) {
        setError('This Work Order Number already exists. Please enter a different unique number.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Add remark (post-submission) ──────────────────────────────────────────

  const handleAddRemark = async () => {
    if (!profile || !existingRecord || !newRemark.trim()) return;

    setRemarkSubmitting(true);
    try {
      await createRemark(existingRecord.id, profile.id, newRemark.trim());
      const remarkData = await fetchRemarksByRecord(existingRecord.id);
      setRemarks(remarkData);
      setNewRemark('');
    } catch (err) {
      console.error('Failed to add remark:', err);
    } finally {
      setRemarkSubmitting(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────

  if (pageLoading) {
    return <Loader message="Loading entry form…" fullPage={false} />;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const isReadOnly = hasSubmitted;

  return (
    <div>
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <i className="bi bi-pencil-square me-2"></i>
            Supplier Entry Form
          </h1>
          <p className="text-muted mb-0">
            {hasSubmitted
              ? 'Your entry has been submitted. The form is now read-only.'
              : 'Fill in your details and submit.'}
          </p>
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/supplier/dashboard')}
          type="button"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {/* Submission status badge */}
      {hasSubmitted && existingRecord && (
        <div className="mb-4">
          <span className={`badge fs-6 ${
            existingRecord.status === 'approved' ? 'bg-success' :
            existingRecord.status === 'rejected' ? 'bg-danger' :
            'bg-warning text-dark'
          }`}>
            <i className={`bi me-1 ${
              existingRecord.status === 'approved' ? 'bi-check-circle' :
              existingRecord.status === 'rejected' ? 'bi-x-circle' :
              'bi-clock'
            }`}></i>
            Status: {existingRecord.status.charAt(0).toUpperCase() + existingRecord.status.slice(1)}
          </span>
        </div>
      )}

      {/* Entry Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-bold">Entry Details</h5>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Work Order Number */}
            <div className="mb-3">
              <label className="form-label fw-medium">
                Work Order Number <span className="text-danger">*</span>
              </label>
              <div className="row g-2">
                <div className="col-auto" style={{ minWidth: '120px' }}>
                  <select
                    className="form-select"
                    value={workOrderPrefix}
                    onChange={(e) => setWorkOrderPrefix(e.target.value as WorkOrderPrefix)}
                    disabled={isReadOnly}
                    id="work-order-prefix"
                  >
                    {WORK_ORDER_PREFIXES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter unique number"
                    value={workOrderNumber}
                    onChange={(e) => setWorkOrderNumber(e.target.value)}
                    disabled={isReadOnly}
                    id="work-order-number"
                  />
                </div>
              </div>
              {(workOrderPrefix || workOrderNumber) && (
                <div className="form-text">
                  Work Order: <strong>{workOrderPrefix}{workOrderNumber || '___'}</strong>
                </div>
              )}
            </div>

            {/* District */}
            <div className="mb-3">
              <label htmlFor="district-select" className="form-label fw-medium">
                District <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="district-select"
                value={districtId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                disabled={isReadOnly}
              >
                <option value="">— Select District —</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Block */}
            <div className="mb-3">
              <label htmlFor="block-select" className="form-label fw-medium">
                Block <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="block-select"
                value={blockId}
                onChange={(e) => handleBlockChange(e.target.value)}
                disabled={isReadOnly || !districtId}
              >
                <option value="">— Select Block —</option>
                {blocks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              {!districtId && (
                <div className="form-text">Select a district first.</div>
              )}
            </div>

            {/* Village */}
            <div className="mb-3">
              <label htmlFor="village-select" className="form-label fw-medium">
                Village <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="village-select"
                value={villageId}
                onChange={(e) => setVillageId(e.target.value)}
                disabled={isReadOnly || !blockId}
              >
                <option value="">— Select Village —</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              {!blockId && (
                <div className="form-text">Select a block first.</div>
              )}
            </div>

            {/* Year */}
            <div className="mb-3">
              <label htmlFor="year-select" className="form-label fw-medium">
                Year <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="year-select"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={isReadOnly}
              >
                <option value="">— Select Year —</option>
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* MIS Supplier Name */}
            <div className="mb-3">
              <label htmlFor="mis-supplier-name" className="form-label fw-medium">
                MIS Supplier Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="mis-supplier-name"
                placeholder="Enter MIS Supplier Name"
                value={misSupplierName}
                onChange={(e) => setMisSupplierName(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            {/* Date of Application */}
            <div className="mb-3">
              <label htmlFor="date-of-application" className="form-label fw-medium">
                Date of Application <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                id="date-of-application"
                value={dateOfApplication}
                onChange={(e) => setDateOfApplication(e.target.value)}
                disabled={isReadOnly}
              />
            </div>

            {/* Remarks (with initial submission only) */}
            {!hasSubmitted && (
              <div className="mb-4">
                <label htmlFor="form-remarks" className="form-label fw-medium">
                  Remarks <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <textarea
                  className="form-control"
                  id="form-remarks"
                  rows={3}
                  placeholder="Add any remarks…"
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                ></textarea>
              </div>
            )}

            {/* Submit Button */}
            {!hasSubmitted && (
              <div className="d-grid d-md-block">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-5"
                  disabled={submitting}
                  id="submit-entry-btn"
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Submit Entry
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Remarks Section (always visible after submission) */}
      {hasSubmitted && existingRecord && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-chat-left-text me-2"></i>
              Remarks
            </h5>
            <span className="badge bg-secondary">{remarks.length}</span>
          </div>
          <div className="card-body p-4">
            {/* Add new remark */}
            <div className="mb-4">
              <div className="input-group">
                <textarea
                  className="form-control"
                  placeholder="Add a remark…"
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  rows={2}
                  id="new-remark-input"
                ></textarea>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleAddRemark}
                  disabled={remarkSubmitting || !newRemark.trim()}
                  id="add-remark-btn"
                >
                  {remarkSubmitting ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <i className="bi bi-send"></i>
                  )}
                </button>
              </div>
            </div>

            {/* Remarks list */}
            {remarks.length === 0 ? (
              <p className="text-muted text-center mb-0">No remarks yet.</p>
            ) : (
              <div className="list-group list-group-flush">
                {remarks.map((remark) => (
                  <div key={remark.id} className="list-group-item px-0 border-start-0 border-end-0">
                    <p className="mb-1">{remark.content}</p>
                    <small className="text-muted">
                      {new Date(remark.created_at).toLocaleString('en-IN')}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
