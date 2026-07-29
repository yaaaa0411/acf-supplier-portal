import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Unauthorized page — shown when a user has no profile or is deactivated.
 */
export function UnauthorizedPage() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center px-4"
      style={{ minHeight: '100vh' }}
    >
      <i className="bi bi-shield-lock-fill text-danger" style={{ fontSize: '4rem' }}></i>
      <h1 className="h3 fw-bold text-dark mt-3 mb-2">Access Denied</h1>
      <p className="text-muted mb-4" style={{ maxWidth: '440px' }}>
        Your account (<strong>{user?.email}</strong>) has not been granted access to this
        application. Please contact your administrator to request access.
      </p>
      <div className="d-flex gap-2">
        <Link to="/login" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Login
        </Link>
        <button className="btn btn-outline-danger" onClick={handleSignOut} type="button">
          <i className="bi bi-box-arrow-right me-2"></i>
          Sign Out
        </button>
      </div>
    </div>
  );
}
