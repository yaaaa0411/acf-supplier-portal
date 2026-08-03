import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import {
  CostFields,
  costValuesFromRecord,
  getCalculatedCostValues,
  type CostFieldValues,
} from '../../components/supplier/CostFields';
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
import { WORK_ORDER_PREFIXES, MIS_TYPE_OPTIONS } from '../../types';
import { getFinancialYearCode, getFinancialYearOptions, extractReceiptNumber, parseWorkOrderNumber } from '../../utils/workOrder';
import { RecordDetailsPanel } from '../../components/supplier/RecordDetailsPanel';

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

  const [existingRecord, setExistingRecord] = useState<SupplierRecord | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [workOrderPrefix, setWorkOrderPrefix] = useState<WorkOrderPrefix>('GS');
  const [financialYear, setFinancialYear] = useState(getFinancialYearCode());
  const [workOrderSeq, setWorkOrderSeq] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [villageId, setVillageId] = useState('');
  const [misSupplierName, setMisSupplierName] = useState('');
  const [dateOfApplication, setDateOfApplication] = useState('');
  const [areaHa, setAreaHa] = useState('');
  const [typeOfMis, setTypeOfMis] = useState('');
  const [typeOfMisOther, setTypeOfMisOther] = useState('');
  const [crop, setCrop] = useState('');
  const [farmerMobileNo, setFarmerMobileNo] = useState('');
  const [costValues, setCostValues] = useState<CostFieldValues>({
    totalMisCostGgrc: '',
    acfContribution: '',
    companyShare: '',
    governmentContribution: '',
  });
  const [formRemarks, setFormRemarks] = useState('');

  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [newRemark, setNewRemark] = useState('');
  const [remarkSubmitting, setRemarkSubmitting] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const financialYearOptions = getFinancialYearOptions();

  const loadInitialData = useCallback(async () => {
    if (!profile) return;
    try {
      setPageLoading(true);

      const districtData = await fetchDistricts();
      setDistricts(districtData);

      if (recordId) {
        const record = await fetchSupplierRecordById(recordId);
        if (record) {
          if (record.supplier_id !== profile.id) {
            navigate('/unauthorized');
            return;
          }

          setExistingRecord(record);
          setHasSubmitted(true);
          const parsed = parseWorkOrderNumber(record.work_order_number);
          if (parsed) {
            setFinancialYear(parsed.financialYear);
            setWorkOrderPrefix(parsed.prefix);
            setWorkOrderSeq(parsed.sequence);
          } else {
            setWorkOrderPrefix(
              (record.work_order_number.match(/-(GS|AMR|CTU|JND|AMD)-/)?.[1] as WorkOrderPrefix) ?? 'GS'
            );
            setFinancialYear(record.year || getFinancialYearCode());
            setWorkOrderSeq('');
          }
          setDistrictId(record.district_id);
          setMisSupplierName(record.mis_supplier_name);
          setDateOfApplication(record.date_of_application);
          setAreaHa(record.area_ha?.toString() ?? '');
          setCrop(record.crop ?? '');
          setFarmerMobileNo(record.farmer_mobile_no ?? '');

          const misType = record.type_of_mis ?? '';
          const knownMis = MIS_TYPE_OPTIONS.find((o) => o.value === misType && o.value !== 'Other');
          if (knownMis) {
            setTypeOfMis(misType);
            setTypeOfMisOther('');
          } else if (misType) {
            setTypeOfMis('Other');
            setTypeOfMisOther(misType);
          }

          setCostValues(costValuesFromRecord(record));

          const blockData = await fetchBlocksByDistrict(record.district_id);
          setBlocks(blockData);
          setBlockId(record.block_id);

          const villageData = await fetchVillagesByBlock(record.block_id);
          setVillages(villageData);
          setVillageId(record.village_id);

          const remarkData = await fetchRemarksByRecord(record.id);
          setRemarks(remarkData);
        } else {
          navigate('/supplier/dashboard');
        }
      } else {
        setExistingRecord(null);
        setHasSubmitted(false);
        setWorkOrderPrefix('GS');
        setFinancialYear(getFinancialYearCode());
        setWorkOrderSeq('');
        setDistrictId('');
        setBlockId('');
        setVillageId('');
        setMisSupplierName(profile.full_name || '');
        setDateOfApplication(new Date().toISOString().substring(0, 10));
        setAreaHa('');
        setTypeOfMis('');
        setTypeOfMisOther('');
        setCrop('');
        setFarmerMobileNo('');
        setCostValues({
          totalMisCostGgrc: '',
          acfContribution: '',
          companyShare: '',
          governmentContribution: '',
        });
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

  const resolvedMisType = typeOfMis === 'Other' ? typeOfMisOther.trim() : typeOfMis;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || hasSubmitted) return;

    if (!workOrderSeq.trim()) { setError('Work Order Number is required.'); return; }
    if (!/^\d+$/.test(workOrderSeq.trim())) { setError('Work Order Number must contain only digits.'); return; }
    if (!districtId) { setError('Please select a District.'); return; }
    if (!blockId) { setError('Please select a Block.'); return; }
    if (!villageId) { setError('Please select a Village.'); return; }
    if (!misSupplierName.trim()) { setError('MIS Supplier Name is required.'); return; }
    if (!dateOfApplication) { setError('Date of Application is required.'); return; }
    if (!areaHa || parseFloat(areaHa) <= 0) { setError('Area (Ha) is required and must be greater than 0.'); return; }
    if (!resolvedMisType) { setError('Type of MIS is required.'); return; }
    if (!crop.trim()) { setError('Crop is required.'); return; }
    if (!/^\d{10}$/.test(farmerMobileNo.trim())) {
      setError('Farmer Mobile No. must be exactly 10 digits.');
      return;
    }

    const costs = getCalculatedCostValues(costValues);
    if (costs.total_mis_cost_ggrc <= 0) {
      setError('Total MIS Cost by GGRC is required.');
      return;
    }

    const workOrderNumber = `${financialYear}-${workOrderPrefix}-${workOrderSeq.trim()}`;
    const receiptNumber = workOrderSeq.trim().padStart(4, '0');

    setError(null);
    setSubmitting(true);

    try {
      const record = await createSupplierRecord({
        supplier_id: profile.id,
        work_order_number: workOrderNumber,
        district_id: districtId,
        block_id: blockId,
        village_id: villageId,
        year: financialYear,
        mis_supplier_name: misSupplierName.trim(),
        date_of_application: dateOfApplication,
        area_ha: parseFloat(areaHa),
        type_of_mis: resolvedMisType,
        crop: crop.trim(),
        farmer_mobile_no: farmerMobileNo.trim(),
        total_mis_cost_ggrc: costs.total_mis_cost_ggrc,
        farmers_contribution: costs.farmers_contribution,
        acf_contribution: costs.acf_contribution,
        company_share: costs.company_share,
        government_contribution: costs.government_contribution,
        total_cost: costs.total_cost,
        receipt_number: receiptNumber,
      });

      if (formRemarks.trim()) {
        await createRemark(record.id, profile.id, formRemarks.trim());
        const remarkData = await fetchRemarksByRecord(record.id);
        setRemarks(remarkData);
      }

      setExistingRecord(record);
      setHasSubmitted(true);
      setSuccess(`Your entry has been submitted successfully! Work Order: ${workOrderNumber}`);

      setTimeout(() => {
        navigate('/supplier/dashboard');
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      if (message.includes('work_order_number') || message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
        setError('This Work Order Number already exists. Please use a different number.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

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

  if (pageLoading) {
    return <Loader message="Loading entry form…" fullPage={false} />;
  }

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
              {isReadOnly ? (
                <input
                  type="text"
                  className="form-control bg-light"
                  value={existingRecord?.work_order_number || ''}
                  readOnly
                />
              ) : (
                <>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <label className="form-label small text-muted mb-1">Financial Year</label>
                      <select
                        className="form-select"
                        value={financialYear}
                        onChange={(e) => setFinancialYear(e.target.value)}
                        id="financial-year-select"
                      >
                        {financialYearOptions.map((fy) => (
                          <option key={fy.value} value={fy.value}>{fy.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-muted mb-1">Prefix</label>
                      <select
                        className="form-select"
                        value={workOrderPrefix}
                        onChange={(e) => setWorkOrderPrefix(e.target.value as WorkOrderPrefix)}
                        id="work-order-prefix"
                      >
                        {WORK_ORDER_PREFIXES.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-muted mb-1">Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="work-order-seq"
                        placeholder="e.g. 2704"
                        value={workOrderSeq}
                        onChange={(e) => setWorkOrderSeq(e.target.value.replace(/\D/g, ''))}
                        inputMode="numeric"
                      />
                    </div>
                  </div>
                  <div className="form-text">
                    Work Order: <strong>{financialYear}-{workOrderPrefix}-{workOrderSeq || '____'}</strong> — must be unique
                  </div>
                </>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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

              <div className="col-md-6 mb-3">
                <label htmlFor="block-select" className="form-label fw-medium">
                  Taluka <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="block-select"
                  value={blockId}
                  onChange={(e) => handleBlockChange(e.target.value)}
                  disabled={isReadOnly || !districtId}
                >
                  <option value="">— Select Taluka —</option>
                  {blocks.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
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
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="mis-supplier-name" className="form-label fw-medium">
                  Farmer / MIS Supplier Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="mis-supplier-name"
                  placeholder="Enter farmer name"
                  value={misSupplierName}
                  onChange={(e) => setMisSupplierName(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="area-ha" className="form-label fw-medium">
                  Area (Ha) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  id="area-ha"
                  placeholder="0.00"
                  value={areaHa}
                  onChange={(e) => setAreaHa(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="type-of-mis" className="form-label fw-medium">
                  Type of MIS <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="type-of-mis"
                  value={typeOfMis}
                  onChange={(e) => setTypeOfMis(e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="">— Select Type —</option>
                  {MIS_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {typeOfMis === 'Other' && (
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Specify type of MIS"
                    value={typeOfMisOther}
                    onChange={(e) => setTypeOfMisOther(e.target.value)}
                    disabled={isReadOnly}
                  />
                )}
              </div>

              <div className="col-md-4 mb-3">
                <label htmlFor="crop" className="form-label fw-medium">
                  Crop <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="crop"
                  placeholder="Enter crop name"
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="farmer-mobile" className="form-label fw-medium">
                  Farmer Mobile No. <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="farmer-mobile"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={farmerMobileNo}
                  onChange={(e) => setFarmerMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={isReadOnly}
                />
              </div>

              <div className="col-md-6 mb-3">
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
            </div>

            <hr className="my-4" />
            <h6 className="fw-bold mb-3">Cost Contribution Details</h6>

            <CostFields
              values={costValues}
              onChange={setCostValues}
              disabled={isReadOnly}
            />

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

      {hasSubmitted && existingRecord && (
        <>
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0 fw-bold">Record Summary</h5>
            </div>
            <div className="card-body">
              <RecordDetailsPanel
                record={existingRecord}
                geography={{
                  district: districts.find((d) => d.id === existingRecord.district_id)?.name,
                  block: blocks.find((b) => b.id === existingRecord.block_id)?.name,
                  village: villages.find((v) => v.id === existingRecord.village_id)?.name,
                }}
              />
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-chat-left-text me-2"></i>
                Remarks
              </h5>
              <span className="badge bg-secondary">{remarks.length}</span>
            </div>
            <div className="card-body p-4">
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
        </>
      )}
    </div>
  );
}
