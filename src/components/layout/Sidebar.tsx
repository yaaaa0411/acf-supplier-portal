import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { NavItem, UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar navigation items per role.
 */
const navItemsByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard',        path: '/admin/dashboard',  icon: 'bi-speedometer2' },
    { label: 'Manage Users',     path: '/admin/users',      icon: 'bi-people',         permission: 'manage_users' },
    { label: 'Supplier Records', path: '/admin/records',    icon: 'bi-journal-text',   permission: 'view_records' },
    { label: 'Geography',        path: '/admin/geography',  icon: 'bi-geo-alt',        permission: 'manage_geography' },
    { label: 'Reports',          path: '/admin/reports',    icon: 'bi-bar-chart-line', permission: 'view_reports' },
  ],
  subadmin: [
    { label: 'Dashboard',        path: '/subadmin/dashboard', icon: 'bi-speedometer2' },
    { label: 'Supplier Records', path: '/subadmin/records',   icon: 'bi-journal-text', permission: 'view_records' },
    { label: 'Reports',          path: '/subadmin/reports',   icon: 'bi-bar-chart-line', permission: 'view_reports' },
  ],
  supplier: [
    { label: 'Dashboard',  path: '/supplier/dashboard', icon: 'bi-speedometer2' },
    { label: 'Entry Form', path: '/supplier/entry',     icon: 'bi-pencil-square', permission: 'submit_records' },
    { label: 'My Record',  path: '/supplier/record',    icon: 'bi-journal-text',  permission: 'view_records' },
  ],
};

/**
 * Sidebar with role-based navigation.
 * Desktop: persistent side panel. Mobile: offcanvas overlay.
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { profile, hasPermission } = useAuth();

  const role = profile?.role_name ?? 'supplier';
  const items = navItemsByRole[role] ?? [];

  // Filter items by permission
  const visibleItems = items.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="offcanvas-backdrop fade show d-lg-none"
          onClick={onClose}
        ></div>
      )}

      <aside className={`acf-sidebar d-flex flex-column ${isOpen ? 'show' : ''}`} id="sidebar">
        {/* Close button (mobile only) */}
        <div className="d-flex justify-content-between align-items-center p-3 d-lg-none border-bottom">
          <span className="fw-bold text-primary">Menu</span>
          <button
            className="btn btn-link text-muted p-0 border-0"
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <i className="bi bi-x-lg" style={{ fontSize: '1.2rem' }}></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow-1 px-3 pt-3">
          <ul className="nav flex-column gap-1">
            {visibleItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path.endsWith('dashboard')}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 rounded px-3 py-2 ${
                      isActive ? 'acf-nav-active' : 'text-dark'
                    }`
                  }
                  onClick={onClose}
                >
                  <i className={`bi ${item.icon}`} style={{ fontSize: '1.1rem' }}></i>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-3 border-top">
          <small className="text-muted">
            © {new Date().getFullYear()} ACF
          </small>
        </div>
      </aside>
    </>
  );
}
