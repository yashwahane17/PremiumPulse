import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Settings, 
  User, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  Lock, 
  Watch, 
  HeartPulse, 
  Smartphone,
  Eye
} from 'lucide-react';

export default function CustomerSettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState({
    emailAlerts: true,
    wearableAutoRecalc: true,
    annualCheckupReminder: true,
    preferredCurrency: 'INR (₹)',
    dataSharingAnonymized: true,
    smsNotifications: false
  });

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Customer account preferences saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-[#3867FF]" />
          Account & Underwriting Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
          Manage notifications, privacy options, wearable sync policies, and security credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Summary Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <User className="w-4 h-4 text-[#3867FF]" />
            <span>Profile Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Customer Name</span>
              <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{user?.full_name || 'Customer'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Email</span>
              <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5 truncate">{user?.email || 'user@example.com'}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Access Tier</span>
              <div className="text-sm font-bold text-[#3867FF] mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#12B981]" />
                <span>Verified Customer (USER)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Health Reminders */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Automated Health & Policy Reminders</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Email Policy Quotations</div>
                <div className="text-[11px] text-slate-400">Receive copy of PDF underwriting certificates via email</div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={() => handleToggle('emailAlerts')}
                className="w-4 h-4 accent-[#3867FF] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Wearable Dynamic Premium Recalculation</div>
                <div className="text-[11px] text-slate-400">Automatically run Pricing Agent when new daily steps / heart rate are synced</div>
              </div>
              <input
                type="checkbox"
                checked={settings.wearableAutoRecalc}
                onChange={() => handleToggle('wearableAutoRecalc')}
                className="w-4 h-4 accent-[#3867FF] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-200">Annual Checkup Reminder</div>
                <div className="text-[11px] text-slate-400">Receive discount advice when completing annual preventive clinical checkups</div>
              </div>
              <input
                type="checkbox"
                checked={settings.annualCheckupReminder}
                onChange={() => handleToggle('annualCheckupReminder')}
                className="w-4 h-4 accent-[#3867FF] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security & Cryptography Notice */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#12B981]" />
            <span>Cryptographic Privacy & Data Isolation</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your personal biometrics and medical history are protected by PBKDF2 cryptography, SHA-256 tokens, and isolated database rows. Underwriting predictions are solely accessible by your authenticated session.
          </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
