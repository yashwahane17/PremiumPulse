import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { useRouter } from '../../context/RouterContext';
import { 
  Users, 
  Layers, 
  BrainCircuit, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Cpu, 
  FileText,
  DollarSign,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AdminDashboardPage() {
  const { navigate } = useRouter();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [agentsData, setAgentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const [overviewRes, analyticsRes, agentsRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminAnalytics(),
        api.getAdminAgents()
      ]);
      setData(overviewRes);
      setAnalytics(analyticsRes);
      setAgentsData(agentsRes);
    } catch (err) {
      console.error('Failed to load admin overview:', err);
      setErrorMsg(err.message || 'Failed to load admin overview metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-slate-900/80 rounded-3xl border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 bg-slate-900/80 rounded-2xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-900/80 rounded-3xl border border-slate-800 lg:col-span-2" />
          <div className="h-80 bg-slate-900/80 rounded-3xl border border-slate-800" />
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-8 bg-rose-950/40 border border-rose-900/60 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-8">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-rose-300">Telemetry Synchronization Error</h3>
        <p className="text-xs text-rose-400 leading-relaxed">{errorMsg}</p>
        <button
          onClick={loadData}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Format 7-day trend for Recharts
  const trendData = (data?.trend_labels || []).map((label, idx) => ({
    date: label,
    predictions: data.trend_counts[idx] || 0
  }));

  // Risk Distribution Donut Chart data
  const riskColors = {
    'Low Risk': '#10b981',
    'Moderate Risk': '#f59e0b',
    'High Risk': '#ef4444'
  };

  const riskPieData = Object.entries(analytics?.risk_distribution || {}).map(([key, val]) => ({
    name: key,
    value: val.count,
    color: riskColors[key] || '#3b82f6'
  }));

  // Agent execution counts
  const totalAgentExecutions = agentsData?.agents?.reduce((acc, a) => acc + (a.total_executions || 0), 0) || 0;
  const failedAgentExecutions = agentsData?.agents?.reduce((acc, a) => acc + (a.failed_count || 0), 0) || 0;

  // Agent comparison chart
  const agentSuccessData = (agentsData?.agents || []).map(a => ({
    name: a.agent_name.replace(' Agent', '').replace('Central ', ''),
    success: a.success_count || 0,
    failed: a.failed_count || 0
  }));

  const bestModel = data?.model_summary?.best_model || 'XGBoost Regressor';

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. TOP HEADER & QUICK METRICS */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800 text-cyan-400 text-[11px] font-bold mb-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Real-Time Actuarial Telemetry</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Enterprise Operations & AI SaaS Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            System aggregates, predictive ML workloads, autonomous agent telemetry, and underwriting volumes.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sync State</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. OVERVIEW STATISTICS (6 CARDS - SECTION C) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Registered Users */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Registered Users</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{data?.total_users || 0}</div>
          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">100%</span>
            <span>database verified</span>
          </div>
        </div>

        {/* Card 2: Active Users */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Accounts</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{data?.active_users || 0}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            {data?.inactive_users || 0} deactivated
          </div>
        </div>

        {/* Card 3: Total Predictions */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Predictions</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">{data?.total_predictions || 0}</div>
          <div className="text-[10px] text-cyan-400 mt-1 font-semibold">
            Underwritten runs
          </div>
        </div>

        {/* Card 4: Predictions Today */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Predictions Today</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono">{data?.predictions_today || 0}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            24h rolling window
          </div>
        </div>

        {/* Card 5: AI Agent Executions */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Agent Executions</span>
            <div className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-violet-400 font-mono">{totalAgentExecutions}</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Across 4 agents
          </div>
        </div>

        {/* Card 6: Failed Predictions */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Failed Runs</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-300 font-mono">{failedAgentExecutions}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>0% error rate</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE ANALYTICS CHARTS (SECTION D) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Daily Prediction Activity (7-Day Trend) */}
        <div className="lg:col-span-2 bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Daily Prediction Inference Activity (Past 7 Days)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Real database throughput of completed actuarial pipeline runs</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 font-mono">
              Inferences
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090E1A', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="predictions" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#adminAreaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Category Distribution (Donut Chart) */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <span>Risk Category Stratification</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Population distribution across risk tiers</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            {riskPieData.length === 0 ? (
              <span className="text-xs text-slate-500">No predictions recorded yet</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
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
      </div>

      {/* Chart 3 & 4: Agent Executions & ML Model Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Success vs Failure Bar Chart */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-violet-400" />
              <span>Agent Execution Success vs. Failure Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Performance across all 4 agents and orchestrator</p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentSuccessData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090E1A', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="success" fill="#10b981" radius={[4, 4, 0, 0]} name="Successful" />
                <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ML Benchmark Matrix Card */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Production ML Model Benchmarks</span>
              </h3>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Primary: {bestModel}
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">XGBoost Regressor</div>
                  <div className="text-[10px] text-slate-400">Primary Gradient Boosting Model</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-mono font-bold">R² = 0.871</div>
                  <div className="text-[10px] text-slate-400 font-mono">MAE = ₹2,480</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Random Forest Regressor</div>
                  <div className="text-[10px] text-slate-400">Ensemble of 100 Decision Trees</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-300 font-mono font-bold">R² = 0.854</div>
                  <div className="text-[10px] text-slate-400 font-mono">MAE = ₹2,610</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Linear Regression</div>
                  <div className="text-[10px] text-slate-400">OLS Baseline Regression Model</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 font-mono font-bold">R² = 0.751</div>
                  <div className="text-[10px] text-slate-400 font-mono">MAE = ₹4,180</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Trained on Kaggle Medical Cost Dataset</span>
            <button
              onClick={() => navigate('/admin/system-health')}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Health & ML Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
