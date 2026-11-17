import React, { useState, useMemo } from 'react';
import { 
  User, 
  Heart, 
  Activity, 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Scale, 
  AlertCircle, 
  Check, 
  HelpCircle,
  Footprints,
  Flame,
  Stethoscope
} from 'lucide-react';

export default function PredictionFormPage({ onSubmitForm }) {
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    age: 35,
    gender: 'male',
    height_cm: 175,
    weight_kg: 76,
    // Step 2
    smoker: 'no',
    physical_activity: 'moderate',
    daily_steps: 7500,
    alcohol: 'occasional',
    // Step 3
    medical_conditions: 'None',
    previous_medical_history: 'None',
    regular_checkups: true,
    heart_rate: 72,
    // Step 4
    dependents: 1,
    coverage_preference: 'standard',
    region: 'southwest'
  });

  const [errors, setErrors] = useState({});

  // Dynamic live BMI calculation
  const bmiCalculation = useMemo(() => {
    const h = parseFloat(formData.height_cm) / 100;
    const w = parseFloat(formData.weight_kg);
    if (!h || !w || h <= 0) return { bmi: 0, category: 'Invalid', color: 'text-slate-400' };
    const val = (w / (h * h)).toFixed(1);
    const num = parseFloat(val);
    if (num < 18.5) return { bmi: num, category: 'Underweight', color: 'text-amber-500' };
    if (num < 25.0) return { bmi: num, category: 'Normal Weight', color: 'text-emerald-500' };
    if (num < 30.0) return { bmi: num, category: 'Overweight', color: 'text-amber-600' };
    return { bmi: num, category: 'Obese', color: 'text-rose-600' };
  }, [formData.height_cm, formData.weight_kg]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Preset quick fill
  const loadPreset = (preset) => {
    if (preset === 'healthy') {
      setFormData({
        age: 28,
        gender: 'female',
        height_cm: 168,
        weight_kg: 60,
        smoker: 'no',
        physical_activity: 'high',
        daily_steps: 11000,
        alcohol: 'none',
        medical_conditions: 'None',
        previous_medical_history: 'None',
        regular_checkups: true,
        heart_rate: 62,
        dependents: 0,
        coverage_preference: 'standard',
        region: 'northeast'
      });
    } else if (preset === 'moderate') {
      setFormData({
        age: 44,
        gender: 'male',
        height_cm: 178,
        weight_kg: 84,
        smoker: 'no',
        physical_activity: 'moderate',
        daily_steps: 6500,
        alcohol: 'occasional',
        medical_conditions: 'Mild Hypertension',
        previous_medical_history: 'None',
        regular_checkups: true,
        heart_rate: 74,
        dependents: 2,
        coverage_preference: 'comprehensive',
        region: 'southwest'
      });
    } else if (preset === 'smoker_high') {
      setFormData({
        age: 52,
        gender: 'male',
        height_cm: 172,
        weight_kg: 96,
        smoker: 'yes',
        physical_activity: 'low',
        daily_steps: 3200,
        alcohol: 'frequent',
        medical_conditions: 'Type 2 Diabetes, Hypertension',
        previous_medical_history: 'Stent placement (2021)',
        regular_checkups: false,
        heart_rate: 88,
        dependents: 1,
        coverage_preference: 'premium',
        region: 'southeast'
      });
    }
  };

  // Step validation
  const validateCurrentStep = () => {
    const errs = {};
    if (step === 1) {
      if (formData.age < 18 || formData.age > 100) errs.age = 'Age must be between 18 and 100.';
      if (formData.height_cm < 80 || formData.height_cm > 250) errs.height_cm = 'Height must be 80-250 cm.';
      if (formData.weight_kg < 30 || formData.weight_kg > 250) errs.weight_kg = 'Weight must be 30-250 kg.';
    } else if (step === 2) {
      if (formData.daily_steps < 0 || formData.daily_steps > 50000) errs.daily_steps = 'Daily steps must be 0-50,000.';
    } else if (step === 3) {
      if (formData.heart_rate && (formData.heart_rate < 40 || formData.heart_rate > 200)) {
        errs.heart_rate = 'Heart rate must be 40-200 BPM.';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      onSubmitForm(formData);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Title & Presets */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Agent AI Underwriting Form</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Calculate Your Health Insurance Premium
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the 4-stage health & lifestyle questionnaire for precise actuarial underwriting.
        </p>

        {/* Quick presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Test Presets:
          </span>
          <button
            type="button"
            onClick={() => loadPreset('healthy')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
          >
            Healthy Non-Smoker
          </button>
          <button
            type="button"
            onClick={() => loadPreset('moderate')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
          >
            Moderate Adult
          </button>
          <button
            type="button"
            onClick={() => loadPreset('smoker_high')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            High Risk Smoker
          </button>
        </div>
      </div>

      {/* Multi-step Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10">
        {/* Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Lifestyle & Mobility'}
              {step === 3 && 'Medical History'}
              {step === 4 && 'Insurance & Coverage'}
            </span>
            <span>{step * 25}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ==================================================== */}
          {/* STEP 1: PERSONAL INFORMATION */}
          {/* ==================================================== */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Age (Years)
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.age && <p className="text-rose-600 text-xs mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="80"
                    max="250"
                    value={formData.height_cm}
                    onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.height_cm && <p className="text-rose-600 text-xs mt-1">{errors.height_cm}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {errors.weight_kg && <p className="text-rose-600 text-xs mt-1">{errors.weight_kg}</p>}
                </div>
              </div>

              {/* Real-time live BMI gauge card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Live BMI Preview
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {bmiCalculation.bmi}
                    </span>
                    <span className={`text-xs font-bold ml-2 ${bmiCalculation.color}`}>
                      ({bmiCalculation.category})
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                  Computed dynamically by Intake & Risk Agents
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: LIFESTYLE & MOBILITY */}
          {/* ==================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Smoker Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Tobacco / Smoking Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('smoker', 'no')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.smoker === 'no'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Non-Smoker</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('smoker', 'yes')}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      formData.smoker === 'yes'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Active Smoker</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  * Actuarial data shows smoking status is the single highest multiplier on health claims.
                </p>
              </div>

              {/* Physical Activity Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Physical Activity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'low', label: 'Sedentary', sub: '< 30m / week' },
                    { id: 'moderate', label: 'Moderate', sub: '3-4x / week' },
                    { id: 'high', label: 'Athletic', sub: '5+ hrs / week' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => handleChange('physical_activity', lvl.id)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.physical_activity === lvl.id
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{lvl.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{lvl.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Steps */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Average Daily Steps: <span className="text-blue-600 font-black">{formData.daily_steps.toLocaleString()}</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Target: 10,000 steps</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={formData.daily_steps}
                  onChange={(e) => handleChange('daily_steps', parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Alcohol Consumption */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Alcohol Consumption
                </label>
                <select
                  value={formData.alcohol}
                  onChange={(e) => handleChange('alcohol', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="none">None / Non-Drinker</option>
                  <option value="occasional">Occasional (1-2 drinks/week)</option>
                  <option value="frequent">Frequent (3+ drinks/week)</option>
                </select>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: MEDICAL HISTORY */}
          {/* ==================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Chronic or Pre-Existing Medical Conditions
                </label>
                <input
                  type="text"
                  value={formData.medical_conditions}
                  onChange={(e) => handleChange('medical_conditions', e.target.value)}
                  placeholder="e.g. Hypertension, Diabetes, Asthma, or None"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['None', 'Hypertension', 'Type 2 Diabetes', 'Asthma', 'Thyroid Disorder'].map(pill => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => handleChange('medical_conditions', pill)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Past Medical History / Surgeries
                </label>
                <input
                  type="text"
                  value={formData.previous_medical_history}
                  onChange={(e) => handleChange('previous_medical_history', e.target.value)}
                  placeholder="e.g. Appendectomy, Major surgery, or None"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Resting Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="200"
                    value={formData.heart_rate}
                    onChange={(e) => handleChange('heart_rate', parseInt(e.target.value) || 72)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.heart_rate && <p className="text-rose-600 text-xs mt-1">{errors.heart_rate}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Regular Annual Preventive Checkups
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="checkups"
                      checked={formData.regular_checkups}
                      onChange={(e) => handleChange('regular_checkups', e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded-sm focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="checkups" className="text-xs font-semibold text-slate-700 cursor-pointer">
                      Yes, attend annual health checkups
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: INSURANCE & COVERAGE */}
          {/* ==================================================== */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Number of Children / Dependents
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.dependents}
                  onChange={(e) => handleChange('dependents', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Coverage Tier Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'standard', name: 'Standard Cover', desc: '₹5 - 10 Lakh sum insured. Essential hospital care.' },
                    { id: 'comprehensive', name: 'Comprehensive', desc: '₹15 - 25 Lakh cover. Zero copay & OPD.' },
                    { id: 'premium', name: 'Global / Elite', desc: '₹50 Lakh+ cover. International treatments.' }
                  ].map(tier => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => handleChange('coverage_preference', tier.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.coverage_preference === tier.id
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{tier.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Geographical Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="southwest">Southwest</option>
                  <option value="southeast">Southeast</option>
                  <option value="northwest">Northwest</option>
                  <option value="northeast">Northeast</option>
                </select>
              </div>

              {/* Review summary box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-xs">
                <span className="font-bold text-blue-900 block mb-1">
                  Ready to trigger autonomous AI pipeline:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Your inputs will be validated by the <b>Intake Agent</b>, scored by the <b>Risk Assessment Agent</b>, evaluated across 3 ML models by the <b>Pricing Agent</b>, and explained by the <b>Insight Agent</b>.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Footer Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-7 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit for AI Analysis</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

