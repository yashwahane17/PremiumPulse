import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Activity, ShieldCheck, Heart, Sparkles, Award, Shield } from 'lucide-react';

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Premium<span className="text-blue-500">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              AI-Agent powered health insurance underwriting & dynamic premium prediction platform. Engineered for The Big Hack 2026.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-800 text-blue-400 text-[11px] font-medium">
              <Award className="w-3.5 h-3.5" />
              The Big Hack 2026 Official Entry
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              Autonomous AI Agents
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Intake Agent (Validation)
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Risk Assessment Agent (Stratification)
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                Pricing Agent (Multi-Model ML)
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Insight Agent (XAI & Savings)
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Central Orchestrator (Synthesis)
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              Machine Learning Core
            </h4>
            <ul className="space-y-2">
              <li>Linear Regression (OLS Baseline)</li>
              <li>Random Forest Regressor (Ensemble)</li>
              <li>XGBoost Regressor (Gradient Boosted)</li>
              <li>Kaggle Medical Cost Personal Dataset</li>
              <li>Explainable AI (Feature Importances)</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 text-xs uppercase tracking-wider">
              Regulatory Notice
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-4">
              PremiumPulse estimates are for educational and risk awareness purposes. Real insurance underwriting requires official clinical screening and insurer approval.
            </p>
            <button
              onClick={() => navigate('/admin/login')}
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Shield className="w-3 h-3 text-slate-500" />
              <span>Enterprise Admin Portal</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © 2026 PremiumPulse Inc. Built for The Big Hack 2026. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>FastAPI + React 19 + Scikit-Learn + XGBoost</span>
          </div>
        </div>
      </div>
    </footer>
  );
}