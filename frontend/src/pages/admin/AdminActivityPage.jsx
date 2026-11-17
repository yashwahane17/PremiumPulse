import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { 
  Clock, 
  Search, 
  Filter, 
  RefreshCw, 
  User, 
  Shield, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function AdminActivityPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminActivityLogs({ limit: 100, activity_type: typeFilter });
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
      showToast('Failed to load activity logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [typeFilter]);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const desc = (log.description || '').toLowerCase();
    const email = (log.user_email || '').toLowerCase();
    const type = (log.activity_type || '').toLowerCase();
    return desc.includes(q) || email.includes(q) || type.includes(q);
  });

  const getActivityBadge = (type) => {
    switch (type) {
      case 'USER_REGISTER':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'USER_LOGIN':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'ADMIN_LOGIN':
        return 'bg-violet-950 text-violet-400 border-violet-800';
      case 'PREDICTION_GENERATED':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case 'STATUS_CHANGE':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-cyan-400" />
            Audit & System Activity Logs
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic audit trail of all customer and administrative actions persisted in SQLite.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by action description, email, or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 rounded-xl text-xs font-medium border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:border-cyan-500"
          >
            <option value="">All Activity Types</option>
            <option value="USER_REGISTER">User Registrations</option>
            <option value="USER_LOGIN">User Logins</option>
            <option value="ADMIN_LOGIN">Admin Logins</option>
            <option value="PREDICTION_GENERATED">Predictions Generated</option>
            <option value="STATUS_CHANGE">Account Status Changes</option>
            <option value="UPDATE_HEALTH_PROFILE">Profile Updates</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Found {filteredLogs.length} activity records</span>
          <span className="text-[11px] text-cyan-400 font-mono">Immutable SQLite Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Activity Type</th>
                <th className="py-3 px-4">Action Summary</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    <span>Loading audit records...</span>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-semibold text-slate-400">No activity logs found</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                      #{log.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActivityBadge(log.activity_type)}`}>
                        {log.activity_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-white max-w-md truncate">
                      {log.description}
                    </td>

                    <td className="py-3.5 px-4">
                      {log.user_email ? (
                        <div className="font-mono text-cyan-300 text-[11px] truncate max-w-[180px]">
                          {log.user_email}
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">System Event</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {log.created_at || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

