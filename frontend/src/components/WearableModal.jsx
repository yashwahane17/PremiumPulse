import React, { useState } from 'react';
import { api } from '../api/api';
import { Watch, X, Check, Heart, Footprints, Scale, Activity, RefreshCw } from 'lucide-react';

export default function WearableModal({ isOpen, onClose, onSyncSuccess }) {
  const [source, setSource] = useState('simulated_apple_watch');
  const [steps, setSteps] = useState(8500);
  const [heartRate, setHeartRate] = useState(68);
  const [weight, setWeight] = useState(76.5);
  const [activity, setActivity] = useState('moderate');
  const [recalculate, setRecalculate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const applyPreset = (presetName) => {
    setSource(presetName);
    if (presetName === 'simulated_apple_watch') {
      setSteps(10250);
      setHeartRate(64);
      setWeight(75.0);
      setActivity('high');
    } else if (presetName === 'simulated_fitbit') {
      setSteps(8400);
      setHeartRate(70);
      setWeight(77.2);
      setActivity('moderate');
    } else if (presetName === 'simulated_garmin') {
      setSteps(12800);
      setHeartRate(58);
      setWeight(73.5);
      setActivity('high');
    }
  };

  const handleSync = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        steps: parseInt(steps),
        heart_rate: parseInt(heartRate),
        weight: parseFloat(weight),
        activity_level: activity,
        source: source,
        recalculate_premium: recalculate
      };
      const res = await api.updateWearable(payload);
      setSuccessMsg('Wearable metrics synchronized successfully!');
      setTimeout(() => {
        onSyncSuccess(res);
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sync wearable data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#10172A] to-[#1A2544] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3867FF]/30 flex items-center justify-center">
              <Watch className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Wearable Health Integration</h3>
              <p className="text-xs text-slate-300">Smartwatch Telemetry & Dynamic Premium Calibration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSync} className="p-6 space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Connected Device / Source
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'simulated_apple_watch', label: 'Apple Watch' },
                { id: 'simulated_fitbit', label: 'Fitbit Charge' },
                { id: 'simulated_garmin', label: 'Garmin Forerunner' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                    source === p.id 
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-[#3867FF] text-[#3867FF] font-bold shadow-xs' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 italic">
              * Simulated sample stream for instant demonstration.
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-[#3867FF]" />
                Daily Steps
              </label>
              <input
                type="number"
                min="0"
                max="50000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Resting Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="40"
                max="180"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#7657FF]" />
                Current Weight (kg)
              </label>
              <input
                type="number"
                min="30"
                max="250"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                Activity Intensity
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white capitalize"
              >
                <option value="low">Low (Sedentary)</option>
                <option value="moderate">Moderate</option>
                <option value="high">High (Athletic)</option>
              </select>
            </div>
          </div>

          {/* Toggle Recalculate */}
          <div className="flex items-center gap-2 p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <input
              type="checkbox"
              id="recalc"
              checked={recalculate}
              onChange={(e) => setRecalculate(e.target.checked)}
              className="w-4 h-4 accent-[#3867FF] rounded cursor-pointer"
            />
            <label htmlFor="recalc" className="text-xs text-blue-950 dark:text-blue-200 font-semibold cursor-pointer">
              Automatically trigger Pricing Agent for instant premium recalculation
            </label>
          </div>

          {/* Messages */}
          {successMsg && (
            <p className="text-xs font-bold text-[#12B981] bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-lg border border-rose-200 dark:border-rose-800 text-center">
              {errorMsg}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>{recalculate ? 'Sync & Recalculate' : 'Save Telemetry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
