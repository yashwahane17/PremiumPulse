import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  ShieldCheck, 
  BrainCircuit, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Cpu, 
  FileText, 
  Watch, 
  Scale, 
  Zap, 
  Award, 
  HeartHandshake 
} from 'lucide-react';

export default function LandingPage({ setActivePage }) {
  const { user, quickDemoLogin } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      setActivePage('predict');
    } else {
      setActivePage('auth');
    }
  };

  const handleDemoClick = async () => {
    await quickDemoLogin();
    setActivePage('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white">
        {/* Subtle background glow spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Agent AI Underwriting Platform • The Big Hack 2026</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-6">
              Smarter Health. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-violet-400">
                Fairer Insurance.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
              Predict your precise health insurance premium with explainable AI. Four specialized autonomous agents analyze physiological biomarkers, lifestyle telemetry, and clinical risk to eliminate underwriting bias and reward healthy living.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{user ? 'Launch Prediction Engine' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleDemoClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-violet-300" />
                <span>Explore Demo Profile</span>
              </button>
            </div>

            {/* Key stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-slate-800/80">
              <div className="text-left bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-2xl sm:text-3xl font-black text-blue-400">0.883</div>
                <div className="text-xs text-slate-400 mt-0.5">Model Accuracy (R² Score)</div>
              </div>
              <div className="text-left bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-2xl sm:text-3xl font-black text-violet-400">4 Agents</div>
                <div className="text-xs text-slate-400 mt-0.5">Autonomous Pipeline</div>
              </div>
              <div className="text-left bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">3 Models</div>
                <div className="text-xs text-slate-400 mt-0.5">Benchmarked in Real-Time</div>
              </div>
              <div className="text-left bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">&lt;200ms</div>
                <div className="text-xs text-slate-400 mt-0.5">End-to-End Latency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md">
            Workflow Architecture
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-3">
            How PremiumPulse Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            A frictionless 4-step pipeline powered by machine learning and multi-agent coordination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Telemetry Intake',
              desc: 'Input personal biometric metrics, smoking history, exercise habits, and chronic conditions.',
              icon: FileText,
              color: 'text-blue-600 bg-blue-50 border-blue-200'
            },
            {
              step: '02',
              title: 'Risk Stratification',
              desc: 'Biometric BMI computation and cardiovascular hazard modeling assign an actuarial risk category.',
              icon: Scale,
              color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
            },
            {
              step: '03',
              title: 'Multi-Model Pricing',
              desc: 'Inference across Linear Regression, Random Forest, and XGBoost with automatic best-model selection.',
              icon: Cpu,
              color: 'text-violet-600 bg-violet-50 border-violet-200'
            },
            {
              step: '04',
              title: 'Explainable XAI',
              desc: 'Insight Agent breaks down primary cost drivers and identifies concrete lifestyle changes to lower premiums.',
              icon: Sparkles,
              color: 'text-amber-600 bg-amber-50 border-amber-200'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MULTI-AGENT ARCHITECTURE SHOWCASE */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest bg-violet-950 px-3 py-1 rounded-md border border-violet-800">
              Core Multi-Agent Engine
            </span>
            <h2 className="text-3xl font-black tracking-tight mt-3">
              Four Independent AI Agents + One Orchestrator
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Each autonomous agent specializes in a distinct underwriting discipline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Agent 1 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  Agent 1
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Intake Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Collects, sanitizes, and bounds-checks 12 input parameters. Flags physiological anomalies and normalizes data.
              </p>
              <div className="text-[11px] text-blue-300 font-medium">✓ Anomaly bounds checking</div>
              <div className="text-[11px] text-blue-300 font-medium">✓ Lifestyle consistency checks</div>
            </div>

            {/* Agent 2 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Agent 2
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Risk Assessment Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Computes exact BMI and applies a multi-factor clinical scoring matrix (0-100) across tobacco, obesity, and activity.
              </p>
              <div className="text-[11px] text-emerald-300 font-medium">✓ Low / Moderate / High tiers</div>
              <div className="text-[11px] text-emerald-300 font-medium">✓ Interaction penalty modeling</div>
            </div>

            {/* Agent 3 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-950 px-2 py-0.5 rounded border border-violet-800">
                  Agent 3
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Pricing Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Executes Linear Regression, Random Forest, and XGBoost models trained on medical costs. Selects optimal model.
              </p>
              <div className="text-[11px] text-violet-300 font-medium">✓ Native INR (₹) calibration</div>
              <div className="text-[11px] text-violet-300 font-medium">✓ Uncertainty confidence interval</div>
            </div>

            {/* Agent 4 */}
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                  Agent 4
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Insight Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Explains predictions in plain English, quantifies top cost drivers, and calculates concrete rupee savings targets.
              </p>
              <div className="text-[11px] text-amber-300 font-medium">✓ Actionable lifestyle savings</div>
              <div className="text-[11px] text-amber-300 font-medium">✓ LLM / Rule-based dual engine</div>
            </div>
          </div>

          {/* Orchestrator Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-violet-900/60 border border-blue-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Central Orchestrator Agent</h4>
                <p className="text-xs text-slate-300">
                  Sequences data flow across all 4 agents, logs sub-millisecond execution telemetry, and compiles the final underwriting record.
                </p>
              </div>
            </div>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            >
              Test Live Pipeline
            </button>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES & FEATURES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md">
            Product Features
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 mt-3">
            Built for Modern InsurTech Demands
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Combining rigorous actuarial models with intuitive digital experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Multi-Model Benchmarking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time side-by-side comparison of Linear Regression (R² 0.88), Random Forest (R² 0.87), and XGBoost (R² 0.88) eliminates single-model bias.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Watch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Wearable Telemetry Sync</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect daily steps, resting heart rate, and weight from smartwatches. PremiumPulse immediately recalculates policy premiums when health metrics improve.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Automated PDF Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download comprehensive underwriting reports complete with risk category badges, model comparison tables, XAI cost drivers, and agent execution audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">
            Discover Your True Health Insurance Premium
          </h2>
          <p className="text-blue-100 text-sm mb-8 max-w-xl mx-auto">
            Experience the future of transparent, AI-driven actuarial underwriting today.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-blue-700 hover:bg-blue-50 shadow-lg shadow-black/10 transition-all cursor-pointer"
          >
            Calculate Your Premium Now
          </button>
        </div>
      </section>
    </div>
  );
}

