import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Cpu, 
  Activity, 
  RefreshCw,
  Workflow,
  Zap,
  ShieldCheck,
  Flame,
  Layers,
  ArrowRight,
  ChevronRight,
  Scale,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function AdminAgentsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminAgents();
      setData(res);
    } catch (err) {
      console.error('Failed to load agent metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const agentDescriptions = {
    'Intake Agent': 'Validates demographic, biometrics, lifestyle bounds, and data consistency.',
    'Risk Assessment Agent': 'Calculates BMI, evaluates cardiovascular risk factors, and stratifies into risk tiers.',
    'Pricing Agent': 'Executes multi-model inference (Linear Regression, Random Forest, XGBoost) and selects best model.',
    'Insight Agent': 'Generates natural language explainability, SHAP attribution, and wellness guidance.',
    'Central Orchestrator': 'Coordinates sequential pipeline execution, handles state transitions and fallbacks.'
  };

  const chartData = data?.agents?.map(a => ({
    name: a.agent_name.replace(' Agent', '').replace('Central ', ''),
    latency: a.avg_latency_ms,
    success: a.success_count,
    failed: a.failed_count
  })) || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            AI Multi-Agent Telemetry & Orchestrator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time latency monitoring, execution success rates, and fault tracing across all 4 AI agents and Orchestrator.
          </p>
        </div>

        <button
          onClick={fetchAgents}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Central Orchestrator Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1222] to-blue-950 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-black">Central Multi-Agent Orchestrator Pipeline</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {data?.orchestrator_status || 'OPERATIONAL'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Deterministic pipeline passing: Intake $\rightarrow$ Risk Assessment $\rightarrow$ Pricing Regressors $\rightarrow$ Insight Generator with automated rule-based fallback.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Active Agents: 4 / 4 Live</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ANIMATED AGENT WORKFLOW VISUALIZATION PIPELINE */}
      {/* Intake → Risk → Pricing → Insight → Final Result */}
      {/* ========================================================= */}
      <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Autonomous Execution Flow Sequence</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono">Sequential Pydantic Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Step 1: Intake Agent */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-blue-800/60 flex flex-col justify-between space-y-2 relative group hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">1</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Intake Agent</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Validates & bounds 12 features</p>
            </div>
            <span className="text-[9px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-900 self-start">
              Verified
            </span>
          </div>

          {/* Step 2: Risk Assessment Agent */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-800/60 flex flex-col justify-between space-y-2 relative group hover:border-emerald-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">2</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Risk Agent</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Calculates BMI & Risk Score</p>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900 self-start">
              Stratified
            </span>
          </div>

          {/* Step 3: Pricing Agent */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-violet-800/60 flex flex-col justify-between space-y-2 relative group hover:border-violet-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 font-bold text-xs flex items-center justify-center">3</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Pricing Agent</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">3 ML Regressors (XGBoost)</p>
            </div>
            <span className="text-[9px] font-mono text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-900 self-start">
              Evaluated
            </span>
          </div>

          {/* Step 4: Insight Agent */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-800/60 flex flex-col justify-between space-y-2 relative group hover:border-amber-500 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">4</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Insight Agent</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">SHAP drivers & explanation</p>
            </div>
            <span className="text-[9px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-900 self-start">
              Explainable AI
            </span>
          </div>

          {/* Step 5: Final Result Quote */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-950 to-blue-900 border border-cyan-700/80 flex flex-col justify-between space-y-2 relative shadow-lg">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-cyan-400/20 text-cyan-300 font-bold text-xs flex items-center justify-center">5</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Final Result</h4>
              <p className="text-[10px] text-cyan-200 mt-0.5">Synthesized quote & PDF</p>
            </div>
            <span className="text-[9px] font-mono text-cyan-200 bg-cyan-900/60 px-2 py-0.5 rounded self-start">
              Persisted
            </span>
          </div>
        </div>
      </div>

      {/* Agent Performance Cards (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.agents?.filter(a => !a.agent_name.includes('Orchestrator')).map((agent, idx) => {
          const successRate = agent.total_executions > 0 
            ? Math.round((agent.success_count / agent.total_executions) * 100) 
            : 100;

          return (
            <div 
              key={idx} 
              className="p-5 rounded-3xl border border-slate-800 bg-[#0F172A] shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs font-mono">
                    0{idx + 1}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    agent.status === 'OPERATIONAL' 
                      ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                      : 'bg-amber-950/80 text-amber-400 border-amber-800'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {agent.status}
                  </span>
                </div>

                <h3 className="font-black text-white text-sm">{agent.agent_name}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed min-h-[36px]">
                  {agentDescriptions[agent.agent_name] || 'Autonomous execution worker.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Executions</span>
                  <span className="font-bold text-white font-mono">{agent.total_executions}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Success Rate</span>
                  <span className="font-bold text-emerald-400 font-mono">{successRate}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Average Latency</span>
                  <span className="font-bold text-cyan-400 font-mono">{agent.avg_latency_ms} ms</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 text-[10px]">
                  <span>Last Executed</span>
                  <span className="font-mono text-slate-500 truncate max-w-[90px]">
                    {agent.last_execution ? agent.last_execution.split(' ')[1] : 'None'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latency Benchmark BarChart */}
      <div className="bg-[#0F172A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Agent Execution Latency Benchmark (Milliseconds)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Average execution time recorded in telemetry database</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} unit="ms" />
              <Tooltip 
                formatter={(val) => [`${val} ms`, 'Latency']}
                contentStyle={{ backgroundColor: '#090E1A', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Bar dataKey="latency" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Error & Warning Audit Logs */}
      <div className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Agent Fault & Error Audit Logs</h3>
          </div>
          <span className="text-xs text-slate-500">Past 20 events recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
                <th className="py-2.5 px-4">Event ID</th>
                <th className="py-2.5 px-4">Originating Agent</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Diagnostic Summary</th>
                <th className="py-2.5 px-4">Latency</th>
                <th className="py-2.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data?.recent_error_logs?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    <span className="font-semibold text-slate-300">Zero errors detected</span>
                    <p className="text-[11px] text-slate-500">All agents executing cleanly within normal tolerances.</p>
                  </td>
                </tr>
              ) : (
                data?.recent_error_logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">#{log.id}</td>
                    <td className="py-3 px-4 font-bold text-white">{log.agent_name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'ERROR' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{log.summary}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{log.execution_time_ms} ms</td>
                    <td className="py-3 px-4 text-slate-500">{log.created_at}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
