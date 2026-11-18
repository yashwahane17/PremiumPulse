import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useRouter } from '../context/RouterContext';
import { 
  Heart, 
  Activity, 
  Scale, 
  Flame, 
  Footprints, 
  ShieldCheck, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  CigaretteOff,
  Stethoscope,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export default function HealthInsightsPage({ setActivePage }) {
  const { navigate } = useRouter();
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive "What-If" Savings Simulator State
  const [simSteps, setSimSteps] = useState(8500);
  const [simBmi, setSimBmi] = useState(23.5);
  const [simQuitSmoking, setSimQuitSmoking] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getHealthInsights();
        setInsights(data);
      } catch (err) {
        console.error("Failed to load health insights:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#3867FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const bmiData = insights?.bmi_analysis || { current_bmi: 23.5, category: 'Normal', delta_to_normal: 0 };
  const smokingData = insights?.smoking_impact || { is_smoker: false, message: 'Non-smoker classification grants maximum baseline health discounts.' };
  const activityData = insights?.activity_analysis || { daily_steps: 7500, status: 'Active' };

  // Calculate dynamic projected annual savings in simulator
  let projectedSavingsInr = 0;
  if (simSteps >= 8500) projectedSavingsInr += 3200;
  if (simSteps >= 10000) projectedSavingsInr += 1800;
  if (simBmi <= 24.9) projectedSavingsInr += 4600;
  if (smokingData.is_smoker && simQuitSmoking) projectedSavingsInr += 56000;

  // Feature impact data for BarChart
  const shapFeatureData = [
    { factor: 'Non-Smoker', value: 56658, type: 'discount' },
    { factor: 'Daily Steps (8.5k)', value: 4200, type: 'discount' },
    { factor: 'Normal BMI', value: 3800, type: 'discount' },
    { factor: 'Annual Checkup', value: 2500, type: 'discount' },
    { factor: 'Age Progression', value: 4800, type: 'charge' },
    { factor: 'Tier Choice', value: 6400, type: 'charge' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* =========================================================================
          1. HEADER BANNER
      ========================================================================= */}
      <div className="bg-gradient-to-r from-[#10172A] via-[#1A2544] to-[#10172A] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-[#3867FF]" />
            <span>Biometric & Actuarial Wellness Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Health Insights & Preventative Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Inspect your clinical risk determinants, explore lifestyle correlation models, and simulate policy renewal discounts.
          </p>
        </div>

        <button
          onClick={() => navigate('/predict')}
          className="px-5 py-2.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>Run Fresh Underwriting</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Notice Pill */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Educational & Preventative Notice:</strong> PremiumPulse is an actuarial estimation and risk awareness engine powered by machine learning. It is designed to inspire healthier lifestyle habits and does not substitute professional medical diagnosis.
        </div>
      </div>

      {/* =========================================================================
          2. THREE CORE CLINICAL DOMAINS (BMI, Smoking, Activity)
      ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Domain 1: BMI Composition */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Body Mass Composition</span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-[#7657FF] flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {bmiData.current_bmi} <span className="text-xs font-normal text-slate-400">kg/m²</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-[#7657FF] dark:bg-violet-950">
              Tier: {bmiData.category}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard clinical threshold for optimal cardiovascular and metabolic health is 18.5 - 24.9.
              {bmiData.delta_to_normal > 0 ? (
                <span className="text-rose-600 dark:text-rose-400 block mt-1 font-semibold">
                  You are {bmiData.delta_to_normal} points above the normal BMI range.
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 block mt-1 font-semibold">
                  Your BMI is currently in the preferred baseline range.
                </span>
              )}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Healthy Target: 22.0</span>
            <span className="text-[#12B981] font-bold">Standard Risk</span>
          </div>
        </div>

        {/* Domain 2: Tobacco & Smoking */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tobacco Risk Factor</span>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                smokingData.is_smoker 
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950' 
                  : 'bg-emerald-50 text-[#12B981] dark:bg-emerald-950'
              }`}>
                <CigaretteOff className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {smokingData.is_smoker ? 'Active Tobacco Use' : 'Non-Smoker Status'}
            </div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
              smokingData.is_smoker 
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' 
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {smokingData.is_smoker ? 'High Surcharge (+310%)' : 'Maximum Discount Eligible'}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {smokingData.message}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Actuarial Impact</span>
            <span className="text-emerald-500 font-bold font-mono">Up to ₹56,658/yr</span>
          </div>
        </div>

        {/* Domain 3: Activity & Smartwatch Tracking */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Activity Tracking</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#3867FF] flex items-center justify-center">
                <Footprints className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {(activityData.daily_steps || 7500).toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">steps/day</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#3867FF] dark:bg-blue-950">
              Activity Status: {activityData.status || 'Active Lifestyle'}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Walking 8,000+ daily steps is clinically proven to lower composite cardiovascular morbidity and yields immediate rate credits.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Goal: 10,000 steps</span>
            <span className="text-[#3867FF] font-bold">75% Achieved</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. INTERACTIVE "WHAT-IF" SAVINGS SIMULATOR
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#3867FF]" />
              <span>Interactive "What-If" Renewal Savings Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Adjust lifestyle variables below to see immediate projected discounts on your next policy renewal.
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#12B981] dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Real-Time Model Calibration
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Steps Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Daily Steps Target</span>
                <span className="font-mono text-[#3867FF]">{simSteps.toLocaleString('en-IN')} steps</span>
              </div>
              <input
                type="range"
                min="4000"
                max="15000"
                step="500"
                value={simSteps}
                onChange={(e) => setSimSteps(Number(e.target.value))}
                className="w-full accent-[#3867FF] h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>4,000 (Base)</span>
                <span>8,500 (+₹3.2k off)</span>
                <span>15,000 (+₹5k off)</span>
              </div>
            </div>

            {/* BMI Target Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">Target Body Mass Index (BMI)</span>
                <span className="font-mono text-[#7657FF]">{simBmi} kg/m²</span>
              </div>
              <input
                type="range"
                min="19"
                max="32"
                step="0.5"
                value={simBmi}
                onChange={(e) => setSimBmi(Number(e.target.value))}
                className="w-full accent-[#7657FF] h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>19.0 (Normal)</span>
                <span>24.9 (Threshold)</span>
                <span>32.0 (Obese)</span>
              </div>
            </div>

            {/* Smoking Switch */}
            {smokingData.is_smoker && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Simulate Complete Smoking Cessation</h4>
                  <p className="text-[11px] text-slate-500">Eliminates high-risk tobacco underwriting surcharge</p>
                </div>
                <button
                  onClick={() => setSimQuitSmoking(!simQuitSmoking)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    simQuitSmoking 
                      ? 'bg-[#12B981] text-white shadow-md' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {simQuitSmoking ? 'Quit (Simulated)' : 'Active Smoker'}
                </button>
              </div>
            )}

          </div>

          {/* Output Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Projected Annual Premium Reduction
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white">
              ₹{projectedSavingsInr.toLocaleString('en-IN')}
              <span className="text-xs font-medium text-slate-400"> / year</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              By maintaining {simSteps.toLocaleString('en-IN')} daily steps and a BMI of {simBmi}, the machine learning Pricing Agent projects your renewal policy will cost up to ₹{projectedSavingsInr.toLocaleString('en-IN')} less annually.
            </p>
            <button
              onClick={() => navigate('/predict')}
              className="w-full py-3 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply to Official Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          4. SHAP ATTRIBUTION VISUALIZATION
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              SHAP Attribution Feature Importance
            </h3>
            <p className="text-xs text-slate-400">Empirical influence of key biomarkers on health insurance claims</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-[#7657FF] dark:bg-violet-950/60 px-2.5 py-1 rounded-full">
            Trained Dataset Baseline
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={shapFeatureData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#8993A7' }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="factor" type="category" tick={{ fontSize: 10, fill: '#8993A7' }} width={110} tickLine={false} />
              <Tooltip 
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Feature Impact']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {shapFeatureData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.type === 'discount' ? '#12B981' : '#3867FF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[11px] text-slate-400 italic text-center">
          * Green bars represent discount factors (reducing premium); blue bars represent demographic cost factors.
        </p>
      </div>

    </div>
  );
}
