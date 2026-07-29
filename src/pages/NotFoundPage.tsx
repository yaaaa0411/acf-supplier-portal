import { Link } from 'react-router-dom';

/**
 * 404 Not Found page.
 */
export function NotFoundPage() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center px-4"
      style={{ minHeight: '100vh' }}
    >
      <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
      <h2 className="h4 fw-bold text-dark mt-2 mb-3">Page Not Found</h2>
      <p className="text-muted mb-4" style={{ maxWidth: '400px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary px-4">
        <i className="bi bi-house-door me-2"></i>
        Back to Home
      </Link>
    </div>
  );
}
