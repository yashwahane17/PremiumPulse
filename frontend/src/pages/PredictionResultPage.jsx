import React, { useState } from 'react';
import { api } from '../api/api';
import { 
  Activity, 
  FileDown, 
  RefreshCw, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Cpu, 
  Info,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function PredictionResultPage({ prediction, onRecalculate, setActivePage }) {
  const [downloading, setDownloading] = useState(false);

  if (!prediction) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center">
        <p className="text-sm font-bold text-slate-700">No prediction data found.</p>
        <button
          onClick={onRecalculate}
          className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Calculate New Premium
        </button>
      </div>
    );
  }

  const {
    id,
    predicted_premium_inr,
    premium_range_min,
    premium_range_max,
    risk_category,
    risk_score,
    bmi,
    bmi_category,
    model_used,
    model_r2,
    model_comparisons = {},
    features_snapshot = {},
    influencing_factors = [],
    explanation,
    improvement_tips = [],
    total_potential_savings_inr = 0,
    agent_logs = []
  } = prediction;

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await api.downloadReportPdf(id || 1);
    } catch (err) {
      alert('Failed to generate and download PDF report: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // Format model comparisons for BarChart
  const barChartData = Object.entries(model_comparisons).map(([name, val]) => ({
    name: name,
    premium: val,
    isSelected: name === model_used
  }));

  const getRiskColor = (cat) => {
    if (cat === 'Low Risk') return 'from-emerald-500 to-teal-600';
    if (cat === 'Moderate Risk') return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Hero Premium Output */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRiskColor(risk_category)} text-white shadow-xs`}>
                {risk_category} ({risk_score}/100)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-300 border border-white/10">
                BMI: {bmi} ({bmi_category || 'Assessed'})
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-400/20">
                Optimal ML Model: {model_used}
              </span>
            </div>

            <h1 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-blue-400 mb-1">
              Estimated Annual Health Insurance Premium
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                ₹{predicted_premium_inr?.toLocaleString()}
              </span>
              <span className="text-slate-400 text-sm font-medium">/ year</span>
            </div>
            <p className="text-slate-400 text-xs mt-2">
              Estimated Underwriting Range: <span className="text-white font-bold">₹{premium_range_min?.toLocaleString()}</span> — <span className="text-white font-bold">₹{premium_range_max?.toLocaleString()}</span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-6 py-3.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-black/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <FileDown className="w-4 h-4 text-blue-600" />
              <span>{downloading ? 'Compiling PDF...' : 'Download Official PDF Report'}</span>
            </button>

            <button
              onClick={onRecalculate}
              className="px-5 py-3.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recalculate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: ML Models Comparison & AI Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ML Models Comparison Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Multi-Model Prediction Benchmark
              </h2>
              <p className="text-xs text-slate-500">
                Cross-validating 3 algorithms trained on medical expense datasets
              </p>
            </div>
            <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-200">
              R² = {model_r2}
            </span>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Predicted Premium']}
                />
                <Bar dataKey="premium" radius={[8, 8, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isSelected ? '#2563EB' : '#94A3B8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="font-bold text-slate-700">Selected Optimal Model ({model_used})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400"></span>
              <span>Comparative Benchmarks</span>
            </div>
          </div>
        </div>

        {/* Explainable AI Narrative */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Insight Agent Explanation</h3>
                <p className="text-[11px] text-slate-400">Natural Language Actuarial Synthesis</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-normal whitespace-pre-line">
              {explanation}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Generated with Explainable Underwriting Architecture</span>
            <button
              onClick={() => setActivePage('insights')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Full Health Insights</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Cost Drivers (Explainable AI Factors) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Primary Actuarial Cost Drivers
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Decomposition of physiological and lifestyle features influencing your underwritten rate
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {influencing_factors.map((f, i) => {
            const isDiscount = f.direction === 'DECREASE';
            return (
              <div key={i} className={`p-4 rounded-2xl border ${isDiscount ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isDiscount ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {f.impact_label}
                  </span>
                  {isDiscount ? (
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{f.factor}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Health Savings Target */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Lifestyle Optimization Matrix</span>
            </div>
            <h3 className="text-xl font-black">
              Potential Annual Savings: ₹{total_potential_savings_inr?.toLocaleString()}
            </h3>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Targeted behavioral modifications that directly lower your future renewal premiums
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {improvement_tips.map((tip, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-emerald-300 font-bold mb-2">
                  <span>{tip.timeframe}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-white text-[10px]">
                    {tip.impact_level} Impact
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{tip.action}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{tip.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-[11px] text-slate-400">Potential Saving:</span>
                <span className="text-base font-black text-emerald-300">
                  ₹{tip.potential_saving_inr?.toLocaleString()}/yr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Agent Audit Trail Collapsible Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Multi-Agent Execution Audit Trail</h3>
          </div>
          <span className="text-xs text-slate-400">Verified Pipeline Logs</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {agent_logs.map((log, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-800">{log.agent_name}</span>
                <span className="text-slate-500 truncate max-w-md hidden sm:inline">{log.summary}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{log.execution_time_ms} ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

