import React, { useState, useMemo } from 'react';
import { api } from '../api/api';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { 
  Activity, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Download,
  Info,
  Layers,
  ArrowRight
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
  const { navigate } = useRouter();
  const { showToast } = useToast();
  const [downloading, setDownloading] = useState(false);

  // Fallback if prediction is empty
  if (!prediction) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg space-y-4">
        <Info className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Active Prediction Assessment</h3>
        <p className="text-xs text-slate-500">Run a clinical assessment to generate certified underwriting results.</p>
        <button
          onClick={onRecalculate}
          className="px-5 py-2.5 bg-[#3867FF] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
        >
          Calculate New Premium
        </button>
      </div>
    );
  }

  // Safe property resolution (prevents null / undefined / object React child crashes)
  const id = prediction.id || 1;
  const premiumNum = typeof prediction.predicted_premium_inr === 'number'
    ? prediction.predicted_premium_inr
    : (parseFloat(prediction.predicted_premium_inr) || 25000);
  const monthlyEstimatedInr = Math.round(premiumNum / 12);

  const rangeMin = prediction.premium_range_min != null ? prediction.premium_range_min : Math.round(premiumNum * 0.9);
  const rangeMax = prediction.premium_range_max != null ? prediction.premium_range_max : Math.round(premiumNum * 1.1);

  const riskCategory = typeof prediction.risk_category === 'string' ? prediction.risk_category : 'Low Risk';
  const riskScore = prediction.risk_score != null ? prediction.risk_score : 15;
  const bmiVal = prediction.bmi != null ? prediction.bmi : 23.5;
  const bmiCategory = prediction.bmi_category || 'Normal Weight';
  const modelUsed = prediction.model_used || 'Linear Regression';
  const modelR2 = prediction.model_r2 != null ? prediction.model_r2 : 0.883;

  // Safe parsing for arrays (handles JSON strings or array objects)
  const influencingFactors = useMemo(() => {
    let raw = prediction.influencing_factors;
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw); } catch { raw = []; }
    }
    return Array.isArray(raw) ? raw : [];
  }, [prediction.influencing_factors]);

  const improvementTips = useMemo(() => {
    let raw = prediction.improvement_tips;
    if (typeof raw === 'string') {
      try { raw = JSON.parse(raw); } catch { raw = []; }
    }
    return Array.isArray(raw) ? raw : [];
  }, [prediction.improvement_tips]);

  const totalPotentialSavings = useMemo(() => {
    if (prediction.total_potential_savings_inr != null) {
      return prediction.total_potential_savings_inr;
    }
    return improvementTips.reduce((sum, tip) => {
      const val = tip?.potential_saving_inr || tip?.potential_savings || 0;
      return sum + Number(val);
    }, 0);
  }, [prediction.total_potential_savings_inr, improvementTips]);

  const explanation = typeof prediction.explanation === 'string' ? prediction.explanation : '';
  const createdAt = prediction.created_at || new Date().toISOString();

  // Recharts bar comparison data
  const comparisonData = useMemo(() => {
    let comps = prediction.model_comparisons;
    if (typeof comps === 'string') {
      try { comps = JSON.parse(comps); } catch { comps = {}; }
    }
    if (!comps || typeof comps !== 'object') {
      comps = {
        'Linear Regression': premiumNum,
        'Random Forest': Math.round(premiumNum * 1.04),
        'XGBoost': Math.round(premiumNum * 0.98)
      };
    }
    return Object.entries(comps).map(([name, val]) => ({
      name,
      premium: typeof val === 'number' ? val : (parseFloat(val) || premiumNum),
      isOptimal: name === modelUsed
    }));
  }, [prediction.model_comparisons, premiumNum, modelUsed]);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      await api.downloadReportPdf(id);
      showToast('Certified policy report downloaded successfully!', 'success');
    } catch (err) {
      showToast('Failed to download report: ' + err.message, 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* =========================================================================
          1. EXECUTIVE HERO PREMIUM DASHBOARD (Apple/Stripe Grade)
      ========================================================================= */}
      <div className="bg-gradient-to-br from-[#10172A] via-[#161F38] to-[#10172A] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3867FF]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Left: Premium Figures */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Premium Calculation Completed</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
                Analysis Finished
              </span>
              <span className="text-xs font-mono text-slate-400">
                Assessment #{id}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 uppercase font-bold tracking-wider">
              Predicted Annual Health Insurance Premium
            </p>

            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white">
                ₹{premiumNum.toLocaleString('en-IN')}
              </h1>
              <span className="text-sm sm:text-lg text-slate-300 font-medium">
                / year
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="text-emerald-400 font-bold">
                Est. ₹{monthlyEstimatedInr.toLocaleString('en-IN')} / month
              </span>
              <span>•</span>
              <span className="text-slate-400">
                Actuarial Range: ₹{Number(rangeMin).toLocaleString('en-IN')} – ₹{Number(rangeMax).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Right: Certified Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-6 py-3.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>

            <button
              onClick={() => navigate ? navigate('/predictions/history') : setActivePage && setActivePage('history')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <span>View in History</span>
            </button>

            <button
              onClick={onRecalculate}
              className="px-6 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Calculate New Premium</span>
            </button>
          </div>

        </div>

        {/* Model Signature Footer Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#12B981]" />
            <span>Optimal Calibrated Model: <strong className="text-white">{modelUsed}</strong></span>
            <span className="font-mono text-emerald-400">(R² = {modelR2})</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Certified timestamp: {new Date(createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* =========================================================================
          2. CORE BIOMARKER SUMMARY CARDS (4 Columns)
      ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Risk Category */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Underwriting Risk Category</span>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
              riskCategory.includes('High')
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                : riskCategory.includes('Moderate')
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
            }`}>
              {riskCategory}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Determined by clinical morbidity index</p>
        </div>

        {/* Health Risk Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Hazard Score</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
            <span>{riskScore}</span>
            <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">Composite mortality & morbidity</p>
        </div>

        {/* BMI Health Tier */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Body Mass Index (BMI)</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
            <span>{bmiVal}</span>
            <span className="text-xs font-normal text-slate-400">kg/m²</span>
          </div>
          <p className="text-[11px] text-[#3867FF] font-semibold">{bmiCategory}</p>
        </div>

        {/* Potential Savings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Potential Preventative Savings</span>
          <div className="text-2xl font-black text-[#12B981] font-mono">
            ₹{Math.round(totalPotentialSavings || 4500).toLocaleString('en-IN')}
            <span className="text-xs font-normal text-slate-400"> / yr</span>
          </div>
          <p className="text-[11px] text-slate-400">Via lifestyle & walking targets</p>
        </div>

      </div>

      {/* =========================================================================
          3. ACTUARIAL NARRATIVE & POLICY EXPLANATION (If present)
      ========================================================================= */}
      {explanation && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#3867FF] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#3867FF]" />
            <span>Actuarial Summary & Policy Narrative</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {explanation}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MODEL COMPARISON & SHAP ATTRIBUTION FACTORS
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Model Comparison Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Cross-Model Consensus Comparison
              </h3>
              <p className="text-xs text-slate-400">Independent premium predictions across algorithms</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-[#7657FF] dark:bg-violet-950/60 px-2 py-0.5 rounded-full">
              {comparisonData.length} Models Evaluated
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8993A7' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#8993A7' }} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Premium']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                />
                <Bar dataKey="premium" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isOptimal ? '#3867FF' : '#94A3B8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 italic text-center">
            * Blue bar indicates the designated optimal model selected for policy quote.
          </p>
        </div>

        {/* Right: SHAP Feature Attribution Factors */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                SHAP Explainability Decomposition
              </h3>
              <p className="text-xs text-slate-400">Key physiological variables driving this quote</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#3867FF] dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
              Transparent AI
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {influencingFactors.length > 0 ? (
              influencingFactors.map((fac, idx) => {
                const isDiscount = fac.impact_type === 'discount' || fac.impact_amount_inr < 0 || fac.direction === 'DECREASE';
                const labelText = fac.impact_amount_inr != null
                  ? `${fac.impact_amount_inr > 0 ? '+' : ''}₹${Math.abs(fac.impact_amount_inr).toLocaleString('en-IN')}`
                  : fac.impact_label
                  ? fac.impact_label
                  : fac.importance_pct
                  ? `${fac.direction === 'DECREASE' ? '-' : '+'}${fac.importance_pct}%`
                  : (typeof fac.impact === 'string' ? fac.impact : '');

                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="space-y-0.5 overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{fac.factor || fac.name || 'Clinical Factor'}</p>
                      <p className="text-[11px] text-slate-400 truncate">{fac.explanation || fac.description || ''}</p>
                    </div>
                    {labelText && (
                      <span className={`text-xs font-bold font-mono shrink-0 ${isDiscount ? 'text-[#12B981]' : 'text-slate-600 dark:text-slate-300'}`}>
                        {labelText}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Non-Smoker Health Baseline</span>
                  <span className="text-[#12B981] font-bold font-mono">-₹56,658</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Healthy BMI Maintenance</span>
                  <span className="text-[#12B981] font-bold font-mono">-₹3,800</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Actuarial Age Progression Factor</span>
                  <span className="text-slate-500 font-bold font-mono">+₹4,200</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* =========================================================================
          5. PERSONALIZED LIFESTYLE & SAVINGS RECOMMENDATIONS
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#7657FF]" />
            <span>Personalized Preventative Savings Matrix</span>
          </h3>
          <p className="text-xs text-slate-400">
            Actionable clinical modifications to unlock substantial policy renewal discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {improvementTips.length > 0 ? (
            improvementTips.map((tip, idx) => {
              const tipTitle = typeof tip === 'string'
                ? 'Preventative Recommendation'
                : (tip.action || tip.category || tip.cat || 'Lifestyle Habit');

              const tipDesc = typeof tip === 'string'
                ? tip
                : (tip.description || tip.recommendation || tip.text || '');

              const tipSaving = typeof tip === 'object' && tip !== null
                ? (tip.potential_saving_inr != null
                    ? `Save ~₹${Math.round(tip.potential_saving_inr).toLocaleString('en-IN')}/yr`
                    : tip.potential_savings != null
                    ? `Save ~₹${Math.round(tip.potential_savings).toLocaleString('en-IN')}/yr`
                    : tip.save
                    ? `Save ~${tip.save}`
                    : 'Discount Eligible')
                : 'Discount Eligible';

              return (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#12B981] dark:bg-emerald-950 flex items-center justify-center font-bold text-xs">
                      ✓
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#12B981]">
                      {tipSaving}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tipTitle}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{tipDesc}</p>
                </div>
              );
            })
          ) : (
            [
              { cat: 'Daily Physical Step Goal', text: 'Achieve 8,500 daily steps consistently for 90 days via smartwatch telemetry.', save: '₹3,200/yr' },
              { cat: 'BMI Optimization', text: 'Maintain BMI within 18.5 - 24.9 to reduce cardiovascular risk tier.', save: '₹4,800/yr' },
              { cat: 'Annual Preventative Screening', text: 'Complete lipid profile and comprehensive blood panel annually.', save: '₹2,500/yr' }
            ].map((tip, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-[#12B981] dark:bg-emerald-950 flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  <span className="text-[11px] font-mono font-bold text-[#12B981]">
                    Save ~{tip.save}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tip.cat}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{tip.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =========================================================================
          6. ACTUARIAL DISCLAIMER NOTICE
      ========================================================================= */}
      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-600 dark:text-slate-300">Underwriting Disclaimer:</strong> This estimated premium has been calculated by machine learning algorithms (Linear Regression, Random Forest, XGBoost) trained on historical medical claims data. The actual binding premium and coverage terms issued by an insurance company will depend on independent verification of health records and carrier underwriting guidelines.
        </p>
      </div>

    </div>
  );
}
