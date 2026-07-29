import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from './Loader';
import type { ReactNode } from 'react';
import type { UserRole } from '../../types';
import { ROLE_DASHBOARD_ROUTES } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  /** If set, only users with one of these roles can access this route. */
  allowedRoles?: UserRole[];
  /** If set, user must have this permission to access the route. */
  requiredPermission?: string;
}

/**
 * Route guard component with multi-layer protection:
 *
 * 1. Unauthenticated → /login
 * 2. No profile row (not registered by admin) → /unauthorized
 * 3. Profile deactivated → /unauthorized
 * 4. Role not in allowedRoles → redirect to user's own dashboard
 * 5. Missing requiredPermission → redirect to user's own dashboard
 */
export function ProtectedRoute({ children, allowedRoles, requiredPermission }: ProtectedRouteProps) {
  const { user, profile, loading, hasPermission } = useAuth();

  if (loading) {
    return <Loader message="Checking authentication…" />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but no profile (not registered in user_profiles by admin)
  if (!profile) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Account deactivated
  if (!profile.is_active) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Role-based gate
  if (allowedRoles && !allowedRoles.includes(profile.role_name)) {
    const targetRoute = ROLE_DASHBOARD_ROUTES[profile.role_name];
    return <Navigate to={targetRoute} replace />;
  }

  // Permission-based gate
  if (requiredPermission && !hasPermission(requiredPermission)) {
    const targetRoute = ROLE_DASHBOARD_ROUTES[profile.role_name];
    return <Navigate to={targetRoute} replace />;
  }

  return <>{children}</>;
}
