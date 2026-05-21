import { useState, useEffect } from 'react';
import {
  UserPlus, Edit, Trash2, Search, Mail, Phone, X,
  Plus, Check, Users, RefreshCw
} from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL;

export default function StaffManagement({ user }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

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

  const fetchStaff = async () => {
    setLoading(true);
    setApiMessage(null);
    try {
      const res = await fetch(`${API}/auth/staff`, {
        headers: {
          'x-admin-id': user.id
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch staff.');
      setStaffList(data || []);
    } catch (err) {
      setApiMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

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
    if (!username.trim() || !email.trim() || !password.trim()) {
      setApiMessage({ type: 'error', text: 'Username, email, and password are required.' });
      return;
    }

    setLoading(true);
    setApiMessage(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': user.id
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
          phone: phone.trim() || null,
          userType: roleType
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create staff member.');
      
      setApiMessage({ type: 'success', text: `Staff member "${username}" created successfully.` });
      setModalType(null);
      fetchStaff();
    } catch (err) {
      setApiMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEditStaff = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      setApiMessage({ type: 'error', text: 'Username and email are required.' });
      return;
    }

    setLoading(true);
    setApiMessage(null);
    try {
      const updatePayload = {
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        userType: roleType
      };
      if (password.trim()) {
        updatePayload.password = password.trim();
      }

      const res = await fetch(`${API}/auth/staff/${editingStaff.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': user.id
        },
        body: JSON.stringify(updatePayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update staff member.');
      
      setApiMessage({ type: 'success', text: `Staff member "${username}" updated successfully.` });
      setModalType(null);
      fetchStaff();
    } catch (err) {
      setApiMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (staff) => {
    if (staff.id === user.id) {
      alert("You cannot delete your own admin account.");
      return;
    }
    setStaffToDelete(staff);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    setLoading(true);
    setApiMessage(null);
    try {
      const res = await fetch(`${API}/auth/staff/${staffToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-id': user.id
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete staff member.');
      
      setApiMessage({ type: 'success', text: `Staff member deleted successfully.` });
      setShowDeleteConfirm(false);
      setStaffToDelete(null);
      fetchStaff();
    } catch (err) {
      setApiMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
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
      case 'City Manager':
        return 'bg-amber-50 text-amber-700 border-amber-205';
      case 'Operations':
        return 'bg-blue-50 text-blue-700 border-blue-205';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-205';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Staff Management Directory</h2>
          <p className="text-xs text-slate-500 mt-1">Manage system users, define access levels, and audit system operations permissions.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" strokeWidth={2.5} />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filters block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username, email, phone..."
            className="w-full pl-9 pr-4 py-2 border border-slate-250 bg-white rounded-lg text-xs text-slate-905 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-slate-255 bg-white rounded-lg text-slate-905 focus:outline-none focus:border-indigo-600"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Mobiliser">Mobiliser</option>
            <option value="City Manager">City Manager</option>
            <option value="Operations">Operations</option>
          </select>

          <button 
            type="button"
            onClick={() => fetchStaff()}
            className="p-2 border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 rounded-lg transition"
            title="Reload List"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

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
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
        {loading && staffList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs font-semibold">Fetching staff accounts...</p>
          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-450 uppercase font-black tracking-wider text-[10px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Role Access</th>
                  <th className="py-3 px-4">Date Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-4 font-bold text-slate-850">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center font-extrabold text-white text-xs select-none shrink-0 shadow-xs">
                          {staff.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{staff.username}</p>
                          <p className="text-slate-400 text-[10px] font-mono mt-0.5">{staff.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{staff.email}</span>
                      </div>
                      {staff.phone && (
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{staff.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-bold border capitalize ${getRoleBadgeStyle(staff.userType)}`}>
                        {staff.userType}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-450 font-medium">
                      {new Date(staff.created_at || staff.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-105 text-slate-600 hover:text-slate-850 border border-slate-200 rounded-lg transition cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(staff)}
                          disabled={staff.id === user.id}
                          className={`p-1.5 border rounded-lg transition cursor-pointer ${
                            staff.id === user.id 
                              ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                              : 'bg-rose-50/50 hover:bg-rose-50 text-rose-550 hover:text-rose-700 border-rose-100 hover:border-rose-200'
                          }`}
                          title={staff.id === user.id ? "Cannot delete yourself" : "Delete Staff"}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
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
                  onChange={(e) => setUsername(e.target.value)}
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
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 999..."
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
                    <option value="City Manager">City Manager</option>
                    <option value="Operations">Operations</option>
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
