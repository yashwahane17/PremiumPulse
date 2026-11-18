import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { 
  User, 
  Heart, 
  Scale, 
  Activity, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  PlusCircle, 
  Calendar, 
  Mail, 
  Flame, 
  Watch,
  HeartPulse,
  Info
} from 'lucide-react';

export default function UserProfilePage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Health Profile Form
  const [formData, setFormData] = useState({
    age: 32,
    gender: 'male',
    height_cm: 175,
    weight_kg: 72,
    smoker: 'no',
    physical_activity: 'moderate',
    daily_steps: 7500,
    alcohol: 'none',
    medical_conditions: 'None',
    previous_medical_history: 'None',
    regular_checkups: true,
    heart_rate: 72,
    dependents: 0,
    coverage_preference: 'standard',
    region: 'southwest'
  });

  const [liveBmi, setLiveBmi] = useState(23.51);

  // Compute live BMI whenever height or weight changes
  useEffect(() => {
    if (formData.height_cm > 0 && formData.weight_kg > 0) {
      const h_m = formData.height_cm / 100;
      const bmi = (formData.weight_kg / (h_m * h_m)).toFixed(2);
      setLiveBmi(parseFloat(bmi));
    }
  }, [formData.height_cm, formData.weight_kg]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.getProfile();
      if (res.health_profile) {
        setFormData(prev => ({
          ...prev,
          ...res.health_profile
        }));
        if (res.health_profile.bmi) {
          setLiveBmi(res.health_profile.bmi);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'age' || name === 'height_cm' || name === 'weight_kg' || name === 'daily_steps' || name === 'heart_rate' || name === 'dependents') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.updateProfile(formData);
      setMessage({ type: 'success', text: `Health Profile updated successfully! Calculated BMI: ${res.bmi}` });
      setLiveBmi(res.bmi);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update health profile.' });
    } finally {
      setSaving(false);
    }
  };

  // BMI Category determination
  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900' };
    if (bmi < 25) return { category: 'Normal / Healthy Weight', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900' };
    return { category: 'Obese', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900' };
  };

  const bmiInfo = getBmiCategory(liveBmi);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <User className="w-6 h-6 text-[#3867FF]" />
            My Personal & Health Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Maintain your health biometrics and lifestyle parameters used by our AI agents to quote actuarial premiums.
          </p>
        </div>

        <button
          onClick={() => navigate('/predict')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#3867FF] hover:bg-[#2954e6] text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Premium Estimate</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
          message.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200' 
            : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-bold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#12B981]" />
          <span>Verified Account Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Legal Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{user?.full_name || 'Customer'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Email</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block truncate">{user?.email || 'user@example.com'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Role</span>
            <span className="inline-flex items-center gap-1 font-bold text-[#3867FF] bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-full text-xs mt-1">
              {user?.role || 'USER'} (Customer)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Health Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Biometrics & Live BMI Section */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#3867FF]" />
                <span>Biometric Indicators & Dynamic BMI Calculation</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Height and weight are used to compute your Body Mass Index (BMI).
              </p>
            </div>

            {/* Dynamic BMI Result Pill */}
            <div className={`p-3 rounded-2xl border flex items-center gap-3 ${bmiInfo.color}`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">Live BMI</span>
                <span className="text-xl font-black font-mono">{liveBmi}</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 shadow-2xs">
                {bmiInfo.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Age (Years)</label>
              <input
                type="number"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Height (cm)</label>
              <input
                type="number"
                name="height_cm"
                min="80"
                max="250"
                step="0.5"
                value={formData.height_cm}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight_kg"
                min="20"
                max="250"
                step="0.5"
                value={formData.weight_kg}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Clinical History & Lifestyle Factors */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Clinical Biomarkers & Lifestyle Habits</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Smoking Habit</label>
              <select
                name="smoker"
                value={formData.smoker}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              >
                <option value="no">Non-Smoker (Standard)</option>
                <option value="yes">Active Smoker (+310% Surcharge)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Physical Activity</label>
              <select
                name="physical_activity"
                value={formData.physical_activity}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white capitalize"
              >
                <option value="low">Low (Sedentary)</option>
                <option value="moderate">Moderate (3-4 days/wk)</option>
                <option value="high">High (Athletic cardio)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Daily Steps Target</label>
              <input
                type="number"
                name="daily_steps"
                min="500"
                max="30000"
                step="500"
                value={formData.daily_steps}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                name="heart_rate"
                min="40"
                max="160"
                value={formData.heart_rate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Alcohol Intake</label>
              <select
                name="alcohol"
                value={formData.alcohol}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white capitalize"
              >
                <option value="none">None</option>
                <option value="occasional">Occasional</option>
                <option value="regular">Regular</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Pre-Existing Conditions</label>
              <input
                type="text"
                name="medical_conditions"
                value={formData.medical_conditions}
                onChange={handleChange}
                placeholder="e.g. None or Hypertension"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Recalculate BMI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
