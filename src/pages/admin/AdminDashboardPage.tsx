import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getGreeting } from '../../utils/helpers';
import { fetchDashboardStats, type DashboardStats } from '../../services/admin.service';

/**
 * Admin Dashboard — full system overview.
 */
export function AdminDashboardPage() {
  const { profile } = useAuth();
  const greeting = getGreeting();
  const displayName = profile?.full_name || 'Admin';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 fw-bold text-dark mb-1">
          {greeting}, {displayName}
        </h1>
        <p className="text-muted mb-0">Admin Dashboard — Full system overview</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-people-fill" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Total Users</h6>
                <h3 className="fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                  ) : (
                    stats?.totalUsers ?? 0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-success bg-opacity-10 text-success rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-journal-check" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Supplier Records</h6>
                <h3 className="fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-success"></span>
                  ) : (
                    stats?.totalRecords ?? 0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-warning bg-opacity-10 text-warning rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-geo-alt-fill" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Districts</h6>
                <h3 className="fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-warning"></span>
                  ) : (
                    stats?.totalDistricts ?? 0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm h-100 acf-stat-card">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="acf-stat-icon bg-info bg-opacity-10 text-info rounded-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-clock-history" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 small fw-medium">Pending Approvals</h6>
                <h3 className="fw-bold mb-0">
                  {loading ? (
                    <span className="spinner-border spinner-border-sm text-info"></span>
                  ) : (
                    stats?.pendingRecords ?? 0
                  )}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-bold">Quick Actions</h5>
        </div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-auto">
              <a href="/admin/users" className="btn btn-outline-primary">
                <i className="bi bi-person-plus me-1"></i> Add User
              </a>
            </div>
            <div className="col-auto">
              <a href="/admin/records" className="btn btn-outline-success">
                <i className="bi bi-journal-text me-1"></i> View Supplier Records
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
