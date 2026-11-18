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
  Check, 
  Footprints, 
  Stethoscope,
  Cigarette,
  CigaretteOff,
  Zap
} from 'lucide-react';

export default function PredictionFormPage({ onSubmitForm }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State matching backend HealthProfileInput schema
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    age: 32,
    gender: 'male',
    height_cm: 175,
    weight_kg: 72,
    // Step 2: Health Information
    medical_conditions: 'None',
    previous_medical_history: 'None',
    regular_checkups: true,
    heart_rate: 72,
    // Step 3: Lifestyle Information
    smoker: 'no',
    alcohol: 'occasional',
    physical_activity: 'moderate',
    daily_steps: 8000,
    // Step 4: Insurance Information
    region: 'southwest',
    dependents: 1,
    coverage_preference: 'standard'
  });

  const [errors, setErrors] = useState({});

  // Dynamic live BMI calculation
  const bmiCalculation = useMemo(() => {
    const h = parseFloat(formData.height_cm) / 100;
    const w = parseFloat(formData.weight_kg);
    if (!h || !w || h <= 0) return { bmi: 0, category: 'Invalid', color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' };
    const val = (w / (h * h)).toFixed(1);
    const num = parseFloat(val);
    if (num < 18.5) return { bmi: num, category: 'Underweight', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/60' };
    if (num < 25.0) return { bmi: num, category: 'Normal Weight', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/60' };
    if (num < 30.0) return { bmi: num, category: 'Overweight', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/60' };
    return { bmi: num, category: 'Obese', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/60' };
  }, [formData.height_cm, formData.weight_kg]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Test Profiles presets
  const loadPreset = (preset) => {
    if (preset === 'healthy') {
      setFormData({
        age: 24,
        gender: 'female',
        height_cm: 165,
        weight_kg: 55,
        medical_conditions: 'None',
        previous_medical_history: 'None',
        regular_checkups: true,
        heart_rate: 68,
        smoker: 'no',
        alcohol: 'none',
        physical_activity: 'high',
        daily_steps: 10500,
        region: 'northeast',
        dependents: 0,
        coverage_preference: 'standard'
      });
    } else if (preset === 'moderate') {
      setFormData({
        age: 45,
        gender: 'male',
        height_cm: 175,
        weight_kg: 85,
        medical_conditions: 'Hypertension',
        previous_medical_history: 'None',
        regular_checkups: true,
        heart_rate: 78,
        smoker: 'no',
        alcohol: 'occasional',
        physical_activity: 'moderate',
        daily_steps: 6000,
        region: 'southeast',
        dependents: 2,
        coverage_preference: 'comprehensive'
      });
    } else if (preset === 'high') {
      setFormData({
        age: 58,
        gender: 'male',
        height_cm: 172,
        weight_kg: 96,
        medical_conditions: 'Type 2 Diabetes, High Cholesterol',
        previous_medical_history: 'Cardiac Stent (2022)',
        regular_checkups: false,
        heart_rate: 88,
        smoker: 'yes',
        alcohol: 'regular',
        physical_activity: 'low',
        daily_steps: 2500,
        region: 'northwest',
        dependents: 1,
        coverage_preference: 'premium'
      });
    }
    setErrors({});
  };

  const validateStep = (s) => {
    const errs = {};
    if (s === 1) {
      if (formData.age < 18 || formData.age > 100) errs.age = 'Age must be between 18 and 100.';
      if (formData.height_cm < 100 || formData.height_cm > 250) errs.height_cm = 'Height must be between 100 and 250 cm.';
      if (formData.weight_kg < 25 || formData.weight_kg > 250) errs.weight_kg = 'Weight must be between 25 and 250 kg.';
    } else if (s === 2) {
      if (formData.heart_rate < 40 || formData.heart_rate > 160) errs.heart_rate = 'Heart rate must be between 40 and 160 bpm.';
    } else if (s === 3) {
      if (formData.daily_steps < 0 || formData.daily_steps > 40000) errs.daily_steps = 'Daily steps must be valid.';
    } else if (s === 4) {
      if (formData.dependents < 0 || formData.dependents > 10) errs.dependents = 'Dependents must be between 0 and 10.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (validateStep(step)) {
      setIsSubmitting(true);
      onSubmitForm(formData);
    }
  };

  const stepsList = [
    { num: 1, title: 'Personal Info', icon: User },
    { num: 2, title: 'Health Status', icon: Heart },
    { num: 3, title: 'Lifestyle & Habits', icon: Activity },
    { num: 4, title: 'Policy & Coverage', icon: Shield }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* =========================================================================
          TOP BANNER & PRESET SELECTOR
      ========================================================================= */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#3867FF] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#3867FF]" />
          <span>Interactive Underwriting Form</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Calculate Your Health Insurance Premium
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Complete our 4-step clinical questionnaire to receive an instant, AI-underwritten premium prediction in under 30 milliseconds.
        </p>

        {/* Quick Demo Profile Presets */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">Load Demo Profile:</span>
          <button
            type="button"
            onClick={() => loadPreset('healthy')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Young Athlete (Low Risk)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('moderate')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Family Parent (Moderate Risk)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('high')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Senior Smoker (High Risk)
          </button>
        </div>
      </div>

      {/* =========================================================================
          STEPPER PROGRESS INDICATOR (4 Steps)
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div 
                key={s.num}
                onClick={() => { if (step > s.num) setStep(s.num); }}
                className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#3867FF]'
                    : isCompleted
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-600 opacity-60'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCurrent
                    ? 'bg-[#3867FF] text-white shadow-md shadow-blue-500/25'
                    : isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                <div className="text-center sm:text-left overflow-hidden">
                  <p className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">Step {s.num}</p>
                  <p className="text-xs font-bold truncate">{s.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MAIN FORM CONTAINER
      ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* =====================================================================
              STEP 1: PERSONAL INFORMATION (Age, Gender, Height, Weight, BMI)
          ===================================================================== */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Basic physical and demographic attributes for actuarial normalization.</p>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Age */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Age</span>
                    <span className="font-mono text-[#3867FF]">{formData.age} years old</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={formData.age}
                    onChange={(e) => handleChange('age', Number(e.target.value))}
                    className="w-full accent-[#3867FF] h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>18</span>
                    <span>35</span>
                    <span>50</span>
                    <span>65</span>
                    <span>80</span>
                  </div>
                  {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Biological Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleChange('gender', g)}
                        className={`py-3 rounded-2xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                          formData.gender === g
                            ? 'bg-[#3867FF] text-white border-[#3867FF] shadow-md shadow-blue-500/25'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Height & Weight with Live BMI Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                
                {/* Height */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Height (cm)</label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={formData.height_cm}
                    onChange={(e) => handleChange('height_cm', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                  />
                  {errors.height_cm && <p className="text-xs text-rose-500">{errors.height_cm}</p>}
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Weight (kg)</label>
                  <input
                    type="number"
                    min="25"
                    max="250"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange('weight_kg', Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
                  />
                  {errors.weight_kg && <p className="text-xs text-rose-500">{errors.weight_kg}</p>}
                </div>

                {/* Live BMI Preview Card */}
                <div className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 ${bmiCalculation.bg} space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live BMI Preview</span>
                    <Scale className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{bmiCalculation.bmi}</span>
                    <span className="text-xs font-semibold text-slate-400">kg/m²</span>
                  </div>
                  <span className={`text-xs font-bold ${bmiCalculation.color}`}>
                    {bmiCalculation.category}
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 2: HEALTH INFORMATION (Conditions, History, Checkups, Heart Rate)
          ===================================================================== */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Health Status & Clinical History</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Clinical factors inspected by the Risk Assessment Agent.</p>
              </div>

              {/* Medical Conditions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pre-Existing Medical Conditions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'None',
                    'Hypertension',
                    'Type 2 Diabetes',
                    'Thyroid Disorder',
                    'Asthma / Respiratory',
                    'High Cholesterol'
                  ].map((cond) => {
                    const isSelected = formData.medical_conditions === cond;
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => handleChange('medical_conditions', cond)}
                        className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-[#3867FF] text-[#3867FF] font-bold shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Previous History & Heart Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Previous Medical History */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Major Surgical / Hospital History
                  </label>
                  <input
                    type="text"
                    value={formData.previous_medical_history}
                    onChange={(e) => handleChange('previous_medical_history', e.target.value)}
                    placeholder="e.g. None or Appendectomy (2020)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                  />
                </div>

                {/* Resting Heart Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Resting Heart Rate</span>
                    <span className="font-mono text-rose-500">{formData.heart_rate} bpm</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="120"
                    value={formData.heart_rate}
                    onChange={(e) => handleChange('heart_rate', Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>45 (Athlete)</span>
                    <span>72 (Normal)</span>
                    <span>120 (Elevated)</span>
                  </div>
                  {errors.heart_rate && <p className="text-xs text-rose-500">{errors.heart_rate}</p>}
                </div>
              </div>

              {/* Regular Checkups Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#12B981] flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Annual Preventative Health Checkup</h4>
                    <p className="text-[11px] text-slate-500">Regular checkups provide a 5% discount on model calculations.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('regular_checkups', !formData.regular_checkups)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formData.regular_checkups
                      ? 'bg-[#12B981] text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {formData.regular_checkups ? 'Yes (Completed)' : 'No (Pending)'}
                </button>
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 3: LIFESTYLE & HABITS (Smoking, Alcohol, Activity, Steps)
          ===================================================================== */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Lifestyle & Daily Habits</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Behavioral and telemetry factors impacting long-term claims probability.</p>
              </div>

              {/* Smoking Status (Crucial Actuarial Impact) */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      formData.smoker === 'yes'
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                    }`}>
                      {formData.smoker === 'yes' ? <Cigarette className="w-5 h-5" /> : <CigaretteOff className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tobacco & Smoking Habits</h4>
                      <p className="text-[11px] text-slate-500">
                        Smoking increases claims cost by ~310% based on empirical hospital claims data.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {['no', 'yes'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange('smoker', opt)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          formData.smoker === opt
                            ? opt === 'no' 
                              ? 'bg-[#12B981] text-white shadow-md' 
                              : 'bg-rose-600 text-white shadow-md'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {opt === 'no' ? 'Non-Smoker' : 'Active Smoker'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Physical Activity & Alcohol */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Physical Activity Level */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Physical Activity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'moderate', 'high'].map((act) => (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleChange('physical_activity', act)}
                        className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer text-center ${
                          formData.physical_activity === act
                            ? 'bg-[#3867FF] text-white border-[#3867FF] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {act}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Alcohol Consumption */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Alcohol Consumption</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['none', 'occasional', 'regular'].map((alc) => (
                      <button
                        key={alc}
                        type="button"
                        onClick={() => handleChange('alcohol', alc)}
                        className={`py-2.5 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer text-center ${
                          formData.alcohol === alc
                            ? 'bg-[#7657FF] text-white border-[#7657FF] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {alc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Steps Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Footprints className="w-4 h-4 text-[#12B981]" />
                    <span>Average Daily Steps (Smartwatch Telemetry)</span>
                  </span>
                  <span className="font-mono text-[#12B981] font-bold">{formData.daily_steps.toLocaleString('en-IN')} steps/day</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={formData.daily_steps}
                  onChange={(e) => handleChange('daily_steps', Number(e.target.value))}
                  className="w-full accent-[#12B981] h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1,000 (Sedentary)</span>
                  <span>7,500 (Moderate)</span>
                  <span>10,000+ (Active Milestone)</span>
                </div>
              </div>
            </div>
          )}

          {/* =====================================================================
              STEP 4: INSURANCE INFORMATION (Region, Dependents, Coverage Preference)
          ===================================================================== */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Insurance Plan Parameters</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Coverage preference and demographic variables calibrated against actuarial claims.</p>
              </div>

              {/* Coverage Preference Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Coverage Preference Tier</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'standard', title: 'Standard Tier (1.0x)', desc: 'Essential in-patient & emergency coverage with standard deductible.' },
                    { id: 'comprehensive', title: 'Comprehensive Tier (1.25x)', desc: 'Full hospitalization, OPD, diagnostic coverage, and day-care procedures.' },
                    { id: 'premium', title: 'Premium Executive (1.50x)', desc: 'Zero co-pay, international second opinion, and unlimited restore benefits.' }
                  ].map((cov) => {
                    const isSelected = formData.coverage_preference === cov.id;
                    return (
                      <div
                        key={cov.id}
                        onClick={() => handleChange('coverage_preference', cov.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-[#3867FF] shadow-md shadow-blue-500/10'
                            : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <h4 className={`text-xs font-bold ${isSelected ? 'text-[#3867FF]' : 'text-slate-900 dark:text-white'}`}>
                          {cov.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{cov.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Region & Dependents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Region */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Actuarial Rating Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleChange('region', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <option value="southwest">Southwest (Tier 1 Medical Cost Index)</option>
                    <option value="southeast">Southeast (Tier 2 Medical Cost Index)</option>
                    <option value="northwest">Northwest (Tier 1 Medical Cost Index)</option>
                    <option value="northeast">Northeast (Tier 2 Medical Cost Index)</option>
                  </select>
                </div>

                {/* Dependents */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Covered Dependents (Children / Family)</span>
                    <span className="font-mono text-[#3867FF]">{formData.dependents}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.dependents}
                    onChange={(e) => handleChange('dependents', Number(e.target.value))}
                    className="w-full accent-[#3867FF] h-2 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5+</span>
                  </div>
                </div>
              </div>

              {/* Execution Summary Pill */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#3867FF]" />
                    <span>Real-Time Model Execution Pipeline</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#12B981]">Target: &lt; 30 ms</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Clicking Calculate My Premium executes pure vector inference across in-memory models (Linear Regression, Random Forest, XGBoost) and produces certified bounds immediately.
                </p>
              </div>

            </div>
          )}

          {/* =====================================================================
              NAV BUTTONS (Back / Next / Calculate)
          ===================================================================== */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#3867FF] to-[#7657FF] hover:opacity-95 disabled:opacity-60 text-white text-sm font-black shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-white" />
                    <span>Orchestrating AI Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate My Premium</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>

    </div>
  );
}
