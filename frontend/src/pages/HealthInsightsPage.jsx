import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
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
  ArrowRight
} from 'lucide-react';

export default function HealthInsightsPage({ setActivePage }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const bmiData = insights?.bmi_analysis || { current_bmi: 24.5, category: 'Normal', delta_to_normal: 0 };
  const smokingData = insights?.smoking_impact || { is_smoker: false, message: 'Non-smoker status grants standard discounts.' };
  const activityData = insights?.activity_analysis || { daily_steps: 7500, status: 'Active' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Biometric & Actuarial Wellness Hub</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Health Insights & Risk Decomposition
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Deep analysis of your physiological telemetry and its direct correlation to underwriting premium rates.
        </p>
      </div>

      {/* Prominent Educational Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Educational & Preventative Notice:</span> PremiumPulse is an actuarial estimation and risk awareness engine powered by machine learning. It is designed to inspire healthier lifestyle habits and does not constitute a formal medical diagnosis or binding health insurer contract.
        </div>
      </div>

      {/* Grid of Key Health Domains */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. BMI Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Body Composition
              </span>
              <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {bmiData.current_bmi}
            </div>
            <div className="text-xs font-bold text-violet-600 mb-3">
              Classification: {bmiData.category}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard clinical threshold for optimal cardiovascular and metabolic health is 18.5 - 24.9.
              {bmiData.delta_to_normal > 0 ? (
                <span className="text-rose-600 block mt-1 font-semibold">
                  You are {bmiData.delta_to_normal} points above the normal BMI range.
                </span>
              ) : (
                <span className="text-emerald-600 block mt-1 font-semibold">
                  Your BMI is currently in the preferred baseline range.
                </span>
              )}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            * Insurers add compound loadings for BMI &gt; 30.
          </div>
        </div>

        {/* 2. Tobacco Impact */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tobacco Risk Factor
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">
              {smokingData.is_smoker ? 'Active Tobacco User' : 'Non-Smoker'}
            </div>
            <div className="text-xs font-bold text-slate-500 mb-3">
              Actuarial Loading: {smokingData.is_smoker ? '+48% Surcharge' : '0% (Standard Base)'}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {smokingData.message}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            * Medical claims among active smokers average 2.5x higher.
          </div>
        </div>

        {/* 3. Daily Activity & Cardiovascular Mobility */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Physical Mobility
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Footprints className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {activityData.daily_steps?.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-blue-600 mb-3">
              Status: {activityData.status}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consistently exceeding 8,000 to 10,000 steps daily correlates with a 38% reduction in chronic cardiovascular morbidity.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            * Wearable sync directly calibrates dynamic discounts.
          </div>
        </div>
      </div>

      {/* Wellness & Preventive Health Protocols */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Recommended Preventive Action Protocols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Comprehensive Annual Preventative Screenings
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Schedule blood lipid panels, HbA1c, and resting blood pressure screenings annually to catch chronic conditions before clinical symptoms emerge.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Zone-2 Aerobic Cardiovascular Conditioning
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Engage in 150 minutes of moderate-intensity endurance training weekly (brisk walking, cycling, or swimming) to sustain a resting heart rate below 70 BPM.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Want to see how your health parameters impact your insurance rates?
          </p>
          <button
            onClick={() => setActivePage('predict')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Run New Prediction</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

