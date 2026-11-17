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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base leading-tight">Historical Prediction Comparison</h3>
            <p className="text-xs text-slate-400">Compare actuarial outputs and risk changes across time</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Baseline Estimate (A)
              </label>
              <select
                value={selectedA}
                onChange={(e) => setSelectedA(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>
                    #{h.id} - {h.date_formatted || h.created_at.slice(0, 10)} (₹{h.predicted_premium_inr?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Comparison Estimate (B)
              </label>
              <select
                value={selectedB}
                onChange={(e) => setSelectedB(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>
                    #{h.id} - {h.date_formatted || h.created_at.slice(0, 10)} (₹{h.predicted_premium_inr?.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Delta Banner */}
          <div className={`p-4 rounded-xl flex items-center justify-between border ${
            diffPrem < 0 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : (diffPrem > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-900')
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                diffPrem < 0 ? 'bg-emerald-600 text-white' : (diffPrem > 0 ? 'bg-amber-600 text-white' : 'bg-slate-600 text-white')
              }`}>
                {diffPrem < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Net Premium Variation
                </div>
                <div className="text-lg font-black">
                  {diffPrem < 0 ? '-' : '+'}₹{Math.abs(diffPrem).toLocaleString()} ({pctDiff}%)
                </div>
              </div>
            </div>
            <div className="text-xs text-right font-medium">
              {diffPrem < 0 ? (
                <span className="text-emerald-700 font-semibold">Favorable Health Trajectory</span>
              ) : (
                <span className="text-amber-700 font-semibold">Underwriting Surcharge Applied</span>
              )}
            </div>
          </div>

          {/* Detailed Metric Comparison Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Parameter</th>
                  <th className="py-2.5 px-3">Estimate A</th>
                  <th className="py-2.5 px-3">Estimate B</th>
                  <th className="py-2.5 px-3 text-right">Delta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">Predicted Premium</td>
                  <td className="py-2.5 px-3">₹{premA.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600">₹{premB.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-bold">
                    {diffPrem < 0 ? (
                      <span className="text-emerald-600">-₹{Math.abs(diffPrem).toLocaleString()}</span>
                    ) : (
                      <span className="text-rose-600">+₹{diffPrem.toLocaleString()}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">Risk Category</td>
                  <td className="py-2.5 px-3">{itemA?.risk_category}</td>
                  <td className="py-2.5 px-3 font-semibold">{itemB?.risk_category}</td>
                  <td className="py-2.5 px-3 text-right">
                    {itemA?.risk_category === itemB?.risk_category ? 'Unchanged' : 'Shifted'}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">Body Mass Index</td>
                  <td className="py-2.5 px-3">{bmiA}</td>
                  <td className="py-2.5 px-3 font-semibold">{bmiB}</td>
                  <td className="py-2.5 px-3 text-right font-bold">
                    {diffBmi < 0 ? (
                      <span className="text-emerald-600">{diffBmi}</span>
                    ) : (
                      <span className="text-slate-700">+{diffBmi}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-700">ML Model Used</td>
                  <td className="py-2.5 px-3">{itemA?.model_used}</td>
                  <td className="py-2.5 px-3 font-semibold">{itemB?.model_used}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

