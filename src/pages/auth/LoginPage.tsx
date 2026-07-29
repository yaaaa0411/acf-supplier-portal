import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from '../../components/common/Loader';
import { ROLE_DASHBOARD_ROUTES } from '../../types';

/**
 * Login page — Google Sign-In only.
 * Redirects authenticated users to their role's dashboard.
 */
export function LoginPage() {
  const { user, profile, loading, signInWithGoogle } = useAuth();

  if (loading) {
    return <Loader message="Loading…" />;
  }

  // Already authenticated and has profile → redirect to role dashboard
  if (user && profile) {
    return <Navigate to={ROLE_DASHBOARD_ROUTES[profile.role_name]} replace />;
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="acf-login-page d-flex align-items-center justify-content-center">
      <div className="acf-login-card card shadow-lg border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-4 p-md-5">
          {/* Branding */}
          <div className="text-center mb-4">
            <div className="acf-login-icon mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle">
              <i className="bi bi-building" style={{ fontSize: '2rem' }}></i>
            </div>
            <h1 className="h4 fw-bold text-dark mb-1">Ambuja Cement Foundation</h1>
            <p className="text-muted small mb-0">Management Portal</p>
          </div>

          <hr className="my-4" />

          {/* Google Sign-In Button */}
          <div className="d-grid">
            <button
              className="btn btn-outline-dark btn-lg d-flex align-items-center justify-content-center gap-2"
              onClick={handleGoogleLogin}
              type="button"
              id="google-sign-in-btn"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <p className="text-center text-muted small mt-4 mb-0">
            Use your organization Google account to sign in.
          </p>
        </div>
      </div>

      {/* Bottom branding */}
      <div className="position-fixed bottom-0 start-0 end-0 text-center pb-3">
        <small className="text-white-50">
          © {new Date().getFullYear()} Ambuja Cement Foundation
        </small>
      </div>
    </div>
  );
}
