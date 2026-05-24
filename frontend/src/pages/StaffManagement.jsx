import { useState, useEffect } from 'react';
import {
  UserPlus, Edit, Trash2, Search, Mail, Phone, X,
  Plus, Check, Users, RefreshCw, Sliders
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function StaffManagement({ user, staffList = [], setStaffList, fetchStaff, showToast }) {
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modals
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | null
  const [editingStaff, setEditingStaff] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  // Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [roleType, setRoleType] = useState('Mobiliser');



  const handleOpenAddModal = () => {
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setRoleType('Mobiliser');
    setApiMessage(null);
    setModalType('add');
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setUsername(staff.username || '');
    setEmail(staff.email || '');
    setPhone(staff.phone || '');
    setPassword(''); // blank means no change
    setRoleType(staff.userType || 'Mobiliser');
    setApiMessage(null);
    setModalType('edit');
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const cleanPhone = phone.trim().replace(/^(\+91|91)/, '').replace(/[\s-()]/g, '');

    if (!trimmedUser || !trimmedEmail || !trimmedPassword) {
      showToast('Username, email, and password are required.', 'warning');
      return;
    }

    if (trimmedUser.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmedUser)) {
      showToast('Username must be at least 3 characters and contain only letters, numbers, and underscores.', 'warning');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }

    if (trimmedPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    if (phone.trim() && !/^\d{10}$/.test(cleanPhone)) {
      showToast('Phone Number must be exactly 10 digits.', 'warning');
      return;
    }

    const payload = {
      username: trimmedUser,
      email: trimmedEmail,
      password: trimmedPassword,
      phone: phone.trim() ? cleanPhone : null,
      userType: roleType
    };

    const mockId = `temp-${Date.now()}`;
    const optimisticStaff = {
      ...payload,
      id: mockId,
      created_at: new Date().toISOString()
    };

    setStaffList(prev => [optimisticStaff, ...prev]);
    setModalType(null);

    fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-id': user.id
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) throw new Error(data.error || 'Failed to create staff member.');
        showToast(`Staff member "${payload.username}" registered successfully!`, 'success');
        fetchStaff();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to save staff: ' + err.message, 'error');
        fetchStaff();
      });
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const cleanPhone = phone.trim().replace(/^(\+91|91)/, '').replace(/[\s-()]/g, '');

    if (!trimmedUser || !trimmedEmail) {
      showToast('Username and email are required.', 'warning');
      return;
    }

    if (trimmedUser.length < 3 || !/^[a-zA-Z0-9_]+$/.test(trimmedUser)) {
      showToast('Username must be at least 3 characters and contain only letters, numbers, and underscores.', 'warning');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }

    if (trimmedPassword && trimmedPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    if (phone.trim() && !/^\d{10}$/.test(cleanPhone)) {
      showToast('Phone Number must be exactly 10 digits.', 'warning');
      return;
    }

    const updatePayload = {
      username: trimmedUser,
      email: trimmedEmail,
      phone: phone.trim() ? cleanPhone : null,
      userType: roleType
    };
    if (trimmedPassword) {
      updatePayload.password = trimmedPassword;
    }

    const optimisticStaff = { ...editingStaff, ...updatePayload };
    setStaffList(prev => prev.map(s => s.id === editingStaff.id ? optimisticStaff : s));
    setModalType(null);

    fetch(`${API}/auth/staff/${editingStaff.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-id': user.id
      },
      body: JSON.stringify(updatePayload)
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) throw new Error(data.error || 'Failed to update staff member.');
        showToast(`Staff profile for "${updatePayload.username}" updated!`, 'success');
        fetchStaff();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to update staff: ' + err.message, 'error');
        fetchStaff();
      });
  };

  const handleDeleteClick = (staff) => {
    if (staff.id === user.id) {
      showToast("You cannot delete your own admin account.", 'warning');
      return;
    }
    setStaffToDelete(staff);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    
    const idToDelete = staffToDelete.id;
    const nameToDelete = staffToDelete.username;
    setStaffList(prev => prev.filter(s => s.id !== idToDelete));
    setShowDeleteConfirm(false);
    setStaffToDelete(null);

    fetch(`${API}/auth/staff/${idToDelete}`, {
      method: 'DELETE',
      headers: {
        'x-admin-id': user.id
      }
    })
      .then(res => res.json().then(data => ({ res, data })))
      .then(({ res, data }) => {
        if (!res.ok) throw new Error(data.error || 'Failed to delete staff member.');
        showToast(`Staff account for "${nameToDelete}" deleted.`, 'info');
        fetchStaff();
      })
      .catch(err => {
        console.error(err);
        showToast('Failed to delete staff: ' + err.message, 'error');
        fetchStaff();
      });
  };

  // Filtering Logic
  const filteredStaff = staffList.filter(s => {
    const matchesSearch =
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.phone && s.phone.includes(searchQuery));
    
    const matchesRole = roleFilter === 'All' || s.userType === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Get dynamic pills based on role
  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-50 text-purple-700 border-purple-205';
      case 'Mobiliser':
        return 'bg-emerald-50 text-emerald-700 border-emerald-205';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-205';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Staff Management Directory</h2>
          <p className="text-xs text-slate-500 mt-1">Manage system users, define access levels, and audit system operations permissions.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="min-[1000px]:hidden flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl shadow-md shadow-indigo-100 transition duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.5} />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Filters block */}
      <section className={`bg-white border border-slate-200 rounded-2xl p-3 min-[1000px]:p-5 shadow-xs grid grid-cols-2 min-[1000px]:grid-cols-3 gap-2.5 min-[1000px]:gap-4 ${showMobileFilters ? 'grid' : 'hidden min-[1000px]:grid'}`}>
        {/* Search */}
        <div className="col-span-2 min-[1000px]:col-span-1 relative">
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">Search</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 min-[1000px]:pl-3 flex items-center text-slate-400">
              <Search className="h-3.5 w-3.5 min-[1000px]:h-4 min-[1000px]:w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Username, email, phone..."
              className="w-full pl-8 pr-3 py-1.5 min-[1000px]:pl-9 min-[1000px]:pr-4 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
            />
          </div>
        </div>

        {/* Role Type Filter */}
        <div className="col-span-1">
          <label className="block text-[9px] min-[1000px]:text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:mb-1.5">Role Access</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-2 py-1.5 min-[1000px]:px-3 min-[1000px]:py-2 border border-slate-250 bg-white rounded-lg min-[1000px]:rounded-xl text-[10px] min-[1000px]:text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Mobiliser">Mobiliser</option>
          </select>
        </div>

        {/* Reload button */}
        <div className="col-span-1 flex flex-col justify-end">
          <button 
            type="button"
            onClick={() => fetchStaff()}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 min-[1000px]:py-2 px-3 border border-slate-250 bg-white hover:bg-slate-50 text-slate-650 text-[10px] min-[1000px]:text-xs font-bold rounded-lg min-[1000px]:rounded-xl transition shadow-xs cursor-pointer active:scale-95"
            title="Reload List"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>
        </div>
      </section>

      {/* API status display */}
      {apiMessage && (
        <div className={`p-4 rounded-xl text-xs font-semibold border flex items-center justify-between ${
          apiMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-250 text-emerald-800'
            : 'bg-rose-50 border-rose-250 text-rose-800'
        }`}>
          <span>{apiMessage.text}</span>
          <button onClick={() => setApiMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Staff directory block */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading && staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs font-semibold">Fetching staff accounts...</p>
          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse block min-[1000px]:table min-[1000px]:min-w-[1000px]">
              <thead className="hidden min-[1000px]:table-header-group">
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-black tracking-wider text-[10px]">
                  <th className="py-4.5 px-6">Staff Member</th>
                  <th className="py-4.5 px-6">Contact Info</th>
                  <th className="py-4.5 px-6">Role Access</th>
                  <th className="py-4.5 px-6">Date Joined</th>
                  <th className="py-4.5 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="block min-[1000px]:table-row-group divide-y divide-slate-150 text-xs">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="grid grid-cols-2 mb-1.5 min-[1000px]:mb-0 gap-1.5 p-2 min-[1000px]:gap-4 min-[1000px]:p-0 min-[1000px]:table-row hover:bg-slate-50/50 transition duration-150 relative">
                    <td className="col-span-2 min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 min-w-0">
                      <div className="flex items-center space-x-2.5 min-[1000px]:space-x-3.5 min-w-0">
                        <div className="w-8 h-8 min-[1000px]:w-9 min-[1000px]:h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center font-extrabold text-white text-[10px] min-[1000px]:text-xs select-none shrink-0 shadow-xs">
                          {staff.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-extrabold text-slate-800 text-sm leading-tight truncate">{staff.username}</p>
                          <p className="text-slate-400 text-[9px] min-[1000px]:text-[10px] font-mono mt-0.5 truncate">{staff.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="col-span-1 flex flex-col items-start justify-center min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 min-[1000px]:text-left min-w-0">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:hidden">Contact Info</span>
                      <div className="text-slate-650 space-y-0.5 min-[1000px]:space-y-1 w-full min-w-0">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate text-[10px] min-[1000px]:text-xs">{staff.email}</span>
                        </div>
                        {staff.phone && (
                          <div className="flex items-center space-x-1.5 min-w-0">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate text-[10px] min-[1000px]:text-xs">{staff.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="col-span-1 flex flex-col items-end justify-center min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 min-[1000px]:text-left">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1 min-[1000px]:hidden font-black">Role Access</span>
                      <span className={`px-2 py-0.5 min-[1000px]:px-2.5 min-[1000px]:py-1 rounded text-[9px] min-[1000px]:text-[10px] font-bold border capitalize ${getRoleBadgeStyle(staff.userType)}`}>
                        {staff.userType}
                      </span>
                    </td>
                    <td className="hidden min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 text-slate-450 font-medium">
                      {new Date(staff.created_at || staff.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="col-span-2 min-[1000px]:table-cell min-[1000px]:py-4 min-[1000px]:px-6 pt-2 border-t border-slate-100 min-[1000px]:border-none min-[1000px]:pt-0">
                      <div className="flex items-center w-full min-[1000px]:justify-center gap-1.5 min-[1000px]:gap-2">
                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          className="flex-1 min-[1000px]:flex-none flex items-center justify-center gap-1 min-[1000px]:gap-1.5 py-1.5 px-2 min-[1000px]:py-1.5 min-[1000px]:px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold rounded-md min-[1000px]:rounded-lg shadow-xs transition hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5 min-[1000px]:w-3 min-[1000px]:h-3 shrink-0" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(staff)}
                          disabled={staff.id === user.id}
                          className={`flex-1 min-[1000px]:flex-none flex items-center justify-center gap-1 min-[1000px]:gap-1.5 py-1.5 px-2 min-[1000px]:py-1.5 min-[1000px]:px-3 border text-[10px] font-bold rounded-md min-[1000px]:rounded-lg shadow-xs transition hover:-translate-y-0.5 whitespace-nowrap cursor-pointer ${
                            staff.id === user.id 
                              ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                              : 'bg-rose-50/50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 border-rose-100 hover:border-rose-200'
                          }`}
                          title={staff.id === user.id ? "Cannot delete yourself" : "Delete Staff"}
                        >
                          <Trash2 className="w-3.5 h-3.5 min-[1000px]:w-3 min-[1000px]:h-3 shrink-0" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 border border-slate-200 border-dashed rounded-2xl">
            <Users className="h-10 w-10 text-slate-350 mx-auto mb-2" />
            <p className="text-xs font-semibold">No staff members found matching search criteria.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-none">
          <div className="bg-white border border-slate-250 rounded-3xl w-full max-w-md p-6 md:p-8 shadow-xl animate-none">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3.5 mb-6">
              <h3 className="text-sm font-bold text-slate-850 flex items-center space-x-2">
                <UserPlus className="h-4.5 w-4.5 text-indigo-600" />
                <span>{modalType === 'add' ? 'Register New Staff Member' : 'Edit Staff Profile'}</span>
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg transition cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={modalType === 'add' ? handleAddStaff : handleEditStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  placeholder="e.g. priya_mobiliser"
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@evencargo.in"
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Password {modalType === 'edit' && '(Leave blank to keep current)'} {modalType === 'add' && '*'}
                </label>
                <input
                  type="password"
                  required={modalType === 'add'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit number"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Role Type</label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-905 focus:outline-none focus:border-indigo-600 transition animate-none"
                  >
                    <option value="Mobiliser">Mobiliser</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-150 mt-6 text-xs">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-lg border border-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-xs cursor-pointer disabled:opacity-55"
                >
                  {loading ? 'Processing...' : modalType === 'add' ? 'Register Staff' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-250 rounded-3xl w-full max-w-sm p-6 shadow-xl animate-none text-xs">
            <h3 className="font-bold text-slate-800 text-sm">Delete Staff Account?</h3>
            <p className="text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete the staff member <strong>{staffToDelete?.username}</strong>? This action cannot be undone and will revoke their system access.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-150 mt-6 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setStaffToDelete(null);
                }}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-lg border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition shadow-xs cursor-pointer disabled:opacity-55"
              >
                {loading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
