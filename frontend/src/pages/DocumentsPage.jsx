import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  RefreshCw,
  Cpu,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export default function DocumentsPage() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const history = await api.getHistory();
      setDocuments(history || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
      showToast('Failed to load document records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownloadPdf = async (id, e) => {
    if (e) e.stopPropagation();
    setDownloadingId(id);
    try {
      await api.downloadReportPdf(id);
      showToast(`Document #${id} downloaded successfully.`, 'success');
    } catch (err) {
      showToast(err.message || 'Download failed', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const model = (doc.model_used || '').toLowerCase();
    const risk = (doc.risk_category || '').toLowerCase();
    const idStr = String(doc.id);
    return model.includes(q) || risk.includes(q) || idStr.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-600" />
            Underwriting Certificates & Generated Reports
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Archived PDF policy prediction reports and actuarial risk assessment certificates.
          </p>
        </div>

        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Documents</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by certificate ID, model used, or risk tier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs font-medium border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800"
          />
        </div>
      </div>

      {/* Documents Grid / Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
          <span className="text-xs font-semibold">Loading document archive...</span>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-800">No documents found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Run an insurance premium estimate to automatically generate and archive an actuarial certificate.
          </p>
          <button
            onClick={() => navigate('/predict')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
          >
            Generate First Estimate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                      PDF
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        Certificate #{doc.id}
                      </h4>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{doc.date_formatted || doc.created_at?.slice(0, 10)}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    doc.risk_category === 'Low Risk' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    doc.risk_category === 'Moderate Risk' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {doc.risk_category}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Quoted Premium</span>
                    <span className="font-black text-slate-900">
                      ₹{doc.predicted_premium_inr?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Engine</span>
                    <span className="text-[11px] font-semibold text-violet-700">
                      {doc.model_used || 'XGBoost'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span>BMI At Generation</span>
                    <span className="font-mono text-slate-700">{doc.bmi}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">Official Audit Certificate</span>
                <button
                  onClick={(e) => handleDownloadPdf(doc.id, e)}
                  disabled={downloadingId === doc.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Download className={`w-3.5 h-3.5 ${downloadingId === doc.id ? 'animate-bounce' : ''}`} />
                  <span>{downloadingId === doc.id ? 'Downloading...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

