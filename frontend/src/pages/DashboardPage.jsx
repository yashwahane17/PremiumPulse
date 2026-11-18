import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  PlusCircle,
  Watch,
  Heart,
  Footprints,
  Scale,
  Sparkles,
  ArrowRight,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Zap,
  BarChart3,
  ExternalLink,
  ChevronRight,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function DashboardPage({ onOpenWearable, onViewPrediction }) {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const dash = await api.getDashboard();
      setData(dash);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleDownloadPdf = async (id, e) => {
    if (e) e.stopPropagation();
    setDownloadingId(id);
    try {
      await api.downloadReportPdf(id);
      showToast('Policy PDF report downloaded successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to download report', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl lg:col-span-2" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-lg space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unable to Load Dashboard</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{errorMsg}</p>
        <button
          onClick={fetchDashboard}
          className="px-5 py-2.5 rounded-xl bg-[#3867FF] text-white text-xs font-bold shadow-md cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const latestPred = data?.latest_prediction;
  const history = data?.history || [];
  const profile = data?.health_profile;
  const wearable = data?.wearable_latest;

  // Chart data: Trend across historical predictions
  const trendData = history.slice().reverse().map((h, i) => ({
    name: `Run #${h.id}`,
    premium: h.predicted_premium_inr,
    date: new Date(h.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  // Comparison data: 3 Models for latest prediction
  const comparisonData = latestPred?.model_comparisons ? [
    { name: 'Linear Reg (Optimal)', premium: latestPred.model_comparisons['Linear Regression'] || 0, fill: '#3867FF' },
    { name: 'Random Forest', premium: latestPred.model_comparisons['Random Forest'] || 0, fill: '#7657FF' },
    { name: 'XGBoost', premium: latestPred.model_comparisons['XGBoost'] || 0, fill: '#06B6D4' }
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* =========================================================================
          1. WELCOME BANNER (Stripe Style)
      ========================================================================= */}
      <div className="bg-gradient-to-r from-[#10172A] via-[#1A2544] to-[#10172A] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3867FF]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#3867FF]" />
            <span>Multi-Agent Underwriting Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {data?.user_name || 'Policyholder'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Your personalized risk profile is underwritten by our 5 autonomous agents. Sync telemetry or calculate an updated quote anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onOpenWearable ? onOpenWearable() : null}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <Watch className="w-4 h-4 text-[#3867FF]" />
            <span>Sync Wearable</span>
          </button>
          <button
            onClick={() => navigate('/predict')}
            className="px-5 py-2.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Predict Premium</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. METRICS OVERVIEW CARDS (4 Cards)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Latest Premium */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Latest Annual Premium</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#3867FF] flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {latestPred ? `₹${latestPred.predicted_premium_inr.toLocaleString('en-IN')}` : '—'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{latestPred ? `Est. ₹${Math.round(latestPred.predicted_premium_inr / 12).toLocaleString('en-IN')}/mo` : 'Run first prediction'}</span>
            {latestPred && (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Model: {latestPred.model_used?.split(' ')[0]}
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Health Risk Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Health Risk Score</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#12B981] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono flex items-baseline gap-2">
            <span>{latestPred?.risk_score !== undefined ? latestPred.risk_score : (profile ? 12 : '—')}</span>
            <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              (latestPred?.risk_category || 'Low Risk').includes('High') 
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                : (latestPred?.risk_category || 'Low Risk').includes('Moderate')
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {latestPred?.risk_category || 'Low Clinical Risk'}
            </span>
          </div>
        </div>

        {/* Card 3: BMI Indicator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Body Mass Index (BMI)</span>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-[#7657FF] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono flex items-baseline gap-2">
            <span>{latestPred?.bmi || profile?.bmi || 23.5}</span>
            <span className="text-xs font-normal text-slate-400">kg/m²</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-[#3867FF] font-semibold">
              {(latestPred?.bmi || profile?.bmi || 23.5) < 25 ? 'Normal Weight' : 'Above Target'}
            </span>
            <span>Target: 18.5 - 24.9</span>
          </div>
        </div>

        {/* Card 4: Total Predictions & Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Underwriting Records</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {data?.history_count || 0}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Stored in SQLite WAL</span>
            <span className="font-semibold text-emerald-500">Verified Audit</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. CHARTS SECTION (Historical Trend & Model Comparison)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Premium History Trend Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Premium Progression & Trend
              </h3>
              <p className="text-xs text-slate-400">Historical predicted quotes over time</p>
            </div>
            <span className="text-[11px] font-mono text-[#3867FF] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
              INR Annual
            </span>
          </div>

          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3867FF" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3867FF" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8993A7' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8993A7' }} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Premium']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  />
                  <Area type="monotone" dataKey="premium" stroke="#3867FF" strokeWidth={3} fillOpacity={1} fill="url(#premiumGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <BarChart3 className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs">No historical predictions recorded yet.</p>
                <button
                  onClick={() => navigate('/predict')}
                  className="mt-3 text-xs font-bold text-[#3867FF] hover:underline"
                >
                  Run your first calculation →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Triple Model Comparison Bar Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Multi-Model Consensus
              </h3>
              <p className="text-xs text-slate-400">Latest run cross-model divergence</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-[#7657FF] dark:bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800">
              Ensemble
            </span>
          </div>

          <div className="h-64 w-full">
            {comparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#8993A7' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#8993A7' }} width={120} tickLine={false} />
                  <Tooltip 
                    formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Calculated Premium']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  />
                  <Bar dataKey="premium" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Layers className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-xs">Run a prediction to view cross-model comparison.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* =========================================================================
          4. HEALTH & WEARABLE TELEMETRY STATUS
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Watch className="w-4 h-4 text-[#3867FF]" />
              <span>Biometric & Wearable Telemetry</span>
            </h3>
            <p className="text-xs text-slate-400">Live health indicators influencing dynamic risk underwriting</p>
          </div>
          <button
            onClick={() => onOpenWearable ? onOpenWearable() : null}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#3867FF] transition-all cursor-pointer self-start sm:self-auto"
          >
            Update Wearable Metrics
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Footprints className="w-3.5 h-3.5 text-[#12B981]" />
              Daily Steps
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {(wearable?.steps || profile?.daily_steps || 7500).toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-slate-400">Target: 8,000+ steps</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Resting Heart Rate
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {wearable?.heart_rate || profile?.heart_rate || 72} <span className="text-xs font-normal">bpm</span>
            </div>
            <p className="text-[10px] text-emerald-500 font-semibold">Normal range (60 - 80)</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#7657FF]" />
              Physical Activity
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white capitalize">
              {wearable?.activity_level || profile?.physical_activity || 'Moderate'}
            </div>
            <p className="text-[10px] text-slate-400">Regular Cardio</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
              Preventative Checkup
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {profile?.regular_checkups !== false ? 'Annual Done' : 'Due Soon'}
            </div>
            <p className="text-[10px] text-slate-400">5% policy renewal credit</p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. RECENT PREDICTIONS TABLE
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Underwriting Records
            </h3>
            <p className="text-xs text-slate-400">Authenticated insurance calculations with audit certificates</p>
          </div>
          <button
            onClick={() => navigate('/predictions/history')}
            className="text-xs font-bold text-[#3867FF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Archive</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="pb-3 font-bold">Assessment ID</th>
                  <th className="pb-3 font-bold">Date & Time</th>
                  <th className="pb-3 font-bold">Calculated Premium</th>
                  <th className="pb-3 font-bold">Designated Model</th>
                  <th className="pb-3 font-bold">Risk Classification</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {history.slice(0, 5).map((rec) => (
                  <tr 
                    key={rec.id}
                    onClick={() => onViewPrediction ? onViewPrediction(rec.id) : null}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-bold text-slate-800 dark:text-slate-200">
                      #{rec.id}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 font-sans">
                      {new Date(rec.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white text-sm">
                      ₹{rec.predicted_premium_inr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                      {rec.model_used}
                    </td>
                    <td className="py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.risk_category?.includes('High') 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : rec.risk_category?.includes('Moderate')
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {rec.risk_category}
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={(e) => handleDownloadPdf(rec.id, e)}
                        disabled={downloadingId === rec.id}
                        className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-[#3867FF] hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title="Download Underwriting PDF"
                      >
                        {downloadingId === rec.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-[#3867FF] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold">PDF</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 space-y-3">
            <p className="text-xs">You have not calculated any insurance premiums yet.</p>
            <button
              onClick={() => navigate('/predict')}
              className="px-5 py-2.5 rounded-xl bg-[#3867FF] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Start Free Health Prediction
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
