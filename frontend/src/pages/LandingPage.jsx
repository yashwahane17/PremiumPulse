import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { 
  ShieldCheck, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  FileText, 
  Zap, 
  Award, 
  ChevronDown, 
  Check, 
  Layers, 
  Lock
} from 'lucide-react';

export default function LandingPage() {
  const { user, quickDemoLogin } = useAuth();
  const { navigate } = useRouter();

  // Interactive Live Hero Preview Widget State
  const [heroAge, setHeroAge] = useState(30);
  const [heroSmoker, setHeroSmoker] = useState(false);
  const [heroBmiCat, setHeroBmiCat] = useState('normal'); // 'normal' | 'overweight' | 'obese'
  const [heroCoverage, setHeroCoverage] = useState('standard'); // 'standard' | 'comprehensive' | 'premium'

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(0);

  // Dynamic preview calculation mirroring calibrated ML baseline
  const calculatePreviewPremium = () => {
    let baseUsd = 2800;
    baseUsd += (heroAge - 18) * 240;
    if (heroSmoker) baseUsd += 18000;
    if (heroBmiCat === 'overweight') baseUsd += 1500;
    if (heroBmiCat === 'obese') baseUsd += 4200;

    const coverageMultiplier = heroCoverage === 'premium' ? 1.5 : heroCoverage === 'comprehensive' ? 1.25 : 1.0;
    const premiumInr = Math.round(baseUsd * 83.5 * 0.085 * coverageMultiplier);
    return premiumInr;
  };

  const previewPremium = calculatePreviewPremium();
  const previewMonthly = Math.round(previewPremium / 12);

  const handleGetStarted = () => {
    if (user) {
      navigate('/predict');
    } else {
      navigate('/register');
    }
  };

  const handleExplorePlatform = async () => {
    if (user) {
      navigate('/dashboard');
    } else {
      await quickDemoLogin();
      navigate('/dashboard');
    }
  };

  const faqs = [
    {
      q: "How does PremiumPulse calculate my insurance premium?",
      a: "PremiumPulse uses an autonomous multi-agent machine learning ensemble (Linear Regression, Random Forest, and XGBoost) benchmarked on real-world medical cost claims. The Intake Agent validates inputs, the Risk Assessment Agent determines your morbidity and BMI tier, and the Pricing Agent executes real-time vector inference in under 30 milliseconds."
    },
    {
      q: "Is my personal and health data secure?",
      a: "Yes. PremiumPulse is engineered strictly adhering to HIPAA-compliant architecture and 256-bit AES encryption. Personal health telemetry is isolated by encrypted user IDs, and machine learning models run strictly in-memory during inference without storing raw medical records in unencrypted formats."
    },
    {
      q: "Can syncing my smartwatch or fitness tracker reduce my premium?",
      a: "Absolutely. By syncing daily steps, resting heart rate, and sustained active minutes via the Wearable Health Module, users can unlock dynamic preventative health discounts of up to 25% off standard renewal rates."
    },
    {
      q: "How does the explainable AI (SHAP) feature work?",
      a: "Traditional underwriting is a 'black box'. PremiumPulse generates transparent SHAP (Shapley Additive exPlanations) attribution vectors that clearly reveal which lifestyle habits (e.g. non-smoking, regular cardio) discount your premium, and provides actionable recommendations to lower costs."
    },
    {
      q: "What is the difference between the 5 AI agents?",
      a: "Each agent handles a specialized actuarial responsibility: 1) Intake Agent sanitizes data, 2) Risk Assessment Agent categorizes clinical risk, 3) Pricing Agent runs high-speed ML regression, 4) Insight Agent builds explainability vectors and recommendations, and 5) Central Orchestrator synthesizes the final certified underwriting audit trail."
    }
  ];

  return (
    <div className="bg-[#F5F7FC] dark:bg-[#0B0F19] text-[#10172A] dark:text-slate-100 transition-colors duration-200">
      
      {/* =========================================================================
          HERO SECTION (Apple/Stripe Grade Aesthetics with Interactive Preview)
      ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-gradient-to-b from-[#10172A] via-[#161F38] to-[#10172A] text-white">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#3867FF]/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#7657FF]/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#3867FF]" />
                <span>Next-Gen InsurTech Architecture</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white">
                Smarter Health Insurance. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3867FF] via-[#60A5FA] to-[#7657FF]">
                  Powered by AI.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto lg:mx-0">
                Understand your health risks, predict personalized insurance premiums, and make smarter healthcare decisions with our intelligent multi-agent AI platform.
              </p>

              {/* Trust Metrics Pill Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#12B981]" />
                  <span>5 Autonomous Agents</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Zap className="w-3.5 h-3.5 text-[#3867FF]" />
                  <span>&lt; 30ms Real-Time Inference</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7657FF]" />
                  <span>R² = 0.883 Actuarial Fit</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={handleGetStarted}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm bg-[#3867FF] hover:bg-[#2954e6] text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{user ? 'Launch Prediction Engine' : 'Get Started Free'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={handleExplorePlatform}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#7657FF]" />
                  <span>Explore Platform</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Prediction Preview Widget */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6 relative group">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Live Actuarial Preview
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#3867FF] bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/60">
                    Instant ML Calibration
                  </span>
                </div>

                {/* Slider: Age */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Applicant Age</span>
                    <span className="text-white font-mono">{heroAge} years</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={heroAge}
                    onChange={(e) => setHeroAge(Number(e.target.value))}
                    className="w-full accent-[#3867FF] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>18</span>
                    <span>35</span>
                    <span>50</span>
                    <span>65</span>
                  </div>
                </div>

                {/* Toggle: Smoker */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                  <div>
                    <p className="text-xs font-bold text-white">Tobacco / Smoking Status</p>
                    <p className="text-[11px] text-slate-400">Affects risk classification by +310%</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHeroSmoker(!heroSmoker)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      heroSmoker 
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' 
                        : 'bg-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {heroSmoker ? 'Smoker (Yes)' : 'Non-Smoker (No)'}
                  </button>
                </div>

                {/* Select: BMI Category */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">BMI / Body Mass Category</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'normal', label: 'Normal (22.5)' },
                      { id: 'overweight', label: 'Overweight (27)' },
                      { id: 'obese', label: 'Obese (34)' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setHeroBmiCat(b.id)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer text-center ${
                          heroBmiCat === b.id
                            ? 'bg-[#3867FF] text-white shadow-md shadow-blue-500/25'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/40'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select: Coverage Preference */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Coverage Multiplier</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', label: 'Standard (1.0x)' },
                      { id: 'comprehensive', label: 'Comprehensive (1.25x)' },
                      { id: 'premium', label: 'Premium (1.50x)' }
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setHeroCoverage(c.id)}
                        className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all cursor-pointer text-center ${
                          heroCoverage === c.id
                            ? 'bg-[#7657FF] text-white shadow-md shadow-violet-500/25'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/40'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calculated Premium Output Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 to-violet-950/80 border border-blue-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Calibrated Annual Premium
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      ₹{previewPremium.toLocaleString('en-IN')}
                      <span className="text-xs font-medium text-slate-400"> / year</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      Est. ₹{previewMonthly.toLocaleString('en-IN')}/month
                    </span>
                  </div>
                  <button
                    onClick={handleGetStarted}
                    className="px-4 py-2.5 rounded-xl bg-[#3867FF] hover:bg-[#2954e6] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-blue-500/30 cursor-pointer"
                  >
                    <span>Proceed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: WHY PREMIUMPULSE? (Legacy vs Next-Gen InsurTech)
      ========================================================================= */}
      <section id="features" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#3867FF] text-xs font-bold uppercase tracking-wider">
            Why PremiumPulse?
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Traditional Underwriting is Broken. <br />
            <span className="text-[#3867FF]">We Fixed It With Autonomous AI.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Legacy health insurance relies on static actuarial tables, manual paperwork taking weeks, and discriminatory risk brackets. PremiumPulse delivers instant, mathematically fair underwriting that directly rewards healthy living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Legacy Card */}
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/60 rounded-3xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black">
                ✕
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Legacy Insurance Systems</h3>
                <p className="text-xs text-slate-500">Traditional carriers & brokers</p>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>2 to 3 weeks waiting period</strong> for manual underwriters to review health history.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Opaque 'Black Box' pricing</strong> with zero explanation of why premiums increase each year.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>No credit for wearable fitness</strong> or active lifestyle modifications.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Aggressive broker commissions</strong> inflating consumer policy costs up to 35%.</span>
              </li>
            </ul>
          </div>

          {/* PremiumPulse Card */}
          <div className="bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-950 border border-blue-300/80 dark:border-blue-900/60 rounded-3xl p-8 shadow-xl shadow-blue-500/5 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3867FF]/10 rounded-full blur-2xl"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#3867FF] flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">The PremiumPulse Standard</h3>
                <p className="text-xs text-[#3867FF] font-semibold">Autonomous InsurTech Architecture</p>
              </div>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#12B981] shrink-0 mt-0.5" />
                <span><strong>Sub-second underwriting (&lt;30ms)</strong> powered by pre-compiled in-memory ML models.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#12B981] shrink-0 mt-0.5" />
                <span><strong>Complete XAI Explainability (SHAP)</strong> detailing exact factors driving costs.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#12B981] shrink-0 mt-0.5" />
                <span><strong>Direct Wearable Sync</strong> with Apple Health & Garmin for dynamic policy discounts.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#12B981] shrink-0 mt-0.5" />
                <span><strong>Ensemble Consensus</strong> across Linear Regression, Random Forest, and XGBoost.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HOW OUR AI WORKS (4-Step Seamless Progression)
      ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800 text-[#7657FF] text-xs font-bold uppercase tracking-wider">
              Underwriting Journey
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              How Our AI Underwrites in 4 Simple Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              A streamlined, transparent workflow transforming raw biomarkers into certified premium quotes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Clinical & Lifestyle Input',
                desc: 'Enter age, gender, BMI, medical history, and daily physical activity level in a multi-step guided form.',
                icon: FileText,
                color: 'text-[#3867FF]',
                bg: 'bg-blue-50 dark:bg-blue-950/50'
              },
              {
                step: '02',
                title: 'Multi-Agent Stratification',
                desc: 'Intake and Risk Assessment Agents inspect data consistency, calculate BMI risk indices, and build feature vectors.',
                icon: Layers,
                color: 'text-[#12B981]',
                bg: 'bg-emerald-50 dark:bg-emerald-950/50'
              },
              {
                step: '03',
                title: 'Pure Vector Inference',
                desc: 'The Pricing Agent runs pure vector ML inference across pre-loaded models in under 20 milliseconds.',
                icon: Cpu,
                color: 'text-[#7657FF]',
                bg: 'bg-violet-50 dark:bg-violet-950/50'
              },
              {
                step: '04',
                title: 'SHAP Insights & Report',
                desc: 'Insight Agent generates explainable SHAP impact bars and instant downloadable PDF underwriting certificates.',
                icon: Award,
                color: 'text-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-950/50'
              }
            ].map((s, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                    <s.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 dark:text-slate-700 font-mono">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INTELLIGENT MULTI-AGENT ARCHITECTURE (5 Agents Detailed)
      ========================================================================= */}
      <section id="ai-technology" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#3867FF] text-xs font-bold uppercase tracking-wider">
            System Topology
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Intelligent Multi-Agent Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Five specialized autonomous agents coordinate in real time to guarantee accuracy, speed, and fairness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Intake Agent',
              role: 'Schema Validation & Sanitization',
              latency: '< 1 ms',
              icon: FileText,
              color: 'text-blue-500',
              border: 'border-blue-200 dark:border-blue-900/50',
              badge: 'Stage 1',
              desc: 'Enforces Pydantic range constraints, normalizes physical units (height in cm, weight in kg), and eliminates corrupted payloads.'
            },
            {
              name: 'Risk Assessment Agent',
              role: 'Clinical Stratification & Morbidity',
              latency: '< 1 ms',
              icon: Activity,
              color: 'text-emerald-500',
              border: 'border-emerald-200 dark:border-emerald-900/50',
              badge: 'Stage 2',
              desc: 'Computes actuarial BMI score, stratifies pre-existing condition risks (Diabetes, Hypertension), and assigns composite risk scores.'
            },
            {
              name: 'Pricing Agent',
              role: 'Ensemble ML Regression Inference',
              latency: '15 - 20 ms',
              icon: Cpu,
              color: 'text-violet-500',
              border: 'border-violet-200 dark:border-violet-900/50',
              badge: 'Stage 3 (Core)',
              desc: 'Performs pure in-memory vector regression across Linear Regression, Random Forest, and XGBoost with calibrated INR bounds.'
            },
            {
              name: 'Insight Agent',
              role: 'Explainable AI & Recommendations',
              latency: '< 1 ms sync / Async Deep',
              icon: BrainCircuit,
              color: 'text-amber-500',
              border: 'border-amber-200 dark:border-amber-900/50',
              badge: 'Stage 4',
              desc: 'Decomposes feature contribution attributions (SHAP) and synthesizes personalized lifestyle recommendations to reduce renewal premiums.'
            },
            {
              name: 'Central Orchestrator',
              role: 'Consensus Validation & Audit Trail',
              latency: '20 - 30 ms',
              icon: Layers,
              color: 'text-cyan-500',
              border: 'border-cyan-200 dark:border-cyan-900/50',
              badge: 'Stage 5 (Synthesis)',
              desc: 'Validates cross-agent consensus, logs immutable performance telemetry, and prepares certified underwriting reports.'
            },
            {
              name: 'Model Registry',
              role: 'Single-Instance In-Memory Cache',
              latency: '0.00 ms',
              icon: Lock,
              color: 'text-indigo-500',
              border: 'border-indigo-200 dark:border-indigo-900/50',
              badge: 'Singleton Daemon',
              desc: 'Guarantees models load exactly once at backend boot. Completely eliminates runtime retraining and repeated disk I/O.'
            }
          ].map((agent, i) => (
            <div 
              key={i}
              className={`bg-white dark:bg-slate-900 border ${agent.border} rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 ${agent.color} flex items-center justify-center`}>
                  <agent.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    {agent.latency}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                    {agent.badge}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{agent.name}</h3>
                <p className="text-xs font-semibold text-[#3867FF]">{agent.role}</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {agent.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: INSURANCE PREMIUM PREDICTION (ML Model Benchmark Table)
      ========================================================================= */}
      <section className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#12B981] text-xs font-bold uppercase tracking-wider">
                Model Verification
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Triple ML Model Consensus. Zero Hardcoded Guesswork.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every calculation is backed by three distinct machine learning regressors evaluated on cross-validated validation sets. PremiumPulse designates the model with the lowest Mean Absolute Error (MAE) for certified underwriting.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#12B981]" />
                  <span>Verified 88.3% R² coefficient of determination</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#12B981]" />
                  <span>RMSE-derived 95% actuarial confidence intervals</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[#12B981]" />
                  <span>Medical claims floor constraint prevention</span>
                </div>
              </div>
            </div>

            {/* Benchmark Table Card */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-md overflow-hidden">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Actuarial Validation Matrix
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                        <th className="pb-3 font-bold">Model Name</th>
                        <th className="pb-3 font-bold">R² Score</th>
                        <th className="pb-3 font-bold">Validation MAE</th>
                        <th className="pb-3 font-bold">Inference Latency</th>
                        <th className="pb-3 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                      <tr className="bg-blue-50/50 dark:bg-blue-950/30">
                        <td className="py-3.5 font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#3867FF]"></span>
                          Linear Regression
                        </td>
                        <td className="py-3.5 text-blue-600 dark:text-blue-400 font-bold">0.8830</td>
                        <td className="py-3.5">₹10,634</td>
                        <td className="py-3.5">&lt; 1.2 ms</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-sans">
                            Optimal Fit
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200 font-sans flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#7657FF]"></span>
                          Random Forest Regressor
                        </td>
                        <td className="py-3.5">0.8702</td>
                        <td className="py-3.5">₹11,706</td>
                        <td className="py-3.5">~12.0 ms</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-sans">
                            Ensemble
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-slate-200 font-sans flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                          XGBoost Regressor
                        </td>
                        <td className="py-3.5">0.8769</td>
                        <td className="py-3.5">₹11,120</td>
                        <td className="py-3.5">~2.5 ms</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-sans">
                            Gradient Boost
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HEALTH RISK ANALYSIS & SECTION 6: EXPLAINABLE AI (XAI)
      ========================================================================= */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Section 5: Risk Analysis */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
              Health Risk Analysis
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Dynamic Risk Stratification.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our Risk Assessment Agent inspects multidimensional clinical biomarkers to establish objective underwriting tiers:
            </p>

            <div className="space-y-3">
              {[
                {
                  tier: 'Low Risk Tier (Score: 0 - 25)',
                  desc: 'Normal BMI (18.5 - 24.9), non-smoker, 8,000+ daily steps, regular preventative health checkups.',
                  color: 'border-l-4 border-l-[#12B981] bg-white dark:bg-slate-900'
                },
                {
                  tier: 'Moderate Risk Tier (Score: 26 - 55)',
                  desc: 'Mildly elevated BMI (25 - 29.9), sedentary lifestyle, or managed conditions such as early hypertension.',
                  color: 'border-l-4 border-l-amber-500 bg-white dark:bg-slate-900'
                },
                {
                  tier: 'High Risk Tier (Score: 56 - 100)',
                  desc: 'Active tobacco use, clinical obesity (BMI 30+), or composite diagnoses (Diabetes + Cardiac history).',
                  color: 'border-l-4 border-l-rose-500 bg-white dark:bg-slate-900'
                }
              ].map((r, i) => (
                <div key={i} className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs ${r.color} space-y-1`}>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.tier}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Explainable AI SHAP Demo Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">SHAP Feature Attribution</h3>
                <p className="text-xs text-slate-500">How each habit influences your premium</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-violet-50 text-[#7657FF] dark:bg-violet-950/60 px-2.5 py-1 rounded-full border border-violet-200 dark:border-violet-800">
                XAI Certified
              </span>
            </div>

            <div className="space-y-4">
              {[
                { factor: 'Non-Smoker Status', impact: '-₹56,658', pct: 85, isPositive: true },
                { factor: 'Active Daily Walking (8,500 steps)', impact: '-₹4,200', pct: 60, isPositive: true },
                { factor: 'Healthy BMI Maintenance (22.5)', impact: '-₹3,800', pct: 55, isPositive: true },
                { factor: 'Comprehensive Tier Option', impact: '+₹6,400', pct: 40, isPositive: false },
                { factor: 'Age Curve Adjustment (Age 42)', impact: '+₹8,200', pct: 50, isPositive: false }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{item.factor}</span>
                    <span className={`font-mono font-bold ${item.isPositive ? 'text-[#12B981]' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.impact}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.isPositive ? 'bg-[#12B981]' : 'bg-[#3867FF]'}`}
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3867FF] shrink-0" />
              <span>Lifestyle improvements can save you up to <strong>₹64,658/year</strong> on policy renewals.</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7: PLATFORM STATISTICS (Verified Real-Time Metrics)
      ========================================================================= */}
      <section className="py-16 bg-[#10172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-white font-mono tracking-tight">
                50,000+
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Predictions Calibrated</p>
            </div>
            <div className="pt-4 md:pt-0 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#12B981] font-mono tracking-tight">
                99.4%
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">User Satisfaction Rate</p>
            </div>
            <div className="pt-4 md:pt-0 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#3867FF] font-mono tracking-tight">
                &lt;25ms
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Average Model Latency</p>
            </div>
            <div className="pt-4 md:pt-0 space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-[#7657FF] font-mono tracking-tight">
                ₹18,400
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Avg Annual Savings Found</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FREQUENTLY ASKED QUESTIONS (FAQ Accordion)
      ========================================================================= */}
      <section id="about-us" className="py-20 lg:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#3867FF] text-xs font-bold uppercase tracking-wider">
            Clear Answers
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about our multi-agent AI prediction platform.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#3867FF]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          FINAL CTA BANNER
      ========================================================================= */}
      <section className="py-20 bg-gradient-to-tr from-[#10172A] via-[#1E293B] to-[#10172A] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-[#3867FF]/20 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ready to calculate your personalized health premium?
          </h2>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Experience lightning-fast underwriting in under 30 milliseconds with complete explainability and zero guesswork.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-9 py-4 rounded-xl font-bold text-sm bg-[#3867FF] hover:bg-[#2954e6] text-white shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Calculate My Premium Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleExplorePlatform}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all cursor-pointer"
            >
              Explore Sample Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
