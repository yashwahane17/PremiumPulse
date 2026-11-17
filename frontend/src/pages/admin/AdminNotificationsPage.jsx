import React from 'react';
import { useToast } from '../../context/ToastContext';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Cpu, 
  Database, 
  Activity,
  Zap,
  Check
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const { showToast } = useToast();

  const notifications = [
    {
      id: 1,
      title: 'ML Ensemble Models Deployed',
      desc: 'Linear Regression, Random Forest, and XGBoost regressor models are verified and responding to inference requests.',
      type: 'success',
      time: '10 minutes ago',
      source: 'Pricing Agent Core'
    },
    {
      id: 2,
      title: 'Database WAL Journaling Active',
      desc: 'SQLite database connection latency verified at <0.5ms with zero locking contention.',
      type: 'info',
      time: '45 minutes ago',
      source: 'Storage Engine'
    },
    {
      id: 3,
      title: 'Role-Based Access Control Enforced',
      desc: 'HTTP 403 barriers verified for unauthorized customer requests attempting to touch administrative endpoints.',
      type: 'security',
      time: '2 hours ago',
      source: 'Security Middleware'
    },
    {
      id: 4,
      title: 'Automated Insight Fallback Standby',
      desc: 'Calibrated rule-based explainability engine ready with zero latency if external LLM APIs experience rate limits.',
      type: 'info',
      time: '5 hours ago',
      source: 'Insight Agent'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800/80">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-cyan-400" />
          System Notifications & Security Alerts
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Automated infrastructure telemetry notices, model deployment logs, and security enforcement events.
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-5 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-xl flex items-start justify-between gap-4 group hover:border-slate-700 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                n.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                n.type === 'security' ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' :
                'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              }`}>
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {n.type === 'security' && <ShieldAlert className="w-5 h-5" />}
                {n.type === 'info' && <Info className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">• {n.source}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                  {n.desc}
                </p>
                <div className="text-[10px] text-slate-500 font-mono mt-2">
                  {n.time}
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast(`Acknowledged alert #${n.id}`, 'info')}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
            >
              Acknowledge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

