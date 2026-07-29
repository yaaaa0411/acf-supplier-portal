import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '../../components/common/Loader';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  fetchAllUsers,
  fetchRoles,
  fetchPermissions,
  fetchRolePermissionIds,
  updateRolePermissions,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
  fetchAllDistricts,
} from '../../services/admin.service';
import type { UserProfile, Role, Permission, District } from '../../types';

const PAGE_SIZE = 10;

/**
 * Admin Users Page.
 * Manage users (create subadmin/supplier), edit, toggle active, assign permissions per role.
 */
export function AdminUsersPage() {
  // Data
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & search
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // Create user modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    id: '',
    email: '',
    full_name: '',
    role_id: '',
    district_id: '',
    phone: '',
  });
  const [createSaving, setCreateSaving] = useState(false);
  const createModalRef = useRef<HTMLDivElement>(null);
  const bsCreateRef = useRef<InstanceType<typeof import('bootstrap').Modal> | null>(null);

  // Edit user modal
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    role_id: '',
    district_id: '',
    phone: '',
    is_active: true,
  });
  const [editSaving, setEditSaving] = useState(false);
  const editModalRef = useRef<HTMLDivElement>(null);
  const bsEditRef = useRef<InstanceType<typeof import('bootstrap').Modal> | null>(null);

  // Permissions modal
  const [permRole, setPermRole] = useState<Role | null>(null);
  const [rolePermIds, setRolePermIds] = useState<string[]>([]);
  const [permSaving, setPermSaving] = useState(false);
  const permModalRef = useRef<HTMLDivElement>(null);
  const bsPermRef = useRef<InstanceType<typeof import('bootstrap').Modal> | null>(null);

  // Alert
  const [alert, setAlert] = useState<{ type: string; msg: string } | null>(null);

  // Delete user state
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Load data ──────────────────────────────────────────────────────────────

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAllUsers(currentPage, PAGE_SIZE, search || undefined);
      setUsers(result.data);
      setTotalCount(result.count);
    } catch (err) {
      console.error('Load users failed:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  useEffect(() => {
    Promise.all([fetchRoles(), fetchPermissions(), fetchAllDistricts()])
      .then(([r, p, d]) => { setRoles(r); setPermissions(p); setDistricts(d); })
      .catch(console.error);
  }, []);

  // ── Search ─────────────────────────────────────────────────────────────────

  const handleSearchChange = (value: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(value);
      setCurrentPage(1);
    }, 400);
  };

  // ── Bootstrap modal helpers ────────────────────────────────────────────────

  const getModal = async (
    ref: React.RefObject<HTMLDivElement | null>,
    bsRef: React.MutableRefObject<InstanceType<typeof import('bootstrap').Modal> | null>
  ) => {
    if (ref.current && !bsRef.current) {
      const bootstrap = await import('bootstrap');
      bsRef.current = new bootstrap.Modal(ref.current);
    }
    return bsRef.current;
  };

  // ── Create User ────────────────────────────────────────────────────────────

  const openCreate = async () => {
    setCreateForm({ id: '', email: '', full_name: '', role_id: '', district_id: '', phone: '' });
    setShowCreate(true);
    const modal = await getModal(createModalRef, bsCreateRef);
    modal?.show();
  };

  const handleCreate = async () => {
    if (!createForm.id || !createForm.email || !createForm.full_name || !createForm.role_id) {
      setAlert({ type: 'danger', msg: 'Please fill in all required fields (User ID, Email, Name, Role).' });
      return;
    }
    setCreateSaving(true);
    try {
      await createUserProfile({
        id: createForm.id,
        email: createForm.email,
        full_name: createForm.full_name,
        role_id: createForm.role_id,
        district_id: createForm.district_id || null,
        phone: createForm.phone || null,
      });
      bsCreateRef.current?.hide();
      setShowCreate(false);
      setAlert({ type: 'success', msg: 'User created successfully.' });
      loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create user.';
      setAlert({ type: 'danger', msg });
    } finally {
      setCreateSaving(false);
    }
  };

  // ── Edit User ──────────────────────────────────────────────────────────────

  const openEdit = async (user: UserProfile) => {
    setEditUser(user);
    setEditForm({
      full_name: user.full_name,
      role_id: user.role_id,
      district_id: user.district_id ?? '',
      phone: user.phone ?? '',
      is_active: user.is_active,
    });
    const modal = await getModal(editModalRef, bsEditRef);
    modal?.show();
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setEditSaving(true);
    try {
      await updateUserProfile(editUser.id, {
        full_name: editForm.full_name,
        role_id: editForm.role_id,
        district_id: editForm.district_id || null,
        phone: editForm.phone || null,
        is_active: editForm.is_active,
      });
      bsEditRef.current?.hide();
      setEditUser(null);
      setAlert({ type: 'success', msg: 'User updated successfully.' });
      loadUsers();
    } catch (err) {
      console.error('Edit user failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to update user.' });
    } finally {
      setEditSaving(false);
    }
  };

  // ── Permissions ────────────────────────────────────────────────────────────

  const openPermissions = async (role: Role) => {
    setPermRole(role);
    try {
      const ids = await fetchRolePermissionIds(role.id);
      setRolePermIds(ids);
    } catch { setRolePermIds([]); }
    const modal = await getModal(permModalRef, bsPermRef);
    modal?.show();
  };

  const togglePerm = (permId: string) => {
    setRolePermIds((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handlePermSave = async () => {
    if (!permRole) return;
    setPermSaving(true);
    try {
      await updateRolePermissions(permRole.id, rolePermIds);
      bsPermRef.current?.hide();
      setPermRole(null);
      setAlert({ type: 'success', msg: `Permissions updated for ${permRole.name} role.` });
    } catch (err) {
      console.error('Update permissions failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to update permissions.' });
    } finally {
      setPermSaving(false);
    }
  };

  // ── Delete User ────────────────────────────────────────────────────────────

  const openDelete = (userId: string) => {
    setDeleteUserId(userId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    setDeleteLoading(true);
    try {
      await deleteUserProfile(deleteUserId);
      setDeleteModalOpen(false);
      setDeleteUserId(null);
      setAlert({ type: 'success', msg: 'User profile deleted successfully.' });
      loadUsers();
    } catch (err) {
      console.error('Delete user failed:', err);
      setAlert({ type: 'danger', msg: 'Failed to delete user profile.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-danger';
      case 'subadmin': return 'bg-warning text-dark';
      default: return 'bg-info text-dark';
    }
  };

  // Group permissions by module for display
  const permsByModule: Record<string, Permission[]> = {};
  permissions.forEach((p) => {
    if (!permsByModule[p.module]) permsByModule[p.module] = [];
    permsByModule[p.module].push(p);
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <i className="bi bi-people me-2"></i>User Management
          </h1>
          <p className="text-muted mb-0">{totalCount} total user{totalCount !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} type="button" id="add-user-btn">
          <i className="bi bi-person-plus me-2"></i>Add User
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.msg}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      {/* Roles & Permissions Cards */}
      <div className="row g-3 mb-4">
        {roles.map((role) => (
          <div className="col-sm-6 col-lg-4" key={role.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <span className={`badge ${getRoleBadge(role.name)} me-2`}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                  </span>
                  <small className="text-muted">{role.description}</small>
                </div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openPermissions(role)}
                  type="button"
                  title="Manage permissions"
                >
                  <i className="bi bi-key me-1"></i>Permissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or email…"
                  defaultValue={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  id="users-search"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <Loader message="Loading users…" fullPage={false} />
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted mt-2 mb-0">No users found.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" id="users-table">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => (
                    <tr key={user.id}>
                      <td className="ps-3 text-muted small">
                        {(currentPage - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt=""
                              className="rounded-circle"
                              width="32"
                              height="32"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 text-primary fw-bold"
                              style={{ width: 32, height: 32, fontSize: '0.75rem' }}
                            >
                              {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          )}
                          <span className="fw-medium">{user.full_name}</span>
                        </div>
                      </td>
                      <td><small className="text-muted">{user.email}</small></td>
                      <td>
                        <span className={`badge ${getRoleBadge(user.role_name)}`}>
                          {user.role_name?.charAt(0).toUpperCase() + user.role_name?.slice(1)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(user)}
                          title="Edit user"
                          type="button"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger ms-1"
                          onClick={() => openDelete(user.id)}
                          title="Delete user"
                          type="button"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="card-footer bg-white border-top d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3">
            <small className="text-muted">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount}
            </small>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      {/* ── Create User Modal ─────────────────────────────────────────────── */}
      <div className="modal fade" ref={createModalRef} id="createUserModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-person-plus me-2"></i>Add User
              </h5>
              <button type="button" className="btn-close" onClick={() => bsCreateRef.current?.hide()}></button>
            </div>
            <div className="modal-body p-4">
              {showCreate && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium small">Auth User ID <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="UUID from auth.users"
                      value={createForm.id} onChange={(e) => setCreateForm({ ...createForm, id: e.target.value })} />
                    <div className="form-text">The user must have logged in via Google at least once.</div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Email <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" placeholder="user@example.com"
                      value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Full Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Full Name"
                      value={createForm.full_name} onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium small">Role <span className="text-danger">*</span></label>
                    <select className="form-select" value={createForm.role_id}
                      onChange={(e) => setCreateForm({ ...createForm, role_id: e.target.value })}>
                      <option value="">— Select —</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name.charAt(0).toUpperCase() + r.name.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium small">District</label>
                    <select className="form-select" value={createForm.district_id}
                      onChange={(e) => setCreateForm({ ...createForm, district_id: e.target.value })}>
                      <option value="">— None —</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Phone</label>
                    <input type="text" className="form-control" placeholder="Phone number"
                      value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={() => bsCreateRef.current?.hide()}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleCreate} disabled={createSaving} id="save-create-btn">
                {createSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating…</> : <><i className="bi bi-check-lg me-1"></i>Create User</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit User Modal ───────────────────────────────────────────────── */}
      <div className="modal fade" ref={editModalRef} id="editUserModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-pencil-square me-2"></i>Edit User
              </h5>
              <button type="button" className="btn-close" onClick={() => bsEditRef.current?.hide()}></button>
            </div>
            <div className="modal-body p-4">
              {editUser && (
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium small">Email</label>
                    <input type="email" className="form-control" value={editUser.email} disabled />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Full Name</label>
                    <input type="text" className="form-control" value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium small">Role</label>
                    <select className="form-select" value={editForm.role_id}
                      onChange={(e) => setEditForm({ ...editForm, role_id: e.target.value })}>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name.charAt(0).toUpperCase() + r.name.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-medium small">District</label>
                    <select className="form-select" value={editForm.district_id}
                      onChange={(e) => setEditForm({ ...editForm, district_id: e.target.value })}>
                      <option value="">— None —</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Phone</label>
                    <input type="text" className="form-control" value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="edit-active-switch"
                        checked={editForm.is_active}
                        onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })} />
                      <label className="form-check-label fw-medium small" htmlFor="edit-active-switch">
                        Account Active
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={() => bsEditRef.current?.hide()}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleEditSave} disabled={editSaving} id="save-edit-user-btn">
                {editSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : <><i className="bi bi-check-lg me-1"></i>Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Permissions Modal ─────────────────────────────────────────────── */}
      <div className="modal fade" ref={permModalRef} id="permissionsModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">
                <i className="bi bi-key me-2"></i>
                Permissions — {permRole?.name ? permRole.name.charAt(0).toUpperCase() + permRole.name.slice(1) : ''}
              </h5>
              <button type="button" className="btn-close" onClick={() => bsPermRef.current?.hide()}></button>
            </div>
            <div className="modal-body p-4">
              {Object.entries(permsByModule).map(([module, perms]) => (
                <div key={module} className="mb-4">
                  <h6 className="fw-bold text-uppercase text-muted small mb-2">
                    {module}
                  </h6>
                  <div className="row g-2">
                    {perms.map((perm) => (
                      <div className="col-12 col-md-6" key={perm.id}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`perm-${perm.id}`}
                            checked={rolePermIds.includes(perm.id)}
                            onChange={() => togglePerm(perm.id)}
                          />
                          <label className="form-check-label" htmlFor={`perm-${perm.id}`}>
                            <span className="fw-medium">{perm.name.replace(/_/g, ' ')}</span>
                            {perm.description && (
                              <small className="d-block text-muted">{perm.description}</small>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-footer border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={() => bsPermRef.current?.hide()}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handlePermSave} disabled={permSaving} id="save-perms-btn">
                {permSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : <><i className="bi bi-check-lg me-1"></i>Save Permissions</>}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      <ConfirmModal
        id="deleteUserModal"
        title="Delete User Profile"
        message="Are you sure you want to delete this user profile? The user will no longer be able to log in or access the system. This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
        isOpen={deleteModalOpen}
        loading={deleteLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteModalOpen(false); setDeleteUserId(null); }}
      />
    </div>
  );
}
