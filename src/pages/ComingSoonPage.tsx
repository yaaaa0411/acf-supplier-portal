import { Link } from 'react-router-dom';

interface ComingSoonPageProps {
  title?: string;
  description?: string;
}

/**
 * Placeholder page for features under development.
 */
export function ComingSoonPage({
  title = 'Feature Coming Soon',
  description = 'This section is currently under development and will be available in an upcoming update.',
}: ComingSoonPageProps) {
  return (
    <div className="container-fluid py-5 text-center">
      <div className="card border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3">
            <i className="bi bi-tools" style={{ fontSize: '2.5rem' }}></i>
          </div>
          <h2 className="h4 fw-bold text-dark mb-2">{title}</h2>
          <p className="text-muted mb-4">{description}</p>
          <Link to="/" className="btn btn-primary px-4">
            <i className="bi bi-house-door me-2"></i>Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
