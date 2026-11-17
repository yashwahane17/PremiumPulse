import React, { useState, useEffect } from 'react';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';
import { 
  Layers, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Calendar, 
  DollarSign, 
  Activity, 
  FileText,
  RefreshCw,
  Zap,
  TrendingUp,
  BrainCircuit,
  Scale
} from 'lucide-react';

export default function AdminPredictionsPage() {
  const { showToast } = useToast();

  const [predictions, setPredictions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (riskFilter) params.risk = riskFilter;
      if (modelFilter) params.model = modelFilter;

      const data = await api.getAdminPredictions(params);
      const predList = Array.isArray(data) ? data : (data.predictions || []);
      setPredictions(predList);
      setTotal(data.total !== undefined ? data.total : predList.length);
    } catch (err) {
      console.error('Failed to load predictions:', err);
      showToast('Failed to load predictions stream', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [riskFilter, modelFilter]);

  const handleOpenDetail = async (id) => {
    setModalLoading(true);
    try {
      const detail = await api.getPredictionDetail(id);
      setSelectedPrediction(detail);
    } catch (err) {
      showToast('Failed to load prediction details: ' + err.message, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDownloadPdf = async (id) => {
    setDownloadingId(id);
    try {
      await api.downloadReportPdf(id);
      showToast(`Policy report #${id} downloaded successfully.`, 'success');
    } catch (err) {
      showToast(err.message || 'Download failed', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            Prediction Telemetry & Actuarial Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time inference logs, model routing decisions, risk strata, and policy cost projections.
          </p>
        </div>

        <button
          onClick={fetchPredictions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stream</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Filter Records:</span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:border-cyan-500"
          >
            <option value="">All Risk Tiers</option>
            <option value="Low Risk">Low Risk</option>
            <option value="Moderate Risk">Moderate Risk</option>
            <option value="High Risk">High Risk</option>
          </select>

          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 focus:border-cyan-500"
          >
            <option value="">All ML Engines</option>
            <option value="XGBoost Regressor">XGBoost Regressor</option>
            <option value="Random Forest Regressor">Random Forest Regressor</option>
            <option value="Linear Regression">Linear Regression</option>
          </select>
        </div>
      </div>

      {/* Predictions Table */}
      <div className="bg-[#0F172A] rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold">
          <span>Found {predictions.length} inference events</span>
          <span className="text-[11px] text-cyan-400 font-mono">SQLite Stream Synced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/80 text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Predicted Premium</th>
                <th className="py-3 px-4">Risk Category</th>
                <th className="py-3 px-4">BMI</th>
                <th className="py-3 px-4">Selected Engine</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    <span>Loading prediction events...</span>
                  </td>
                </tr>
              ) : predictions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-semibold text-slate-400">No predictions found</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Run a new prediction from the customer portal to populate logs.</p>
                  </td>
                </tr>
              ) : (
                predictions.map((p) => {
                  const riskColor = 
                    p.risk_category === 'Low Risk' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' :
                    p.risk_category === 'Moderate Risk' ? 'bg-amber-950/80 text-amber-400 border-amber-800' :
                    'bg-rose-950/80 text-rose-400 border-rose-800';

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        #{p.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{p.user_name || 'Customer'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{p.user_email || 'N/A'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-sm font-black text-white font-mono">
                          ₹{p.predicted_premium_inr?.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Range: ₹{p.premium_range_min?.toLocaleString('en-IN')} - ₹{p.premium_range_max?.toLocaleString('en-IN')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${riskColor}`}>
                          {p.risk_category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                        {p.bmi}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                          <Cpu className="w-3 h-3 text-cyan-400" />
                          {p.model_used}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(p.created_at).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(p.id)}
                            title="Inspect Prediction Audit & SHAP"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(p.id)}
                            disabled={downloadingId === p.id}
                            title="Download Policy PDF"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer border border-slate-800"
                          >
                            {downloadingId === p.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedPrediction && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#0F172A] rounded-3xl max-w-3xl w-full border border-slate-800 shadow-2xl overflow-hidden my-8 text-xs text-slate-300">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">
                  Actuarial Audit Detail
                </span>
                <h3 className="text-lg font-black mt-0.5">
                  Prediction Event #{selectedPrediction.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto dark-scroll">
              {/* Top Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-800/60">
                  <div className="text-[10px] font-bold text-cyan-400 uppercase">Estimated Premium</div>
                  <div className="text-xl font-black text-white mt-1 font-mono">
                    ₹{selectedPrediction.predicted_premium_inr?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    Range: ₹{selectedPrediction.premium_range_min?.toLocaleString('en-IN')} - ₹{selectedPrediction.premium_range_max?.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-violet-800/60">
                  <div className="text-[10px] font-bold text-violet-400 uppercase">Selected Engine</div>
                  <div className="text-sm font-black text-white mt-1">
                    {selectedPrediction.model_used}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    R²: {selectedPrediction.model_r2} | MAE: ₹{selectedPrediction.model_mae?.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Risk Tier & BMI</div>
                  <div className="text-sm font-black text-emerald-400 mt-1">
                    {selectedPrediction.risk_category}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    BMI: <span className="font-bold text-white">{selectedPrediction.bmi}</span>
                  </div>
                </div>
              </div>

              {/* Multi-Model Regressor Outputs */}
              {selectedPrediction.model_comparisons && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Concurrent Multi-Model Regressor Outputs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">XGBoost</div>
                      <div className="text-sm font-black text-cyan-400 mt-1 font-mono">
                        ₹{selectedPrediction.model_comparisons['XGBoost']?.toLocaleString('en-IN') || 'N/A'}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Random Forest</div>
                      <div className="text-sm font-black text-slate-200 mt-1 font-mono">
                        ₹{selectedPrediction.model_comparisons['Random Forest']?.toLocaleString('en-IN') || 'N/A'}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Linear Reg.</div>
                      <div className="text-sm font-black text-slate-300 mt-1 font-mono">
                        ₹{selectedPrediction.model_comparisons['Linear Regression']?.toLocaleString('en-IN') || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Explainable AI Factors */}
              {selectedPrediction.influencing_factors && selectedPrediction.influencing_factors.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-violet-400" />
                    <span>Key Risk & Pricing Influencing Drivers (SHAP)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {selectedPrediction.influencing_factors.map((f, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">{f.feature}</div>
                          <div className="text-[10px] text-slate-400">{f.description}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          f.impact === 'High Increase' || f.impact === 'High Impact'
                            ? 'bg-rose-950 text-rose-400 border-rose-800'
                            : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        }`}>
                          {f.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Natural Language Explanation */}
              {selectedPrediction.explanation && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-900/60 text-slate-300 space-y-1">
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Agent Generated Actuarial Rationale</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedPrediction.explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDownloadPdf(selectedPrediction.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Certificate</span>
              </button>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
