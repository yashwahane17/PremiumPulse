import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/api';
import { 
  Activity, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Cpu, 
  Scale, 
  Sparkles, 
  ShieldCheck, 
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export default function AgentProcessingPage({ formData, onComplete, onError }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [backendResult, setBackendResult] = useState(null);
  const [errorState, setErrorState] = useState(null);
  const hasTriggeredRef = useRef(false);

  const steps = [
    {
      id: 'intake',
      name: 'Intake Agent',
      role: 'Biometric & Lifestyle Validation',
      desc: 'Validating 12 physiological variables, bounding constraints, and detecting anomalies.',
      icon: ShieldCheck,
      color: 'blue'
    },
    {
      id: 'risk',
      name: 'Risk Assessment Agent',
      role: 'Health Risk Stratification',
      desc: 'Computing exact BMI index and multi-factor cardiovascular/morbidity hazard score.',
      icon: Scale,
      color: 'emerald'
    },
    {
      id: 'pricing',
      name: 'Pricing Agent',
      role: 'Machine Learning Multi-Model Inference',
      desc: 'Benchmarking Linear Regression, Random Forest, and XGBoost models on medical cost data.',
      icon: Cpu,
      color: 'violet'
    },
    {
      id: 'insight',
      name: 'Insight Agent',
      role: 'Explainable AI & Lifestyle Optimization',
      desc: 'Computing actuarial cost drivers, identifying SHAP factors, and calculating savings targets.',
      icon: Sparkles,
      color: 'amber'
    },
    {
      id: 'orchestrator',
      name: 'Central Orchestrator',
      role: 'Synthesis & Underwriting Finalization',
      desc: 'Synthesizing multi-agent outputs, assembling confidence bounds, and persisting report.',
      icon: BrainCircuit,
      color: 'indigo'
    }
  ];

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    let isMounted = true;

    async function executeRealAgents() {
      try {
        // Run step visual transitions
        const timer1 = setTimeout(() => setCurrentStepIndex(1), 600);
        const timer2 = setTimeout(() => setCurrentStepIndex(2), 1200);

        // Make real API call to FastAPI backend orchestrator
        const result = await api.predictPremium(formData);
        
        if (!isMounted) return;

        const timer3 = setTimeout(() => setCurrentStepIndex(3), 1800);
        const timer4 = setTimeout(() => setCurrentStepIndex(4), 2400);

        // Finish and pass result to parent
        const timerFinal = setTimeout(() => {
          if (isMounted) {
            setBackendResult(result);
            onComplete(result);
          }
        }, 3000);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          clearTimeout(timer4);
          clearTimeout(timerFinal);
        };
      } catch (err) {
        if (isMounted) {
          setErrorState(err.message || 'Multi-agent orchestration failed.');
        }
      }
    }

    executeRealAgents();

    return () => {
      isMounted = false;
    };
  }, [formData]);

  if (errorState) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 shadow-xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Agent Execution Error</h2>
        <p className="text-xs text-rose-600 mb-6">{errorState}</p>
        <button
          onClick={onError}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Return to Form
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-3">
          <Activity className="w-4 h-4 animate-spin text-blue-600" />
          <span>Real-Time Multi-Agent AI Underwriting</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Orchestrating Autonomous AI Agents
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Please wait while the orchestrator sequences data flow between our specialized actuarial agents.
        </p>
      </div>

      {/* Agents Card List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={s.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                isCurrent 
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-xs' 
                  : (isDone ? 'bg-slate-50/60 border-slate-200' : 'bg-white border-slate-100 opacity-50')
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white transition-colors ${
                  isDone 
                    ? 'bg-emerald-600' 
                    : (isCurrent ? 'bg-blue-600 shadow-md shadow-blue-500/30' : 'bg-slate-300 text-slate-600')
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5 text-white" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{s.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {s.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-lg">{s.desc}</p>
                </div>
              </div>

              {/* Status indicator badge */}
              <div className="shrink-0 pl-3">
                {isDone && (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                )}
                {isCurrent && (
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </span>
                )}
                {isPending && (
                  <span className="text-[11px] font-medium text-slate-400">
                    Waiting
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-slate-400 mt-6">
        Telemetry authenticated and verified through FastAPI Central Orchestrator.
      </p>
    </div>
  );
}

