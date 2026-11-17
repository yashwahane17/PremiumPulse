import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { 
  History, 
  FileDown, 
  ChevronRight, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Scale, 
  Calendar, 
  Sparkles,
  GitCompare,
  PlusCircle,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Cpu,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function HistoryPage({ onViewPrediction, onOpenCompare }) {
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest' | 'premium_high' | 'premium_low'
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory();
      setHistory(res || []);
    } catch (err) {
      console.error("Failed to load prediction history:", err);
      showToast('Failed to load prediction records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDownloadPdf = async (id, e) => {
    if (e) e.stopPropagation();
    setDownloadingId(id);
    try {
      await api.downloadReportPdf(id);
      showToast(`Policy report #${id} downloaded!`, 'success');
    } catch (err) {
      showToast(err.message || 'Download failed', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  // Filter & Sort
  const processedHistory = history
    .filter((item) => {
      const matchesSearch = 
        (item.model_used || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.id).includes(searchQuery) ||
        (item.date_formatted || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = riskFilter === 'all' || item.risk_category === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return b.id - a.id;
      if (sortOrder === 'oldest') return a.id - b.id;
      if (sortOrder === 'premium_high') return b.predicted_premium_inr - a.predicted_premium_inr;
      if (sortOrder === 'premium_low') return a.predicted_premium_inr - b.predicted_premium_inr;
      return 0;
    });

  // Chart data
  const chartData = [...history].reverse().map(h => ({
    name: h.date_formatted || h.created_at?.slice(5, 10),
    premium: h.predicted_premium_inr,
    bmi: h.bmi,
    id: h.id
  }));

  const getRiskBadge = (cat) => {
    if (cat === 'Low Risk') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (cat === 'Moderate Risk') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-600" />
            Prediction History & Underwriting Trends
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Complete audit trail of previous policy calculations with multi-model benchmarking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {history.length >= 2 && (
            <button
              onClick={() => onOpenCompare(history)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5 text-blue-600" />
              <span>Compare Any Two</span>
            </button>
          )}

          <button
            onClick={() => navigate('/predict')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Estimate</span>
          </button>
        </div>
      </div>

      {/* Trajectory Chart */}
      {chartData.length > 1 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-black text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span>Historical Premium Trajectory (₹ INR)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Tracking {history.length} calculations</span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="₹" />
                <Tooltip 
                  formatter={(val) => [`₹${val?.toLocaleString('en-IN')}`, 'Premium Quote']}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="premium" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#histGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Search, Filter & Sort Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, model, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="all">All Risk Tiers</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Moderate Risk">Moderate Risk</option>
            <option value="High Risk">High Risk</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="premium_high">Sort: Premium (High to Low)</option>
            <option value="premium_low">Sort: Premium (Low to High)</option>
          </select>
        </div>
      </div>

      {/* History Items */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
          <span className="text-xs font-semibold">Loading prediction ledger...</span>
        </div>
      ) : processedHistory.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <History className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-slate-800">No predictions match your query</h3>
          <p className="text-xs text-slate-400">Try adjusting your search criteria or calculate a new premium.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {processedHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-700 text-sm shrink-0">
                  #{item.id}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-slate-900">
                      ₹{item.predicted_premium_inr?.toLocaleString('en-IN')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadge(item.risk_category)}`}>
                      {item.risk_category}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.date_formatted || item.created_at?.slice(0, 10)}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Scale className="w-3 h-3 text-slate-400" />
                      <span>BMI {item.bmi}</span>
                    </span>
                    <span>•</span>
                    <span className="text-violet-600 font-semibold">
                      {item.model_used}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => onViewPrediction(item.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={(e) => handleDownloadPdf(item.id, e)}
                  disabled={downloadingId === item.id}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                  title="Download PDF Certificate"
                >
                  <Download className={`w-4 h-4 ${downloadingId === item.id ? 'animate-bounce' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
