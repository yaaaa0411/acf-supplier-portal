import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import {
  fetchRecordsForReports,
  fetchSupplierOptions,
  type ReportFilters,
  type ReportRecord,
} from '../../services/report.service';
import { downloadSupplierReportsPdf } from '../../services/pdfReport.service';
import { fetchRemarksByRecord } from '../../services/data.service';
import {
  fetchDistricts,
  fetchBlocksByDistrict,
  fetchVillagesByBlock,
} from '../../services/data.service';
import { fetchAllDistricts } from '../../services/admin.service';
import type { District, Block, Village } from '../../types';
import { formatMoney } from '../../utils/costCalculations';
import { getFinancialYearLabel } from '../../utils/workOrder';

interface ReportsPageProps {
  districtScope?: string;
}

/**
 * Reports page for generating filtered supplier PDF reports.
 * Used by both admin (all districts) and subadmin (district-scoped).
 */
export function ReportsPage({ districtScope }: ReportsPageProps) {
  const { hasPermission, profile } = useAuth();
  const canGenerate = hasPermission('view_reports');

  const effectiveDistrictScope =
    districtScope ??
    (profile?.role_name === 'subadmin' ? profile.district_id ?? undefined : undefined);

  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [districts, setDistricts] = useState<District[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; full_name: string; email: string }[]>([]);

  const [districtFilter, setDistrictFilter] = useState(effectiveDistrictScope ?? '');
  const [blockFilter, setBlockFilter] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [workOrderFilter, setWorkOrderFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');

  const [alert, setAlert] = useState<{ type: string; msg: string } | null>(null);

  const buildFilters = useCallback((): ReportFilters => {
    const filters: ReportFilters = {};
    if (districtFilter) filters.districtId = districtFilter;
    if (blockFilter) filters.blockId = blockFilter;
    if (villageFilter) filters.villageId = villageFilter;
    if (workOrderFilter.trim()) filters.workOrderNumber = workOrderFilter.trim();
    if (dateFrom) filters.dateFrom = dateFrom;
    if (dateTo) filters.dateTo = dateTo;
    if (supplierFilter) filters.supplierId = supplierFilter;
    return filters;
  }, [districtFilter, blockFilter, villageFilter, workOrderFilter, dateFrom, dateTo, supplierFilter]);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRecordsForReports(buildFilters(), {
        districtScope: effectiveDistrictScope,
      });
      setRecords(data);
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to load records:', err);
      setAlert({ type: 'danger', msg: 'Failed to load records for reports.' });
    } finally {
      setLoading(false);
    }
  }, [buildFilters, effectiveDistrictScope]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    const loadDistricts = async () => {
      if (effectiveDistrictScope) {
        const all = await fetchDistricts();
        setDistricts(all.filter((d) => d.id === effectiveDistrictScope));
        setDistrictFilter(effectiveDistrictScope);
      } else {
        setDistricts(await fetchAllDistricts());
      }
    };
    loadDistricts().catch(console.error);
  }, [effectiveDistrictScope]);

  useEffect(() => {
    fetchSupplierOptions(effectiveDistrictScope ?? (districtFilter || undefined))
      .then(setSuppliers)
      .catch(console.error);
  }, [effectiveDistrictScope, districtFilter]);

  useEffect(() => {
    if (!districtFilter) {
      setBlocks([]);
      setBlockFilter('');
      return;
    }
    fetchBlocksByDistrict(districtFilter)
      .then(setBlocks)
      .catch(console.error);
  }, [districtFilter]);

  useEffect(() => {
    if (!blockFilter) {
      setVillages([]);
      setVillageFilter('');
      return;
    }
    fetchVillagesByBlock(blockFilter)
      .then(setVillages)
      .catch(console.error);
  }, [blockFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === records.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(records.map((r) => r.id)));
    }
  };

  const generatePdf = async (recordList: ReportRecord[], filename: string) => {
    setGenerating(true);
    setAlert(null);
    try {
      const withRemarks = await Promise.all(
        recordList.map(async (record) => {
          const remarks = await fetchRemarksByRecord(record.id);
          const remarksText = remarks.length > 0
            ? remarks.map((r) => r.content).join('; ')
            : '';
          return { ...record, remarksText };
        })
      );

      downloadSupplierReportsPdf(withRemarks, filename);
      setAlert({
        type: 'success',
        msg: `PDF generated with ${recordList.length} report page${recordList.length !== 1 ? 's' : ''}.`,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to generate PDF report.' });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateSelected = async () => {
    if (selectedIds.size === 0) {
      setAlert({ type: 'warning', msg: 'Please select at least one record.' });
      return;
    }
    const selected = records.filter((r) => selectedIds.has(r.id));
    await generatePdf(selected, `supplier-reports-selected-${selected.length}.pdf`);
  };

  const handleGenerateAll = async () => {
    if (records.length === 0) {
      setAlert({ type: 'warning', msg: 'No records match the current filters.' });
      return;
    }
    await generatePdf(records, `supplier-reports-all-${records.length}.pdf`);
  };

  const clearFilters = () => {
    if (!effectiveDistrictScope) setDistrictFilter('');
    setBlockFilter('');
    setVillageFilter('');
    setWorkOrderFilter('');
    setDateFrom('');
    setDateTo('');
    setSupplierFilter('');
  };

  if (!canGenerate) {
    return (
      <div className="alert alert-warning">
        <i className="bi bi-shield-exclamation me-2"></i>
        You do not have permission to generate reports.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <i className="bi bi-file-earmark-pdf me-2"></i>
            Generate Reports
          </h1>
          <p className="text-muted mb-0">
            Generate print-ready PDF reports for supplier records
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleGenerateSelected}
            disabled={generating || selectedIds.size === 0}
            type="button"
          >
            {generating ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="bi bi-file-earmark-pdf me-2"></i>
            )}
            Generate Selected ({selectedIds.size})
          </button>
          <button
            className="btn btn-success"
            onClick={handleGenerateAll}
            disabled={generating || records.length === 0}
            type="button"
          >
            {generating ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="bi bi-files me-2"></i>
            )}
            Generate All Reports
          </button>
        </div>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.msg}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-bold">Report Filters</h5>
        </div>
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">
            {!effectiveDistrictScope && (
              <div className="col-6 col-md-3">
                <label className="form-label small fw-medium mb-1">District</label>
                <select
                  className="form-select form-select-sm"
                  value={districtFilter}
                  onChange={(e) => { setDistrictFilter(e.target.value); setBlockFilter(''); setVillageFilter(''); }}
                >
                  <option value="">All Districts</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="col-6 col-md-3">
              <label className="form-label small fw-medium mb-1">Block (Taluka)</label>
              <select
                className="form-select form-select-sm"
                value={blockFilter}
                onChange={(e) => { setBlockFilter(e.target.value); setVillageFilter(''); }}
                disabled={!districtFilter}
              >
                <option value="">All Blocks</option>
                {blocks.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-medium mb-1">Village</label>
              <select
                className="form-select form-select-sm"
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
                disabled={!blockFilter}
              >
                <option value="">All Villages</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-medium mb-1">Work Order Number</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. 2526-GS-2704"
                value={workOrderFilter}
                onChange={(e) => setWorkOrderFilter(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-medium mb-1">Date From</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-medium mb-1">Date To</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-medium mb-1">Supplier</label>
              <select
                className="form-select form-select-sm"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.full_name}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3">
              <button
                className="btn btn-outline-secondary btn-sm w-100"
                type="button"
                onClick={clearFilters}
              >
                <i className="bi bi-x-lg me-1"></i>Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">
            Matching Records ({records.length})
          </h5>
          <small className="text-muted">Each record = one PDF page</small>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading records…" fullPage={false} />
          ) : records.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-0">No records match the selected filters.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3" style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.size === records.length && records.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>Work Order</th>
                    <th>Farmer Name</th>
                    <th>Village</th>
                    <th>Area (Ha)</th>
                    <th>Total Cost</th>
                    <th>FY</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="ps-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedIds.has(record.id)}
                          onChange={() => toggleSelect(record.id)}
                        />
                      </td>
                      <td><span className="fw-medium">{record.work_order_number}</span></td>
                      <td>{record.mis_supplier_name}</td>
                      <td><small>{record.villages?.name ?? '—'}</small></td>
                      <td>{record.area_ha?.toFixed(2) ?? '—'}</td>
                      <td>₹{formatMoney(record.total_cost)}</td>
                      <td><small>{getFinancialYearLabel(record.year)}</small></td>
                      <td>
                        <small>
                          {new Date(record.date_of_application).toLocaleDateString('en-IN')}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
