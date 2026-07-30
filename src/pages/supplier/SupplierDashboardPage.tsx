import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import { fetchSupplierRecords } from '../../services/data.service';
import type { SupplierRecord } from '../../types';
import { formatMoney } from '../../utils/costCalculations';
import { getFinancialYearLabel } from '../../utils/workOrder';

/**
 * Supplier Dashboard — lists submitted records and allows new entries.
 */
export function SupplierDashboardPage() {
  const { profile } = useAuth();
  const [records, setRecords] = useState<SupplierRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSupplierData = useCallback(async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const data = await fetchSupplierRecords(profile.id);
      setRecords(data);
    } catch (err) {
      console.error('Failed to load supplier records:', err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    loadSupplierData();
  }, [loadSupplierData]);

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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            Supplier Portal
          </h1>
          <p className="text-muted mb-0">Manage your work order submissions and remarks</p>
        </div>
        <Link to="/supplier/entry" className="btn btn-primary" id="new-submission-btn">
          <i className="bi bi-plus-lg me-2"></i>New Submission
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-journal-text" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Total Submissions</h6>
                <h3 className="fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  ) : (
                    records.length
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-clock-history" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Pending Review</h6>
                <h3 className="fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-warning"></span>
                  ) : (
                    records.filter((r) => r.status === 'submitted').length
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="mb-0 fw-bold">My Submissions</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading submissions…" fullPage={false} />
          ) : records.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-3">You have not submitted any entries yet.</p>
              <Link to="/supplier/entry" className="btn btn-primary btn-sm">
                Create First Entry
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" id="supplier-submissions-table">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Work Order</th>
                    <th>Farmer Name</th>
                    <th>Area (Ha)</th>
                    <th>Total Cost</th>
                    <th>FY</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr key={record.id}>
                      <td className="ps-3 text-muted small">{idx + 1}</td>
                      <td>
                        <span className="fw-medium">{record.work_order_number}</span>
                      </td>
                      <td>{record.mis_supplier_name}</td>
                      <td>{record.area_ha?.toFixed(2) ?? '—'}</td>
                      <td>₹{formatMoney(record.total_cost)}</td>
                      <td><small>{getFinancialYearLabel(record.year)}</small></td>
                      <td>
                        <small>{new Date(record.date_of_application).toLocaleDateString('en-IN')}</small>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(record.status)}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <Link
                          to={`/supplier/entry?id=${record.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-chat-left-text me-1"></i>
                          View / Add Remarks
                        </Link>
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
