import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

interface NavbarProps {
  onToggleSidebar: () => void;
}

/**
 * Top navigation bar with ACF branding, user info, and sign-out.
 */
export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'User';
  const avatarUrl = (profile?.avatar_url || user?.user_metadata?.avatar_url) as string | undefined;
  const initials = getInitials(displayName);
  const roleBadge = profile?.role_name ?? '';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-dark acf-navbar sticky-top shadow-sm px-3">
      <div className="container-fluid">
        {/* Sidebar toggle (mobile) */}
        <button
          className="btn btn-link text-white d-lg-none me-2 p-0 border-0"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          id="sidebar-toggle-btn"
        >
          <i className="bi bi-list" style={{ fontSize: '1.5rem' }}></i>
        </button>

        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <i className="bi bi-building me-2" style={{ fontSize: '1.4rem' }}></i>
          <span className="d-none d-sm-inline">Ambuja Cement Foundation</span>
          <span className="d-sm-none">ACF</span>
        </Link>

        {/* Right side */}
        <ul className="navbar-nav ms-auto align-items-center">
          {/* Role badge */}
          {roleBadge && (
            <li className="nav-item d-none d-md-block me-3">
              <span className={`badge rounded-pill ${
                roleBadge === 'admin' ? 'bg-danger' :
                roleBadge === 'subadmin' ? 'bg-warning text-dark' :
                'bg-info text-dark'
              }`}>
                {roleBadge.charAt(0).toUpperCase() + roleBadge.slice(1)}
              </span>
            </li>
          )}

          {/* User dropdown */}
          <li className="nav-item dropdown">
            <button
              className="btn btn-link nav-link dropdown-toggle d-flex align-items-center gap-2 text-white text-decoration-none"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="rounded-circle"
                  width="32"
                  height="32"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span
                  className="d-flex align-items-center justify-content-center rounded-circle bg-white text-primary fw-bold"
                  style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
                >
                  {initials}
                </span>
              )}
              <span className="d-none d-md-inline">{displayName}</span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
              <li>
                <span className="dropdown-item-text">
                  <strong>{displayName}</strong>
                  <br />
                  <small className="text-muted">{user?.email}</small>
                </span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleSignOut} type="button">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign Out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
