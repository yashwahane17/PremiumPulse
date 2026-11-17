import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { api } from './api/api';

// Customer Layout & Modals
import CustomerLayout from './components/CustomerLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WearableModal from './components/WearableModal';
import CompareModal from './components/CompareModal';

// Customer Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PredictionFormPage from './pages/PredictionFormPage';
import AgentProcessingPage from './pages/AgentProcessingPage';
import PredictionResultPage from './pages/PredictionResultPage';
import HealthInsightsPage from './pages/HealthInsightsPage';
import HistoryPage from './pages/HistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import DocumentsPage from './pages/DocumentsPage';
import CustomerSettingsPage from './pages/CustomerSettingsPage';

// Admin Portal Components
import AdminLayout from './components/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPredictionsPage from './pages/admin/AdminPredictionsPage';
import AdminAgentsPage from './pages/admin/AdminAgentsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSystemHealthPage from './pages/admin/AdminSystemHealthPage';
import AdminActivityPage from './pages/admin/AdminActivityPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();
  const { currentPath, navigate } = useRouter();
  const { showToast } = useToast();

  // Multi-step predict state
  const [predictSubState, setPredictSubState] = useState('form'); // 'form' | 'processing' | 'result'
  const [activeFormData, setActiveFormData] = useState(null);
  const [activePrediction, setActivePrediction] = useState(null);

  // Global Modals
  const [wearableModalOpen, setWearableModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareHistoryData, setCompareHistoryData] = useState([]);

  // Bridge legacy setActivePage calls to new URL router
  const handleSetActivePage = (page) => {
    switch (page) {
      case 'landing':
        navigate('/');
        break;
      case 'auth':
        navigate('/login');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'predict':
        setPredictSubState('form');
        navigate('/predict');
        break;
      case 'processing':
        setPredictSubState('processing');
        navigate('/predict');
        break;
      case 'result':
        setPredictSubState('result');
        navigate('/predict');
        break;
      case 'insights':
        navigate('/health-insights');
        break;
      case 'history':
        navigate('/predictions/history');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'documents':
        navigate('/documents');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'admin-login':
        navigate('/admin/login');
        break;
      case 'admin-dashboard':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  // Predict flow handlers
  const handleSubmitForm = (formData) => {
    setActiveFormData(formData);
    setPredictSubState('processing');
  };

  const handleProcessingComplete = (predictionResult) => {
    setActivePrediction(predictionResult);
    setPredictSubState('result');
    showToast('Prediction pipeline completed successfully!', 'success');
  };

  const handleProcessingError = (err) => {
    setPredictSubState('form');
    showToast(err?.message || 'Prediction failed. Please check inputs.', 'error');
  };

  const handleViewPrediction = async (id) => {
    try {
      const detail = await api.getPredictionDetail(id);
      setActivePrediction(detail);
      setPredictSubState('result');
      navigate('/predict');
    } catch (err) {
      showToast('Failed to load prediction details: ' + err.message, 'error');
    }
  };

  const handleOpenCompare = (historyList) => {
    setCompareHistoryData(historyList);
    setCompareModalOpen(true);
  };

  const handleWearableSyncSuccess = (syncResponse) => {
    showToast('Wearable health metrics synced successfully!', 'success');
    if (syncResponse?.recalculated_prediction) {
      setActivePrediction(syncResponse.recalculated_prediction);
      setPredictSubState('result');
      navigate('/predict');
    } else {
      navigate('/dashboard');
    }
  };

  // =========================================================================
  // 1. ADMIN PORTAL ROUTING & RBAC ROUTE GUARDS (/admin/*)
  // =========================================================================
  if (currentPath.startsWith('/admin')) {
    // Admin Login Route
    if (currentPath === '/admin/login' || currentPath === '/admin') {
      if (user?.role === 'ADMIN') {
        return (
          <AdminLayout currentTab="dashboard">
            <AdminDashboardPage />
          </AdminLayout>
        );
      }
      return <AdminLoginPage />;
    }

    // Protected Admin Routes: Require authenticated ADMIN user
    if (!user) {
      return <AdminLoginPage />;
    }

    if (user.role !== 'ADMIN') {
      // Authenticated normal USER attempting admin route -> 403 Forbidden Screen
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-rose-900/60 rounded-3xl p-8 text-center shadow-2xl space-y-4 animate-slide-up">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-500 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">403 Forbidden: Administrator Access Required</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are currently authenticated as standard customer <strong className="text-white">{user.email}</strong> with role <span className="text-cyan-400 font-bold font-mono">USER</span>.
              Standard accounts cannot access the Enterprise Admin Portal.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                Return to Customer Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/admin/login');
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign In with Admin Account</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Authenticated ADMIN -> Dispatch to designated Admin Page inside AdminLayout
    const adminTab = currentPath.replace('/admin/', '');
    let AdminPageComponent = <AdminDashboardPage />;

    switch (adminTab) {
      case 'dashboard':
        AdminPageComponent = <AdminDashboardPage />;
        break;
      case 'users':
        AdminPageComponent = <AdminUsersPage />;
        break;
      case 'predictions':
        AdminPageComponent = <AdminPredictionsPage />;
        break;
      case 'agents':
        AdminPageComponent = <AdminAgentsPage />;
        break;
      case 'analytics':
        AdminPageComponent = <AdminAnalyticsPage />;
        break;
      case 'system-health':
        AdminPageComponent = <AdminSystemHealthPage />;
        break;
      case 'activity':
        AdminPageComponent = <AdminActivityPage />;
        break;
      case 'notifications':
        AdminPageComponent = <AdminNotificationsPage />;
        break;
      case 'settings':
        AdminPageComponent = <AdminSettingsPage />;
        break;
      default:
        AdminPageComponent = <AdminDashboardPage />;
    }

    return (
      <AdminLayout currentTab={adminTab || 'dashboard'}>
        {AdminPageComponent}
      </AdminLayout>
    );
  }

  // =========================================================================
  // 2. PUBLIC VISITORS (LANDING / AUTH)
  // =========================================================================
  if (currentPath === '/' || currentPath === '/landing') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar onOpenWearable={() => setWearableModalOpen(true)} />
        <main className="flex-1">
          <LandingPage setActivePage={handleSetActivePage} />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentPath === '/login' || currentPath === '/auth') {
    if (user) {
      navigate('/dashboard');
      return null;
    }
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar onOpenWearable={() => setWearableModalOpen(true)} />
        <main className="flex-1">
          <AuthPage initialMode="login" setActivePage={handleSetActivePage} />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentPath === '/register') {
    if (user) {
      navigate('/dashboard');
      return null;
    }
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar onOpenWearable={() => setWearableModalOpen(true)} />
        <main className="flex-1">
          <AuthPage initialMode="register" setActivePage={handleSetActivePage} />
        </main>
        <Footer />
      </div>
    );
  }

  // =========================================================================
  // 3. AUTHENTICATED CUSTOMER PORTAL (WRAPPED IN CUSTOMER LAYOUT)
  // =========================================================================
  // If not logged in and visiting protected customer pages -> redirect to login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar onOpenWearable={() => setWearableModalOpen(true)} />
        <main className="flex-1">
          <AuthPage initialMode="login" setActivePage={handleSetActivePage} />
        </main>
        <Footer />
      </div>
    );
  }

  // Dispatch Customer Page inside CustomerLayout
  let CustomerPageComponent = null;

  if (currentPath === '/dashboard') {
    CustomerPageComponent = (
      <DashboardPage 
        onOpenWearable={() => setWearableModalOpen(true)}
        onViewPrediction={handleViewPrediction}
      />
    );
  } else if (currentPath === '/predict') {
    if (predictSubState === 'processing') {
      CustomerPageComponent = (
        <AgentProcessingPage 
          formData={activeFormData} 
          onComplete={handleProcessingComplete}
          onError={handleProcessingError}
        />
      );
    } else if (predictSubState === 'result') {
      CustomerPageComponent = (
        <PredictionResultPage 
          prediction={activePrediction} 
          onRecalculate={() => setPredictSubState('form')}
          setActivePage={handleSetActivePage}
        />
      );
    } else {
      CustomerPageComponent = (
        <PredictionFormPage 
          onSubmitForm={handleSubmitForm} 
        />
      );
    }
  } else if (currentPath === '/health-insights' || currentPath === '/insights') {
    CustomerPageComponent = <HealthInsightsPage setActivePage={handleSetActivePage} />;
  } else if (currentPath === '/predictions/history' || currentPath === '/history') {
    CustomerPageComponent = (
      <HistoryPage 
        onViewPrediction={handleViewPrediction}
        onOpenCompare={handleOpenCompare}
      />
    );
  } else if (currentPath === '/profile') {
    CustomerPageComponent = <UserProfilePage />;
  } else if (currentPath === '/documents') {
    CustomerPageComponent = <DocumentsPage />;
  } else if (currentPath === '/settings') {
    CustomerPageComponent = <CustomerSettingsPage />;
  } else {
    CustomerPageComponent = (
      <DashboardPage 
        onOpenWearable={() => setWearableModalOpen(true)}
        onViewPrediction={handleViewPrediction}
      />
    );
  }

  return (
    <CustomerLayout onOpenWearable={() => setWearableModalOpen(true)}>
      {CustomerPageComponent}

      {/* Global Modals */}
      <WearableModal 
        isOpen={wearableModalOpen} 
        onClose={() => setWearableModalOpen(false)}
        onSyncSuccess={handleWearableSyncSuccess}
      />

      <CompareModal 
        isOpen={compareModalOpen} 
        onClose={() => setCompareModalOpen(false)}
        history={compareHistoryData}
      />
    </CustomerLayout>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <RouterProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </RouterProvider>
    </ToastProvider>
  );
}
