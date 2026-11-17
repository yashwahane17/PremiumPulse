import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { 
  Settings, 
  Shield, 
  Key, 
  Database, 
  Cpu, 
  Save, 
  CheckCircle2, 
  Sliders, 
  Bell, 
  FileText,
  User,
  Mail,
  Lock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState({
    baseRiskMultiplier: 1.05,
    underwritingMarginPct: 12,
    enableFallbackExplain: true,
    agentTimeoutMs: 5000,
    currencySymbol: 'INR (₹)',
    enforceStrictRbac: true,
    wearableRecalcAuto: true,
    shapFeaturesCount: 5,
    logRetentionDays: 90
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Governance and actuarial settings saved.', 'success');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-cyan-400" />
            Platform & Actuarial Governance Settings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure multi-agent orchestrator timeouts, actuarial multipliers, RBAC constraints, and LLM fallbacks.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Administrator Profile Card */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Authenticated Administrator Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Admin Full Name</span>
              <span className="font-bold text-white text-sm mt-0.5 block">{user?.full_name || 'System Administrator'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Authorized Email</span>
              <span className="font-bold text-white text-sm mt-0.5 block truncate">{user?.email || 'admin@premiumpulse.ai'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">RBAC Level</span>
              <span className="font-bold text-cyan-400 text-sm mt-0.5 flex items-center gap-1.5 font-mono">
                <Shield className="w-4 h-4" />
                <span>SUPER_ADMIN (ADMIN)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Agent Orchestration & LLM Settings */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span>AI Multi-Agent Pipeline & Fallback Orchestration</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Agent Execution Timeout (ms)</label>
              <input
                type="number"
                value={settings.agentTimeoutMs}
                onChange={(e) => handleChange('agentTimeoutMs', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">Maximum latency threshold before Insight Agent triggers local fallback rules.</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Max Influencing SHAP Drivers</label>
              <input
                type="number"
                value={settings.shapFeaturesCount}
                onChange={(e) => handleChange('shapFeaturesCount', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">Number of top risk attributes highlighted in explainability breakdown.</p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-bold text-white">Rule-Based Insight Fallback</div>
                <div className="text-[11px] text-slate-500">Guarantee 100% uptime when external LLM APIs fail</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableFallbackExplain}
                onChange={(e) => handleChange('enableFallbackExplain', e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <div className="font-bold text-white">Automatic Wearable Recalculation</div>
                <div className="text-[11px] text-slate-500">Trigger agent recalculation upon Apple Health / Fit sync</div>
              </div>
              <input
                type="checkbox"
                checked={settings.wearableRecalcAuto}
                onChange={(e) => handleChange('wearableRecalcAuto', e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Actuarial & Underwriting Parameters */}
        <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Actuarial Pricing Multipliers & Underwriting Corridor</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Base Risk Loading Multiplier</label>
              <input
                type="number"
                step="0.01"
                value={settings.baseRiskMultiplier}
                onChange={(e) => handleChange('baseRiskMultiplier', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">Multiplier applied to high-risk clinical profiles (standard: 1.05x).</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Underwriting Margin Corridor (%)</label>
              <input
                type="number"
                value={settings.underwritingMarginPct}
                onChange={(e) => handleChange('underwritingMarginPct', Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-cyan-300 focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">Defines min/max range boundaries for the predicted premium quotation.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/25 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
