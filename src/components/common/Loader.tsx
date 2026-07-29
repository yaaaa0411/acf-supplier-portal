interface LoaderProps {
  message?: string;
  fullPage?: boolean;
}

/**
 * Reusable loading spinner using Bootstrap 5.
 * Supports full-page and inline modes.
 */
export function Loader({ message = 'Loading…', fullPage = true }: LoaderProps) {
  if (fullPage) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '100vh' }}
        role="status"
        aria-label="Loading"
      >
        <div
          className="spinner-border text-primary mb-3"
          style={{ width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">{message}</span>
        </div>
        <p className="text-muted fw-medium">{message}</p>
      </div>
    );
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5"
      role="status"
      aria-label="Loading"
    >
      <div className="spinner-border text-primary me-2">
        <span className="visually-hidden">{message}</span>
      </div>
      <span className="text-muted">{message}</span>
    </div>
  );
}
