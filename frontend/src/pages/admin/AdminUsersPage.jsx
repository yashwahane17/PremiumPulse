import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
    Users,
    Search,
    Filter,
    UserCheck,
    UserX,
    Shield,
    Activity,
    Calendar,
    Mail,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Eye,
    X,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ShieldAlert,
    Clock
} from 'lucide-react';

export default function AdminUsersPage() {
    const { user: currentAdmin } = useAuth();
    const { showToast } = useToast();

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    // Sorting & Pagination
    const [sortField, setSortField] = useState('created_at'); // 'id' | 'full_name' | 'created_at' | 'total_predictions'
    const [sortAsc, setSortAsc] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Selected User Modal
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (searchQuery) params.query = searchQuery;
            if (roleFilter) params.role = roleFilter;
            if (statusFilter !== '') params.is_active = statusFilter === 'true';

            const data = await api.getAdminUsers(params);
            const userList = Array.isArray(data) ? data : (data.users || []);
            setUsers(userList);
            setTotal(data.total !== undefined ? data.total : userList.length);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            showToast(err.message || 'Failed to load users.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 250);
        return () => clearTimeout(timer);
    }, [searchQuery, roleFilter, statusFilter]);

    const handleToggleStatus = async (userItem) => {
        if (userItem.id === currentAdmin?.id) {
            showToast('You cannot deactivate your own administrative account.', 'error');
            return;
        }

        const newStatus = !userItem.is_active;
        const confirmMsg = newStatus
            ? `Reactivate account for ${userItem.full_name}?`
            : `Deactivate account for ${userItem.full_name}? They will be blocked from logging in.`;

        if (!window.confirm(confirmMsg)) return;

        setActionLoading(userItem.id);
        try {
            await api.updateUserStatus(userItem.id, newStatus);
            showToast(
                `Account for ${userItem.full_name} has been ${newStatus ? 'activated' : 'deactivated'}.`,
                'success'
            );
            setUsers(prev => prev.map(u => u.id === userItem.id ? { ...u, is_active: newStatus } : u));
            if (selectedUser?.id === userItem.id) {
                setSelectedUser(prev => ({ ...prev, is_active: newStatus }));
            }
        } catch (err) {
            showToast(err.message || 'Status update failed.', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    // Sort and Paginate
    const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });
    }, [users, sortField, sortAsc]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedUsers.slice(start, start + pageSize);
    }, [sortedUsers, currentPage]);

    const totalPages = Math.ceil(sortedUsers.length / pageSize) || 1;

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    return (
        <div className="space-y-6">
            {/* Title & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                        <Users className="w-6 h-6 text-cyan-400" />
                        User Management & RBAC Directory
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage public customers, role-based privileges, and account status with strict data protection.
                    </p>
                </div>

                <button
                    onClick={fetchUsers}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
                >
                    <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh Directory</span>
                </button>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search users by full name or email address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 rounded-xl text-xs font-medium border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:border-cyan-500"
                    >
                        <option value="">All Roles</option>
                        <option value="USER">Customer (USER)</option>
                        <option value="ADMIN">Administrator (ADMIN)</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:border-cyan-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="true">Active Accounts</option>
                        <option value="false">Deactivated Accounts</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Displaying {sortedUsers.length} of {total} registered accounts</span>
                    <span className="text-[11px] text-cyan-400 font-mono">Strict User Isolation Enabled</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-slate-900/80 text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
                                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('id')}>
                                    <span className="flex items-center gap-1">User ID <ArrowUpDown className="w-3 h-3" /></span>
                                </th>
                                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('full_name')}>
                                    <span className="flex items-center gap-1">Name & Email <ArrowUpDown className="w-3 h-3" /></span>
                                </th>
                                <th className="py-3 px-4">Role</th>
                                <th className="py-3 px-4">Account Status</th>
                                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('total_predictions')}>
                                    <span className="flex items-center gap-1">Predictions <ArrowUpDown className="w-3 h-3" /></span>
                                </th>
                                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('created_at')}>
                                    <span className="flex items-center gap-1">Registration Date <ArrowUpDown className="w-3 h-3" /></span>
                                </th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-500">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                                        <span>Loading directory records...</span>
                                    </td>
                                </tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-slate-500">
                                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <p className="font-semibold text-slate-400">No users match the criteria</p>
                                        <p className="text-[11px] text-slate-600 mt-0.5">Try clearing search filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((item) => {
                                    const isCurrentAdmin = item.id === currentAdmin?.id;
                                    const isUserActive = item.is_active;

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                                                #{item.id}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shrink-0 ${item.role === 'ADMIN' ? 'bg-gradient-to-tr from-violet-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-600 to-blue-600'
                                                        }`}>
                                                        {item.full_name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white flex items-center gap-1.5">
                                                            <span>{item.full_name}</span>
                                                            {isCurrentAdmin && (
                                                                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950 border border-cyan-800 px-1.5 py-0.2 rounded">
                                                                    You
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 font-mono">
                                                            {item.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.role === 'ADMIN'
                                                        ? 'bg-violet-950/80 text-violet-300 border-violet-800'
                                                        : 'bg-blue-950/80 text-blue-300 border-blue-800'
                                                    }`}>
                                                    <Shield className="w-3 h-3" />
                                                    {item.role}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${isUserActive
                                                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                                                        : 'bg-rose-950/80 text-rose-400 border-rose-800'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isUserActive ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                                    {isUserActive ? 'Active' : 'Deactivated'}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                                                {item.total_predictions || item.predictions_count || 0}
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                                                {item.created_at || 'N/A'}
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => setSelectedUser(item)}
                                                        title="Inspect User Details"
                                                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>

                                                    {isCurrentAdmin ? (
                                                        <span className="text-[10px] text-slate-500 italic px-2">Protected</span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleStatus(item)}
                                                            disabled={actionLoading === item.id}
                                                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${isUserActive
                                                                    ? 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-rose-800'
                                                                    : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800'
                                                                }`}
                                                        >
                                                            {actionLoading === item.id ? (
                                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                                            ) : isUserActive ? (
                                                                <span>Deactivate</span>
                                                            ) : (
                                                                <span>Reactivate</span>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Bar */}
                <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <div>
                        Page <span className="font-bold text-white">{currentPage}</span> of <span className="font-bold text-white">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-40 hover:text-white transition-colors cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* USER DETAIL MODAL */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#0F172A] rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-5 animate-slide-up text-xs text-slate-300">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold">
                                    {selectedUser.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white">{selectedUser.full_name}</h3>
                                    <span className="text-[10px] text-slate-400 font-mono">User ID #{selectedUser.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                                <span className="text-slate-400">Email Address</span>
                                <span className="font-mono font-bold text-white">{selectedUser.email}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                                <span className="text-slate-400">Access Role</span>
                                <span className="font-bold text-cyan-400">{selectedUser.role}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                                <span className="text-slate-400">Account Status</span>
                                <span className={`font-bold ${selectedUser.is_active ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {selectedUser.is_active ? 'Active & Permitted' : 'Deactivated'}
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                                <span className="text-slate-400">Total Policy Runs</span>
                                <span className="font-mono font-bold text-white">{selectedUser.total_predictions || selectedUser.predictions_count || 0}</span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                                <span className="text-slate-400">Account Created</span>
                                <span className="font-mono text-slate-300">{selectedUser.created_at || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                            <span className="text-[10px] text-slate-500">Sensitive health data isolated</span>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer"
                            >
                                Close Inspector
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
