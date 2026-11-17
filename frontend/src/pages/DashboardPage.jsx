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
  FileDown, 
  Watch, 
  Heart, 
  Footprints, 
  Scale, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Download,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Zap,
  Cigarette,
  CigaretteOff
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
      setErrorMsg(err.message || 'Failed to load dashboard.');
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
        <div className="h-28 bg-slate-200/80 rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200/80 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-200/80 rounded-3xl lg:col-span-2" />
          <div className="h-80 bg-slate-200/80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-rose-900">Failed to load health telemetry</h3>
        <p className="text-xs text-rose-700 max-w-md mx-auto">{errorMsg}</p>
        <button
          onClick={fetchDashboard}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const latest = data?.latest_prediction;
  const profile = data?.health_profile;
  const history = data?.history || [];
  const wearable = data?.wearable_latest;

  // Chart data
  const chartData = [...history].reverse().map(h => ({
    name: h.date_formatted || h.created_at?.slice(5, 10),
    premium: h.predicted_premium_inr,
    bmi: h.bmi,
    id: h.id
  }));

  // Historical trend comparison (if at least 2 predictions exist)
  let trendDiff = 0;
  let trendPct = 0;
  if (history.length >= 2) {
    const current = history[0].predicted_premium_inr;
    const previous = history[1].predicted_premium_inr;
    trendDiff = current - previous;
    trendPct = Math.round((trendDiff / previous) * 100);
  }

  // Risk styling
  const getRiskStyle = (cat) => {
    if (cat === 'Low Risk') {
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        text: 'Healthy profile qualifies for standard preferred underwriting.'
      };
    } else if (cat === 'Moderate Risk') {
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        text: 'Moderate clinical or lifestyle risk adjustments applied.'
      };
    } else {
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        text: 'Elevated risk parameters identified (BMI or smoking status).'
      };
    }
  };

  const riskStyle = getRiskStyle(latest?.risk_category || 'Low Risk');

  // BMI status
  const bmiVal = latest?.bmi || profile?.bmi || 22.5;
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-600' };
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-emerald-600' };
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600' };
    return { label: 'Obese', color: 'text-rose-600' };
  };
  const bmiInfo = getBmiCategory(bmiVal);

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. WELCOME BANNER & WEARABLE STATUS BAR */}
      {/* ========================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white shadow-xl shadow-blue-500/15 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-[11px] font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Driven Healthcare Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Welcome to your Health Underwriting Portal
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Personalized health insurance quotes benchmarked on 3 machine learning models, underwritten by 4 autonomous agents.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/predict')}
            className="px-5 py-3 rounded-2xl bg-white text-blue-700 font-extrabold text-xs shadow-lg shadow-black/10 hover:bg-blue-50 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <PlusCircle className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform" />
            <span>Recalculate Estimate</span>
          </button>

          <button
            onClick={onOpenWearable}
            className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Watch className="w-4 h-4 text-amber-300" />
            <span>Sync Wearables</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DASHBOARD SUMMARY CARDS (4 CARDS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Estimated Annual Premium */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 relative group overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shadow-xs">
              ₹
            </div>
            {trendDiff !== 0 && (
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                trendDiff < 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {trendDiff < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(trendPct)}%
              </span>
            )}
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Estimated Annual Premium
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {latest ? `₹${latest.predicted_premium_inr?.toLocaleString('en-IN')}` : '₹—'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 truncate">
            {latest ? (
              <span>Range: ₹{latest.premium_range_min?.toLocaleString('en-IN')} - ₹{latest.premium_range_max?.toLocaleString('en-IN')}</span>
            ) : (
              <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => navigate('/predict')}>Run your first estimate →</span>
            )}
          </div>
        </div>

        {/* Card 2: Current Health Risk */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 relative group overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${riskStyle.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${riskStyle.dot}`}></span>
              {latest?.risk_category || 'Low Risk'}
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Current Health Risk
          </div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {latest?.risk_category || 'Low Risk Tier'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            Risk Score: {latest?.risk_score !== undefined ? `${latest.risk_score} / 100` : 'Standard'}
          </div>
        </div>

        {/* Card 3: BMI Score */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 relative group overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <span className={`text-[11px] font-extrabold ${bmiInfo.color}`}>
              {bmiInfo.label}
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Body Mass Index (BMI)
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {bmiVal}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Healthy baseline range: 18.5 – 24.9
          </div>
        </div>

        {/* Card 4: Last Prediction */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 relative group overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {latest?.model_used?.split(' ')[0] || 'XGBoost'}
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Last Prediction Event
          </div>
          <div className="text-base font-black text-slate-900 mt-1 truncate">
            {latest?.created_at ? new Date(latest.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 truncate">
            {history.length} total prediction runs logged
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. HEALTH OVERVIEW & WEARABLE TELEMETRY */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Health Telemetry Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Personal Health & Lifestyle Overview</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time health factors analyzed by Risk & Pricing Agents
                </p>
              </div>

              <button
                onClick={() => navigate('/profile')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <span>Edit Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5 Health Indicators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Indicator 1: BMI Meter */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-600" />
                    <span>BMI Status</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">{bmiVal}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-amber-400 h-full w-[25%]" title="Underweight" />
                  <div className="bg-emerald-500 h-full w-[35%]" title="Normal" />
                  <div className="bg-orange-400 h-full w-[25%]" title="Overweight" />
                  <div className="bg-rose-500 h-full w-[15%]" title="Obese" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>18.5</span>
                  <span className="font-bold text-emerald-600">Optimal: 22.0</span>
                  <span>30.0+</span>
                </div>
              </div>

              {/* Indicator 2: Daily Steps */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1.5">
                    <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Daily Steps</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {profile?.daily_steps || wearable?.steps || 7500}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, ((profile?.daily_steps || 7500) / 10000) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Goal: 10,000</span>
                  <span className="font-bold text-emerald-600">Active Mover</span>
                </div>
              </div>

              {/* Indicator 3: Heart Rate */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span>Resting Heart Rate</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {profile?.heart_rate || wearable?.heart_rate || 72} BPM
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[65%] rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Normal: 60-100</span>
                  <span className="font-bold text-emerald-600">Resting Normal</span>
                </div>
              </div>

              {/* Indicator 4: Physical Activity */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Activity Level</span>
                  </span>
                  <span className="capitalize font-bold text-slate-900">
                    {profile?.physical_activity || 'Moderate'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[70%] rounded-full" />
                </div>
                <div className="text-[10px] text-slate-400">
                  3-4 sessions per week (Cardio & Strength)
                </div>
              </div>

              {/* Indicator 5: Smoking Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 sm:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-bold flex items-center gap-1.5">
                    {profile?.smoker === 'yes' ? (
                      <Cigarette className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <CigaretteOff className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>Tobacco / Smoking Status</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    profile?.smoker === 'yes' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {profile?.smoker === 'yes' ? 'Smoker (High Risk Impact)' : 'Non-Smoker (40% Lower Premium)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Smoking is the single highest actuarial pricing variable in health underwriting datasets.
                </p>
              </div>
            </div>
          </div>

          {/* Premium History Recharts Area Chart */}
          {chartData.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-emerald-600" />
                    <span>Premium Estimate Trajectory Over Time</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Historical policy pricing records for this account</p>
                </div>

                <button
                  onClick={() => navigate('/predictions/history')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({history.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="₹" />
                    <Tooltip 
                      formatter={(val) => [`₹${val?.toLocaleString('en-IN')}`, 'Predicted Premium']}
                      contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="premium" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#premiumGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Insurance Benefits Section & Quick Actions */}
        <div className="space-y-6">
          {/* Insurance Benefits Estimate Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-black text-slate-900">Estimated Insurance Policy Coverage</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Predictive Model Underwriting</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-blue-600">Base Sum Insured</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">₹10,00,000</div>
                  <div className="text-[10px] text-slate-500">Inpatient Hospitalization & ICU</div>
                </div>
                <ShieldCheck className="w-8 h-8 text-blue-500/80" />
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-indigo-600">Estimated Annual Premium</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {latest ? `₹${latest.predicted_premium_inr?.toLocaleString('en-IN')}` : '₹—'}
                  </div>
                  <div className="text-[10px] text-slate-500">Taxes & underwriting charges included</div>
                </div>
                <div className="text-xs font-bold text-indigo-600 font-mono">12-Mo</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Covered Dependents</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {profile?.dependents || 0} Children / Dependents
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">
                  Standard Plan
                </span>
              </div>
            </div>

            {/* Actuarial Notice Disclaimer */}
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 mb-0.5">
                <Info className="w-3.5 h-3.5 text-amber-600" />
                <span>Actuarial Prediction Notice</span>
              </p>
              Premium estimates are generated by predictive ML models for educational wellness awareness and do not constitute an officially binding policy.
            </div>

            {latest && (
              <button
                onClick={(e) => handleDownloadPdf(latest.id, e)}
                disabled={downloadingId === latest.id}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingId === latest.id ? 'Generating PDF...' : 'Download Estimate Certificate'}</span>
              </button>
            )}
          </div>

          {/* Quick Recalculate CTA */}
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-violet-500/15 space-y-3">
            <h4 className="font-black text-sm">Need a refined estimate?</h4>
            <p className="text-xs text-violet-100 leading-relaxed">
              Have your weight, daily steps, or medical habits changed? Update your parameters to see how your premium changes dynamically.
            </p>
            <button
              onClick={() => navigate('/predict')}
              className="w-full py-2.5 rounded-xl bg-white text-indigo-700 font-extrabold text-xs hover:bg-violet-50 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Launch Prediction Agent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
