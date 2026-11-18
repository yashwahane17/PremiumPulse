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
      showToast(`Policy report #${id} downloaded successfully!`, 'success');
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
    if (cat === 'Low Risk') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (cat === 'Moderate Risk') return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-[#3867FF]" />
            Prediction History & Underwriting Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Complete audit trail of previous policy calculations with multi-model benchmarking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {history.length >= 2 && (
            <button
              onClick={() => onOpenCompare(history)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5 text-[#3867FF]" />
              <span>Compare Any Two</span>
            </button>
          )}

          <button
            onClick={() => navigate('/predict')}
            className="px-4 py-2 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Estimate</span>
          </button>
        </div>
      </div>

      {/* Trajectory Chart */}
      {chartData.length > 1 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#12B981]" />
              <span>Historical Premium Trajectory (₹ INR)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Tracking {history.length} calculations</span>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3867FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3867FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8993A7' }} />
                <YAxis tick={{ fontSize: 11, fill: '#8993A7' }} unit="₹" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(val) => [`₹${val?.toLocaleString('en-IN')}`, 'Premium Quote']}
                  contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="premium" stroke="#3867FF" strokeWidth={2.5} fillOpacity={1} fill="url(#histGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Search, Filter & Sort Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, model, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Risk Tiers</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Moderate Risk">Moderate Risk</option>
            <option value="High Risk">High Risk</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300"
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
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#3867FF]" />
          <span className="text-xs font-semibold">Loading prediction ledger...</span>
        </div>
      ) : processedHistory.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
          <History className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200">No predictions match your query</h3>
          <p className="text-xs text-slate-400">Try adjusting your search criteria or calculate a new premium.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {processedHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onViewPrediction ? onViewPrediction(item.id) : null}
              className="p-5 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center font-black text-[#3867FF] text-sm shrink-0">
                  #{item.id}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                      ₹{item.predicted_premium_inr?.toLocaleString('en-IN')}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadge(item.risk_category)}`}>
                      {item.risk_category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>Model: {item.model_used}</span>
                    <span>•</span>
                    <span>BMI: {item.bmi}</span>
                    <span>•</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={(e) => handleDownloadPdf(item.id, e)}
                  disabled={downloadingId === item.id}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => onViewPrediction ? onViewPrediction(item.id) : null}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-xs font-bold text-[#3867FF] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
