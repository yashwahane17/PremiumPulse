import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  Activity, 
  Users, 
  ShieldCheck, 
  RefreshCw,
  HeartPulse,
  Flame,
  Cpu,
  Layers,
  Sparkles,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  CartesianGrid
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  // Risk Data
  const riskColors = {
    'Low Risk': '#10b981',
    'Moderate Risk': '#f59e0b',
    'High Risk': '#ef4444'
  };

  const riskPieData = Object.entries(data?.risk_distribution || {}).map(([key, val]) => ({
    name: key,
    value: val.count,
    color: riskColors[key] || '#06b6d4'
  }));

  // Premium Bands
  const premiumBandData = Object.entries(data?.premium_bands || {}).map(([band, count]) => ({
    band,
    count
  }));

  // Model Routing
  const modelUsageData = Object.entries(data?.model_distribution || {}).map(([model, count]) => ({
    model: model.replace(' Regressor', ''),
    count
  }));

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            ML Model Telemetry & Actuarial Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Population risk stratification, premium distribution corridors, and ensemble routing allocations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:border-cyan-500"
          >
            <option value="7d">Past 7 Days</option>
            <option value="30d">Past 30 Days</option>
            <option value="all">All-Time Cumulative</option>
          </select>

          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Predictions</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">{data?.total_predictions || 0}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Underwriting runs logged</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cohort Avg BMI</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {data?.averages?.avg_bmi || 0}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Healthy Population Range</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Daily Steps</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {data?.averages?.avg_daily_steps?.toLocaleString() || 0}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">From wearable telemetry</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active ML Ensembles</div>
            <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">3 Regressors</div>
            <div className="text-[10px] text-slate-500 mt-0.5">XGBoost, RF, Linear Reg.</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>Customer Risk Category Stratification</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Clinical and lifestyle risk breakdown across registered users</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {riskPieData.length === 0 ? (
              <div className="text-slate-500 text-xs">No prediction data available yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090E1A', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Premium Bands Bar Chart */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Annual Premium Corridors (₹ INR)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Policy volume distribution across actuarial premium brackets</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={premiumBandData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="band" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090E1A', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Selection Breakdown */}
      <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>Machine Learning Regressor Routing Breakdown</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribution of inference executions dynamically selected by Pricing Agent based on optimal validation metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {modelUsageData.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">{item.model}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 font-mono">Pricing Agent Engine</div>
              </div>
              <div className="text-xl font-black text-cyan-400 font-mono">
                {item.count}
                <span className="text-[10px] text-slate-500 font-normal ml-1">runs</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
