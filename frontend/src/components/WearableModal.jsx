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
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sync wearable data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/50 flex items-center justify-center">
              <Watch className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Wearable Health Integration</h3>
              <p className="text-xs text-blue-200">Smartwatch Telemetry & Dynamic Premium Calibration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSync} className="p-6 space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                    source === p.id 
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 italic">
              * Simulated sample stream for hackathon demonstration.
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-blue-600" />
                Daily Steps
              </label>
              <input
                type="number"
                min="0"
                max="50000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Resting Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="40"
                max="180"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-violet-600" />
                Activity Intensity
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="low">Sedentary / Low</option>
                <option value="moderate">Moderate (30m daily)</option>
                <option value="high">High (Athletic)</option>
              </select>
            </div>
          </div>

          {/* Recalculate checkbox */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="checkbox"
              id="recalc"
              checked={recalculate}
              onChange={(e) => setRecalculate(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded-sm focus:ring-blue-500 border-slate-300"
            />
            <label htmlFor="recalc" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Automatically trigger AI Agents to re-calculate premium with updated telemetry
            </label>
          </div>

          {/* Status feedback */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing & Recalculating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sync Telemetry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

