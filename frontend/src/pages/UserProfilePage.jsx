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
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (bmi < 25) return { category: 'Normal / Healthy Weight', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    return { category: 'Obese', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const bmiInfo = getBmiCategory(liveBmi);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-600" />
            My Personal & Health Profile
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Maintain your health biometrics and lifestyle parameters used by our AI agents to quote actuarial premiums.
          </p>
        </div>

        <button
          onClick={() => navigate('/predict')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Premium Estimate</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Account Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Legal Name</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.full_name || 'Customer'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Email</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{user?.email || 'user@example.com'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Role</span>
            <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs mt-1">
              {user?.role || 'USER'} (Customer)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Health Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Biometrics & Live BMI Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>Biometric Indicators & Dynamic BMI Calculation</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Height and weight are used to compute your Body Mass Index (BMI).
              </p>
            </div>

            {/* Dynamic BMI Result Pill */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${bmiInfo.color}`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block">Live Calculated BMI</span>
                <span className="text-xl font-black">{liveBmi}</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/80 shadow-2xs">
                {bmiInfo.category}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
              <input
                type="number"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Height (cm)</label>
              <input
                type="number"
                name="height_cm"
                min="80"
                max="250"
                step="0.5"
                value={formData.height_cm}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight_kg"
                min="25"
                max="300"
                step="0.5"
                value={formData.weight_kg}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Lifestyle & Wellness Factors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>Lifestyle & Cardiovascular Habits</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Smoking Habit</label>
              <select
                name="smoker"
                value={formData.smoker}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="no">Non-Smoker (Lower Risk)</option>
                <option value="yes">Smoker (High Risk Driver)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Physical Activity</label>
              <select
                name="physical_activity"
                value={formData.physical_activity}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="low">Sedentary / Low</option>
                <option value="moderate">Moderate Exercise</option>
                <option value="high">High Activity / Athletic</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Daily Steps Target</label>
              <input
                type="number"
                name="daily_steps"
                min="0"
                max="50000"
                value={formData.daily_steps}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Alcohol Consumption</label>
              <select
                name="alcohol"
                value={formData.alcohol}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="none">None / Teetotaler</option>
                <option value="occasional">Occasional / Social</option>
                <option value="frequent">Frequent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical History & Policy Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-600" />
            <span>Clinical History & Policy Plan Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Chronic Conditions</label>
              <input
                type="text"
                name="medical_conditions"
                placeholder="e.g. Hypertension, None"
                value={formData.medical_conditions}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dependents (Children)</label>
              <input
                type="number"
                name="dependents"
                min="0"
                max="10"
                value={formData.dependents}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Coverage Tier</label>
              <select
                name="coverage_preference"
                value={formData.coverage_preference}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="standard">Standard Protection</option>
                <option value="comprehensive">Comprehensive Shield</option>
                <option value="premium">Platinum Elite</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                name="regular_checkups"
                checked={formData.regular_checkups}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>I complete annual preventive health checkups</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            ← Back to Dashboard
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
            <span>{saving ? 'Updating...' : 'Save Health Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
