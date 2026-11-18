import React, { useState } from 'react';
import { X, ArrowRight, TrendingDown, TrendingUp, CheckCircle, Scale, Shield, Zap } from 'lucide-react';

export default function CompareModal({ isOpen, onClose, history = [] }) {
  const [selectedA, setSelectedA] = useState(history[0]?.id || null);
  const [selectedB, setSelectedB] = useState(history[1]?.id || history[0]?.id || null);

  if (!isOpen || history.length < 2) return null;

  const itemA = history.find(h => h.id === Number(selectedA)) || history[0];
  const itemB = history.find(h => h.id === Number(selectedB)) || history[1];

  const premA = itemA?.predicted_premium_inr || 0;
  const premB = itemB?.predicted_premium_inr || 0;
  const diffPrem = premB - premA;
  const pctDiff = premA > 0 ? ((diffPrem / premA) * 100).toFixed(1) : 0;

  const bmiA = itemA?.bmi || 0;
  const bmiB = itemB?.bmi || 0;
  const diffBmi = (bmiB - bmiA).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#10172A] to-[#1A2544] text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base leading-tight">Historical Prediction Comparison</h3>
            <p className="text-xs text-slate-300">Compare actuarial outputs and risk changes across time</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Baseline Estimate (A)
              </label>
              <select
                value={selectedA}
                onChange={(e) => setSelectedA(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>
                    #{h.id} - {h.date_formatted || h.created_at?.slice(0, 10)} (₹{h.predicted_premium_inr?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Comparison Estimate (B)
              </label>
              <select
                value={selectedB}
                onChange={(e) => setSelectedB(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>
                    #{h.id} - {h.date_formatted || h.created_at?.slice(0, 10)} (₹{h.predicted_premium_inr?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delta Pill */}
          <div className={`p-4 rounded-2xl border text-center ${
            diffPrem < 0 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-[#12B981]' 
              : diffPrem > 0 
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Net Actuarial Premium Delta (B vs A)</span>
            <div className="text-2xl font-black font-mono mt-0.5">
              {diffPrem > 0 ? `+₹${diffPrem.toLocaleString()}` : diffPrem < 0 ? `-₹${Math.abs(diffPrem).toLocaleString()}` : '₹0 (No change)'}
              <span className="text-xs font-normal ml-1.5 font-sans">
                ({diffPrem > 0 ? `+${pctDiff}%` : `${pctDiff}%`})
              </span>
            </div>
          </div>

          {/* Side by side comparison table */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">Attribute</th>
                  <th className="p-3">Run #{itemA?.id}</th>
                  <th className="p-3">Run #{itemB?.id}</th>
                  <th className="p-3">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-700 dark:text-slate-300">Predicted Premium</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">₹{premA.toLocaleString()}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">₹{premB.toLocaleString()}</td>
                  <td className="p-3 font-bold">
                    <span className={diffPrem <= 0 ? 'text-[#12B981]' : 'text-rose-500'}>
                      {diffPrem > 0 ? `+₹${diffPrem.toLocaleString()}` : `-₹${Math.abs(diffPrem).toLocaleString()}`}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-700 dark:text-slate-300">BMI Index</td>
                  <td className="p-3">{bmiA}</td>
                  <td className="p-3">{bmiB}</td>
                  <td className="p-3 font-bold">
                    <span className={diffBmi <= 0 ? 'text-[#12B981]' : 'text-rose-500'}>
                      {diffBmi > 0 ? `+${diffBmi}` : diffBmi}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-700 dark:text-slate-300">Risk Category</td>
                  <td className="p-3 font-sans">{itemA?.risk_category}</td>
                  <td className="p-3 font-sans">{itemB?.risk_category}</td>
                  <td className="p-3 font-sans text-slate-400">
                    {itemA?.risk_category === itemB?.risk_category ? 'Unchanged' : 'Shifted'}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-700 dark:text-slate-300">Designated Model</td>
                  <td className="p-3 font-sans">{itemA?.model_used}</td>
                  <td className="p-3 font-sans">{itemB?.model_used}</td>
                  <td className="p-3 font-sans text-slate-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
