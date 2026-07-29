import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RootRedirect } from './pages/RootRedirect';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRecordsPage } from './pages/admin/AdminRecordsPage';
import { SubadminDashboardPage } from './pages/subadmin/SubadminDashboardPage';
import { SubadminRecordsPage } from './pages/subadmin/SubadminRecordsPage';
import { SupplierDashboardPage } from './pages/supplier/SupplierDashboardPage';
import { SupplierEntryPage } from './pages/supplier/SupplierEntryPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Root redirect → role-based dashboard */}
            <Route path="/" element={<RootRedirect />} />

            {/* ── Admin routes ──────────────────────────────────── */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/records" element={<AdminRecordsPage />} />
              {/* Future: /admin/geography, /admin/reports */}
            </Route>

            {/* ── Subadmin routes ────────────────────────────────── */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['subadmin']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/subadmin/dashboard" element={<SubadminDashboardPage />} />
              <Route path="/subadmin/records" element={<SubadminRecordsPage />} />
            </Route>

            {/* ── Supplier routes ────────────────────────────────── */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['supplier']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/supplier/dashboard" element={<SupplierDashboardPage />} />
              <Route path="/supplier/entry" element={<SupplierEntryPage />} />
              {/* Future: /supplier/record */}
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
