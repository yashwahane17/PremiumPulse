import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Activity, ShieldCheck, Heart, Sparkles, Award, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#10172A] text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3867FF] to-[#7657FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Premium<span className="text-[#3867FF]">Pulse</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Next-generation InsurTech intelligence platform delivering ultra-fast, explainable, and personalized health insurance premium underwriting powered by autonomous multi-agent machine learning.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#12B981]" />
                HIPAA Aligned Architecture
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-[11px] font-medium">
                <Lock className="w-3.5 h-3.5 text-[#3867FF]" />
                256-bit AES Encryption
              </div>
            </div>
          </div>

          {/* Autonomous Agents */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Autonomous Agents
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#3867FF]"></span>
                Intake Agent (Validation)
              </li>
              <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#12B981]"></span>
                Risk Assessment Agent
              </li>
              <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-[#7657FF]"></span>
                Pricing Agent (Multi-Model)
              </li>
              <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Insight Agent (SHAP & XAI)
              </li>
              <li className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Central Orchestrator
              </li>
            </ul>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => navigate('/predict')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Predict Premium
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/health-insights')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Health Analytics & Insights
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/predictions/history')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Prediction History
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/documents')} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Underwriting Reports
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/admin/login')} 
                  className="hover:text-[#3867FF] transition-colors cursor-pointer text-slate-500"
                >
                  Enterprise Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Machine Learning Specs */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              ML Architecture
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center justify-between text-slate-400">
                <span>Primary Benchmark</span>
                <span className="font-mono text-slate-200">Linear Reg</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>Ensemble Regressor</span>
                <span className="font-mono text-slate-200">Random Forest</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>Gradient Boosting</span>
                <span className="font-mono text-slate-200">XGBoost</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>Target Response</span>
                <span className="text-[#12B981] font-bold">&lt; 30 ms</span>
              </li>
              <li className="flex items-center justify-between text-slate-400">
                <span>Model R² Benchmark</span>
                <span className="font-mono text-slate-200">0.883</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actuarial & Legal Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Actuarial Notice & Underwriting Disclaimer:</strong> PremiumPulse leverages predictive statistical algorithms and ensemble machine learning models to calculate personalized health risk estimates and premium ranges. Calculations are calibrated against standard actuarial tables and medical cost data. Actual binding policy issuance, premiums, and coverage conditions remain subject to final verification and underwriting by licensed insurance carriers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p>© {new Date().getFullYear()} PremiumPulse InsurTech Technologies. All rights reserved.</p>
            <div className="flex items-center gap-6 text-slate-400">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Underwriting</span>
              <span className="hover:text-white cursor-pointer transition-colors">Security Whitepaper</span>
              <span className="hover:text-white cursor-pointer transition-colors">API Docs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
