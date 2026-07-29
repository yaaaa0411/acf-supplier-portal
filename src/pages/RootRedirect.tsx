import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/common/Loader';
import { ROLE_DASHBOARD_ROUTES } from '../types';

/**
 * Root redirect — sends authenticated users to their role dashboard.
 */
export function RootRedirect() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <Loader message="Loading…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Navigate to={ROLE_DASHBOARD_ROUTES[profile.role_name]} replace />;
}
