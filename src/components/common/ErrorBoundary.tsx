import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary with a user-friendly fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: '100vh' }}
        >
          <div className="text-center px-4" style={{ maxWidth: '480px' }}>
            <i
              className="bi bi-exclamation-triangle-fill text-warning"
              style={{ fontSize: '3.5rem' }}
            ></i>
            <h2 className="mt-3 fw-bold text-dark">Something went wrong</h2>
            <p className="text-muted mt-2">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {this.state.error && (
              <div className="alert alert-light text-start mt-3" role="alert">
                <small className="text-danger font-monospace">
                  {this.state.error.message}
                </small>
              </div>
            )}
            <button
              className="btn btn-primary mt-3 px-4"
              onClick={this.handleReload}
              type="button"
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
